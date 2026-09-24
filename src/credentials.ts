import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import { spawnSync } from 'child_process';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Where Claude Code keeps a data dir's OAuth token — the one piece of this
 * extension that genuinely differs between operating systems.
 *
 *   Linux / WSL → a file, `<dir>/.credentials.json`.
 *   macOS       → a generic-password item in the login Keychain, written and
 *                 read through `/usr/bin/security`. `<dir>/.credentials.json`
 *                 still matters there: it is Claude Code's plaintext FALLBACK
 *                 when the Keychain refuses a write, and reads check the
 *                 Keychain first and that file second.
 *
 * Every rule below is taken from Claude Code's own macOS storage code (2.1.x
 * bundle), because a token written under any other name is simply invisible to
 * it:
 *
 *   service = "Claude Code-credentials"                 when CLAUDE_CONFIG_DIR is unset
 *             "Claude Code-credentials-<sha256[:8]>"    otherwise, hashing the dir
 *                                                        string itself (NFC)
 *   account = $USER || os.userInfo().username  ("claude-code-user" if unusual)
 *   value   = the same JSON the Linux file holds, written hex-encoded (-X) so
 *             no quoting can mangle it
 *
 * So each window's working dir gets its own Keychain item by construction, the
 * same way it gets its own file on Linux — the per-window isolation carries over
 * unchanged. The rest of the extension deals only in "this dir's token" through
 * this module and never needs to know which one it's talking to.
 */

/** File name of the token on Linux, and of Claude Code's plaintext fallback on macOS. */
export const TOKEN_FILE = '.credentials.json';

/**
 * `absent` is a definitive "no token here". `unknown` means the Keychain could
 * not be asked (locked, timed out) — and must NEVER be read as signed out: the
 * decisions riding on that answer (prune the account, treat it as a logout,
 * sign it out everywhere) are destructive. Linux never returns `unknown`.
 */
export type CredentialState = 'present' | 'absent' | 'unknown';

const usesKeychain = process.platform === 'darwin';

export function tokenFile(dir: string): string {
  return path.join(dir, TOKEN_FILE);
}

/**
 * Whether `dir` is Claude Code's default `~/.claude` — by location, not spelling:
 * `path.resolve` also drops a trailing slash, which an exported
 * `CLAUDE_CONFIG_DIR=~/.claude/` easily has.
 */
export function isDefaultConfigDir(dir: string): boolean {
  return path.resolve(dir) === path.resolve(os.homedir(), '.claude');
}
const isDefaultDir = isDefaultConfigDir;

/**
 * CLAUDE_CONFIG_DIR as this extension host INHERITED it — captured when the
 * bundle loads, before any bind rewrites process.env. A value pointing into
 * `~/.claude-windows` is another window's private working dir (a window opened
 * with `code` from that window's terminal inherits its environment) and is
 * never adopted: sharing it is the one thing the whole design rules out.
 */
const RAW_INHERITED_CONFIG_DIR = process.env.CLAUDE_CONFIG_DIR;
const INHERITED_CONFIG_DIR =
  RAW_INHERITED_CONFIG_DIR &&
  !path.resolve(RAW_INHERITED_CONFIG_DIR).startsWith(path.resolve(os.homedir(), '.claude-windows') + path.sep)
    ? RAW_INHERITED_CONFIG_DIR
    : undefined;

/** Another window's working dir, if that is what this host inherited — to be dropped. */
export function inheritedForeignWorkingDir(): string | undefined {
  return RAW_INHERITED_CONFIG_DIR && !INHERITED_CONFIG_DIR ? RAW_INHERITED_CONFIG_DIR : undefined;
}

/** What an unbound window's CLAUDE_CONFIG_DIR goes back to: the inherited value, if any. */
export function inheritedConfigDir(): string | undefined {
  return INHERITED_CONFIG_DIR || undefined;
}

/**
 * How the default `~/.claude` is run. Normally CLAUDE_CONFIG_DIR is unset for it,
 * but a user can export `CLAUDE_CONFIG_DIR=$HOME/.claude` — and VSCode inherits
 * the login shell's environment. Set is not the same as unset: Claude Code then
 * treats `~/.claude` like any other dir (hashed Keychain name, identity inside
 * the dir, not in `~/.claude.json`). Returns the literal value in that case,
 * undefined in the normal one.
 */
export function explicitDefaultDir(): string | undefined {
  return INHERITED_CONFIG_DIR && isDefaultDir(INHERITED_CONFIG_DIR) ? INHERITED_CONFIG_DIR : undefined;
}

// ─── Keychain naming (macOS) ──────────────────────────────────────────────────

/** The Keychain service Claude Code uses for `dir`. */
export function keychainService(dir: string): string {
  // Claude Code's OAUTH_FILE_SUFFIX: empty in production, "-custom-oauth" when a
  // custom OAuth endpoint is configured.
  const suffix = process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL ? '-custom-oauth' : '';
  let named = dir;
  if (isDefaultDir(dir)) {
    const explicit = explicitDefaultDir();
    if (!explicit) return `Claude Code${suffix}-credentials`;
    named = explicit; // hash exactly the string Claude Code sees
  }
  const hash = crypto.createHash('sha256').update(named.normalize('NFC')).digest('hex').slice(0, 8);
  return `Claude Code${suffix}-credentials-${hash}`;
}

/** The Keychain account Claude Code files its items under. */
export function keychainAccount(): string {
  let user: string;
  try {
    user = process.env.USER || os.userInfo().username;
  } catch {
    user = 'claude-code-user';
  }
  return /^[a-zA-Z0-9._-]+$/.test(user) ? user : 'claude-code-user';
}

// ─── The `security` CLI (macOS) ───────────────────────────────────────────────

const SECURITY = '/usr/bin/security';
/** Exit status = the low byte of the OSStatus. -25300 errSecItemNotFound → 44. */
const NOT_FOUND = 44;
/** -25308 errSecInteractionNotAllowed (locked, or no GUI to ask) → 36. */
const INTERACTION_NOT_ALLOWED = 36;
/** -128 errSecUserCanceled: an unlock/access prompt was dismissed. */
const USER_CANCELED = 128;
/** `security -i` reads one command line; Claude Code switches to argv above this. */
const MAX_INTERACTIVE_LINE = 4032;

/**
 * A locked Keychain in a GUI session doesn't fail fast: reading a secret, or
 * writing or deleting one, raises an unlock prompt and `security` blocks until
 * our timeout kills it (or the prompt is dismissed) — freezing this extension
 * host, which Claude Code's extension shares, for the whole wait. So after one
 * such failure those calls are left alone for a while: background work gets
 * "can't tell" instantly instead of blocking again on every focus change.
 *
 * Only what actually froze arms it — a timeout or a dismissed prompt. A fast 36
 * (no UI to ask, e.g. over SSH) froze nothing, and backing off from it would
 * shut out the plaintext fallback such a session depends on. And only calls
 * that can raise a prompt are held back: attribute lookups answer at once even
 * when locked, and they are what tells "no token" from "can't tell".
 * Anything the user explicitly asks for tries for real (asUserAction).
 */
const BACKOFF_MS = 60_000;
let keychainBlockedUntil = 0;

function noteStatus(status: number | null): void {
  if (status === null || status === USER_CANCELED) keychainBlockedUntil = Date.now() + BACKOFF_MS;
}

/**
 * Runs `fn` as something the USER asked for: the Keychain is tried for real on
 * every call, backoff or not — a Forget that skipped its deletes because an
 * earlier one hit a locked Keychain would report copies as "failed" it never
 * even tried. Scoped to `fn`'s own async chain: background work that happens to
 * run during its awaits (a Save can wait seconds on the CLI) keeps backing off.
 */
const userAction = new AsyncLocalStorage<true>();
export function asUserAction<T>(fn: () => Promise<T>): Promise<T> {
  keychainBlockedUntil = 0;
  invalidateCredentialCache(); // and from fresh answers, not ones the backoff produced
  return userAction.run(true, fn);
}

function security(
  args: string[],
  input?: string,
  opts: { mayPrompt?: boolean } = {}
): { status: number | null; stdout: string } {
  if (opts.mayPrompt && Date.now() < keychainBlockedUntil && !userAction.getStore()) {
    return { status: null, stdout: '' };
  }
  const r = spawnSync(SECURITY, args, {
    input,
    encoding: 'utf-8',
    timeout: 3000,
    stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
  });
  const status = r.status;
  noteStatus(status);
  return { status, stdout: r.stdout ?? '' };
}

function itemArgs(dir: string): string[] {
  return ['-a', keychainAccount(), '-s', keychainService(dir)];
}

/** Existence only — without -w/-g, `security` prints attributes, never the secret. */
function keychainLookup(dir: string): { state: CredentialState; attributes: string } {
  const r = security(['find-generic-password', ...itemArgs(dir)]);
  if (r.status === 0) return { state: 'present', attributes: r.stdout };
  if (r.status === NOT_FOUND) return { state: 'absent', attributes: '' };
  return { state: 'unknown', attributes: '' };
}

/** The secret, or null when there is none, or undefined when the Keychain can't be read. */
function keychainRead(dir: string): Buffer | null | undefined {
  const r = security(['find-generic-password', ...itemArgs(dir), '-w'], undefined, { mayPrompt: true });
  if (r.status === NOT_FOUND) return null;
  if (r.status !== 0) return undefined;
  const out = r.stdout.replace(/\r?\n$/, '');
  if (!out) return null;
  // `-w` prints printable data as-is and anything else as bare hex. The token is
  // JSON, so it normally arrives verbatim; accept the hex form all the same.
  if (!out.startsWith('{') && /^(?:[0-9a-fA-F]{2})+$/.test(out)) return Buffer.from(out, 'hex');
  return Buffer.from(out, 'utf-8');
}

/**
 * Writes the item the way Claude Code does: `add-generic-password -U` (update in
 * place) with the value hex-encoded, fed through `security -i` on STDIN so the
 * token stays out of process listings. A payload too long for one `-i` line
 * (over ~2 KB of JSON) goes through argv instead — exactly as Claude Code
 * handles the same token.
 */
function keychainWrite(dir: string, data: Buffer): number | null {
  const account = keychainAccount();
  const service = keychainService(dir);
  const hex = data.toString('hex');
  const line = `add-generic-password -U -a "${account}" -s "${service}" -X "${hex}"\n`;
  const r =
    line.length <= MAX_INTERACTIVE_LINE
      ? security(['-i'], line, { mayPrompt: true })
      : security(['add-generic-password', '-U', '-a', account, '-s', service, '-X', hex], undefined, { mayPrompt: true });
  return r.status;
}

/** Deletes every matching item (normally one). */
function keychainDelete(dir: string): 'deleted' | 'absent' | 'failed' {
  let deleted = false;
  for (let i = 0; i < 5; i++) {
    const r = security(['delete-generic-password', ...itemArgs(dir)], undefined, { mayPrompt: true });
    if (r.status === 0) {
      deleted = true;
      continue;
    }
    if (r.status === NOT_FOUND) return deleted ? 'deleted' : 'absent';
    return 'failed'; // locked, timed out, prompt dismissed: it may still be there
  }
  return 'deleted';
}

// ─── A tiny cache (macOS) ─────────────────────────────────────────────────────

/**
 * Each `security` call is a fork+exec (~15–20 ms). reconcile() asks about the
 * same handful of dirs several times in one pass, and the status bar repaints
 * often, so answers are reused for a moment. Our own writes and deletes drop the
 * affected dir immediately, and callers that react to an outside change (the
 * watcher, reconcile) drop everything first — so staleness can't decide
 * anything that matters.
 */
const CACHE_TTL_MS = 1000;
const stateCache = new Map<string, { state: CredentialState; at: number }>();
const readCache = new Map<string, { data: Buffer | null | undefined; at: number }>();

export function invalidateCredentialCache(dir?: string): void {
  if (dir === undefined) {
    stateCache.clear();
    readCache.clear();
    return;
  }
  const key = path.normalize(dir);
  stateCache.delete(key);
  readCache.delete(key);
}

function cachedKeychainState(dir: string): CredentialState {
  const key = path.normalize(dir);
  const hit = stateCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.state;
  const { state } = keychainLookup(dir);
  stateCache.set(key, { state, at: Date.now() });
  return state;
}

function cachedKeychainRead(dir: string): Buffer | null | undefined {
  const key = path.normalize(dir);
  const hit = readCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;
  const data = keychainRead(dir);
  // A "couldn't read" is not remembered: the next caller — possibly the user
  // retrying — must get a real attempt.
  if (data !== undefined) readCache.set(key, { data, at: Date.now() });
  return data;
}

// ─── The API the rest of the extension uses ───────────────────────────────────

/** Whether `dir` holds a token — see CredentialState for what `unknown` means. */
export function credentialState(dir: string): CredentialState {
  if (fs.existsSync(tokenFile(dir))) return 'present'; // Linux token, or macOS fallback
  if (!usesKeychain) return 'absent';
  return cachedKeychainState(dir);
}

/** True only if `dir` definitely holds a token. */
export function hasCredentials(dir: string): boolean {
  return credentialState(dir) === 'present';
}

/**
 * True only if `dir` definitely holds NO token. Use this — never
 * `!hasCredentials` — wherever "signed out" leads to something destructive.
 */
export function lacksCredentials(dir: string): boolean {
  return credentialState(dir) === 'absent';
}

/**
 * The raw token bytes: null if `dir` has none, undefined if it may have one that
 * can't be read right now (macOS: Keychain locked or not answering). Copied
 * around, compared, never parsed: nothing here needs to look inside.
 */
export function readCredentials(dir: string): Buffer | null | undefined {
  // Same order as Claude Code: the Keychain wins, the file is the fallback.
  const fromKeychain = usesKeychain ? cachedKeychainRead(dir) : null;
  if (fromKeychain) return fromKeychain;
  try {
    return fs.readFileSync(tokenFile(dir));
  } catch {
    return fromKeychain; // null = nothing anywhere; undefined = the Keychain didn't say
  }
}

/**
 * Stores `data` as `dir`'s token, where Claude Code will look for it. Throws if it
 * can't be stored — including when the old token would stay in front of it.
 */
export function writeCredentials(dir: string, data: Buffer): void {
  invalidateCredentialCache(dir);
  if (!usesKeychain) {
    writeTokenFile(dir, data);
    return;
  }
  const status = keychainWrite(dir, data);
  invalidateCredentialCache(dir);
  if (status === 0) {
    // A leftover plaintext fallback would outlive the Keychain item it no longer
    // matches — and come back the moment that item is deleted. Claude Code drops
    // it after a successful Keychain write too.
    fs.rmSync(tokenFile(dir), { force: true });
    return;
  }
  const refused = () =>
    new Error(`the macOS Keychain did not store the token for ${dir} (security exit ${status})`);
  // Timed out, or a prompt dismissed: a transient failure. Writing the fallback
  // now could leave an old Keychain item in front of it, so give up instead — the
  // same call Claude Code makes.
  if (status === null || status === USER_CANCELED) throw refused();

  if (status === INTERACTION_NOT_ALLOWED) {
    // Locked, or no GUI to unlock it (e.g. Remote-SSH to a Mac). Decisive: is
    // there an item for this dir? Attribute lookups still answer when locked.
    // An item would stay in front of a fallback file (and one we can't even see
    // might), so only a definite "none" gets the plaintext fallback — exactly
    // what Claude Code itself writes in that situation.
    if (keychainLookup(dir).state !== 'absent') throw refused();
    writeTokenFile(dir, data);
    invalidateCredentialCache(dir);
    return;
  }

  // Keychain unusable for another reason: fall back to the plaintext file, like
  // Claude Code — but only with no Keychain item left to shadow it, or the window
  // would show one account and bill another.
  writeTokenFile(dir, data);
  if (keychainDelete(dir) === 'failed') {
    fs.rmSync(tokenFile(dir), { force: true });
    invalidateCredentialCache(dir);
    throw new Error(`the macOS Keychain did not store the token for ${dir}, and its old item could not be removed`);
  }
  invalidateCredentialCache(dir);
}

/**
 * Removes `dir`'s token from everywhere Claude Code could read it. True if one was
 * removed. Throws if one may still be there (macOS: the Keychain didn't answer).
 */
export function deleteCredentials(dir: string): boolean {
  try {
    const fromKeychain = usesKeychain ? keychainDelete(dir) : 'absent';
    let removed = fromKeychain === 'deleted';
    if (fs.existsSync(tokenFile(dir))) {
      fs.rmSync(tokenFile(dir), { force: true });
      removed = true;
    }
    if (fromKeychain === 'failed') {
      throw new Error(`the macOS Keychain did not delete the token for ${dir} (locked or not responding)`);
    }
    return removed;
  } finally {
    invalidateCredentialCache(dir);
  }
}

/**
 * A cheap fingerprint of `dir`'s token that changes whenever the token is
 * written or deleted — without reading the secret. On macOS it is the item's
 * attributes (they carry the modification date) plus the fallback file's mtime.
 */
export function credentialStamp(dir: string): string {
  let file = 'none';
  try {
    const st = fs.statSync(tokenFile(dir));
    file = `${st.mtimeMs}:${st.size}`;
  } catch {
    /* no file */
  }
  if (!usesKeychain) return file;
  const { state, attributes } = keychainLookup(dir);
  return `${state}|${attributes}|${file}`;
}

/** The files whose modification signals a Keychain write (macOS), for polling. */
export function keychainFiles(): string[] {
  if (!usesKeychain) return [];
  const db = path.join(os.homedir(), 'Library', 'Keychains', 'login.keychain-db');
  return [db, `${db}-wal`];
}

function writeTokenFile(dir: string, data: Buffer): void {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const dst = tokenFile(dir);
  const tmp = `${dst}.tmp`;
  fs.writeFileSync(tmp, data, { mode: 0o600 });
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, dst); // atomic: a half-written token is worse than none
}
