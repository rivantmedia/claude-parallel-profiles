import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execFileSync } from 'child_process';
import { log } from './log';
import { readIdentity } from './accounts';
import { deleteCredentials, explicitDefaultDir, isDefaultConfigDir, lacksCredentials } from './credentials';

/**
 * Reclaiming sensitive data from a forgotten account.
 *
 * An account directory is tied to exactly ONE credential: its OAuth access +
 * refresh token — `<dir>/.credentials.json` on Linux, the dir's Keychain item on
 * macOS (see credentials.ts). Everything else in the dir is either
 * identity/config (`.claude.json` — email/org, no token), rotating backups of
 * that config, or symlinks into the shared-history store. So "reclaim the
 * sensitive data" reduces to deleting that one token — which is exactly what
 * Claude Code's own `/logout` does (verified in its bundle: the credential
 * store's `delete()` unlinks `<CLAUDE_CONFIG_DIR>/.credentials.json`, and on
 * macOS deletes the Keychain item and that fallback file both).
 *
 * A forceful forget deletes that token unconditionally, then interrupts any
 * live `claude` session still pointing at the dir so nothing keeps running on a
 * credential that no longer exists.
 */

/**
 * Account state Claude Code's own `/logout` clears out of `.claude.json`,
 * alongside deleting the token. Deleting the token but LEAVING these behind
 * produces a half-signed-out dir that Claude Code never creates itself: it
 * still finds `oauthAccount`, believes it is signed in, renders "signed in" —
 * and never starts the OAuth flow, so login hangs. Mirroring the real logout
 * is what keeps the dir in a state Claude Code understands.
 *
 * Taken from the logout routine in Claude Code's bundle. `hasCompletedOnboarding`
 * / `seenNotifications` are deliberately NOT reset (the real logout does reset
 * them): they are onboarding UI state, not auth, and clearing them on the shared
 * default dir would throw every window back into the onboarding wizard.
 */
const CLEARED_ON_LOGOUT = [
  'oauthAccount',
  'additionalModelOptionsCache',
  'additionalModelCostsCache',
  'modelAccessCache',
  'orgModelDefaultCache',
  'lastSeenOrgDefaultUpdatedAt',
  'clientDataCache',
  'clientDataCacheSlots',
  'autoCompactWindowsCache',
] as const;

/**
 * The config file(s) holding a dir's account state. Named dirs keep it in
 * `<dir>/.claude.json`; the default `~/.claude` keeps its identity in the
 * home-root `~/.claude.json` instead — both must be cleared.
 */
function configFilesFor(dir: string): string[] {
  const files = [path.join(dir, '.claude.json')];
  // (When the environment sets CLAUDE_CONFIG_DIR to ~/.claude, the home-root file
  // isn't this dir's config at all — it belongs to plain, unset-variable use.)
  if (isDefaultConfigDir(dir) && !explicitDefaultDir()) {
    files.push(path.join(os.homedir(), '.claude.json'));
  }
  return files.filter((f) => fs.existsSync(f));
}

/**
 * Signs an account dir out the way Claude Code's `/logout` does: deletes the
 * OAuth token AND clears the account identity + its derived caches from the
 * config. Settings, backups and (shared) history are untouched — the dir stays,
 * it just no longer holds an account.
 *
 * Returns `removed` if a token was deleted, `none` if there was none, `failed` if
 * one may still be there (macOS: the Keychain didn't answer). On `failed` the
 * config is left alone: a live token with its identity wiped is a dir Claude
 * Code still signs in with, but that nothing here recognises any more.
 */
export function signOut(dir: string): 'removed' | 'none' | 'failed' {
  let removed = false;
  try {
    removed = deleteCredentials(dir);
  } catch (err) {
    log(`signOut: could not delete token in ${dir}: ${(err as Error).message}`);
    return 'failed';
  }

  for (const cfg of configFilesFor(dir)) {
    try {
      const obj = JSON.parse(fs.readFileSync(cfg, 'utf-8')) as Record<string, unknown>;
      let touched = false;
      for (const key of CLEARED_ON_LOGOUT) {
        if (key in obj) {
          delete obj[key];
          touched = true;
        }
      }
      if (obj.hasAvailableSubscription !== undefined) {
        obj.hasAvailableSubscription = false;
        touched = true;
      }
      if (obj.subscriptionNoticeCount !== undefined) {
        obj.subscriptionNoticeCount = 0;
        touched = true;
      }
      if (!touched) continue;
      const tmp = `${cfg}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), { mode: 0o600 });
      fs.renameSync(tmp, cfg); // atomic: never leave a half-written config
      log(`signOut: cleared account state in ${cfg}`);
    } catch (err) {
      log(`signOut: could not clear ${cfg}: ${(err as Error).message}`);
    }
  }
  return removed ? 'removed' : 'none';
}

/**
 * Live `claude` processes grouped by the CLAUDE_CONFIG_DIR they run against,
 * read from /proc on Linux/WSL and from `ps` on macOS. A process with no
 * CLAUDE_CONFIG_DIR uses the default `~/.claude`. Returns an EMPTY map where
 * neither is available. Keys are resolved (no trailing slash) for direct comparison.
 */
export function claudeSessionsByDir(): { byDir: Map<string, number[]>; unattributable: number[] } {
  if (process.platform === 'darwin') return claudeSessionsByDirMac();
  const byDir = new Map<string, number[]>();
  let pids: string[];
  try {
    pids = fs.readdirSync('/proc').filter((p) => /^\d+$/.test(p));
  } catch {
    return { byDir, unattributable: [] }; // no /proc on this platform
  }
  const defaultDir = path.resolve(os.homedir(), '.claude');
  const PREFIX = 'CLAUDE_CONFIG_DIR=';
  for (const pid of pids) {
    let comm: string;
    try {
      comm = fs.readFileSync(path.join('/proc', pid, 'comm'), 'utf-8').trim();
    } catch {
      continue; // process gone or not ours
    }
    if (comm !== 'claude') continue;
    let environ: string;
    try {
      environ = fs.readFileSync(path.join('/proc', pid, 'environ'), 'utf-8');
    } catch {
      continue;
    }
    const entry = environ.split('\0').find((e) => e.startsWith(PREFIX));
    const dir = entry ? path.resolve(entry.slice(PREFIX.length)) : defaultDir;
    const list = byDir.get(dir) ?? [];
    list.push(Number(pid));
    byDir.set(dir, list);
  }
  return { byDir, unattributable: [] };
}

/**
 * macOS has no /proc, but `ps -E` appends a process's launch environment to its
 * command line — readable for the user's own processes, which is all we're after.
 *
 * Passes: first find the `claude` executables (`comm` can contain spaces, so it
 * must be the LAST column) — the Claude Code extension's bundled
 * `…/native-binary/claude`, the native installer's `…/claude/versions/<version>`,
 * anything else named `claude`. Then read their arguments alone and their
 * arguments + environment, and keep only what the second adds: the environment.
 * Parsing the whole line instead would let a prompt passed as an argument that
 * merely MENTIONS `CLAUDE_CONFIG_DIR=…` decide which account a session runs.
 *
 * A process whose environment can't be seen at all — a Node-hosted `claude` sets
 * process.title, which overwrites the memory `ps` reads it from — is reported
 * as unattributable, never as the default dir: guessing would SIGKILL another
 * account's session and spare the one that should go.
 */
function claudeSessionsByDirMac(): { byDir: Map<string, number[]>; unattributable: number[] } {
  const byDir = new Map<string, number[]>();
  const unattributable: number[] = [];
  const ps = (args: string[]): string => {
    try {
      return execFileSync('/bin/ps', args, { encoding: 'utf-8', timeout: 5000, maxBuffer: 64 * 1024 * 1024 });
    } catch {
      return '';
    }
  };
  const byPid = (out: string): Map<number, string> => {
    const map = new Map<number, string>();
    for (const line of out.split('\n')) {
      const m = /^\s*(\d+) (.*)$/.exec(line);
      if (m) map.set(Number(m[1]), m[2]);
    }
    return map;
  };

  const pids: number[] = [];
  for (const line of ps(['-A', '-o', 'pid=,comm=']).split('\n')) {
    const m = /^\s*(\d+)\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const exe = m[2];
    if (path.basename(exe) === 'claude' || /\/claude\/versions\/[^/]+$/.test(exe)) pids.push(Number(m[1]));
  }
  if (pids.length === 0) return { byDir, unattributable };

  const list = pids.join(',');
  const argsOnly = byPid(ps(['-ww', '-o', 'pid=,command=', '-p', list]));
  const withEnv = byPid(ps(['-E', '-ww', '-o', 'pid=,command=', '-p', list]));
  const defaultDir = path.resolve(os.homedir(), '.claude');
  for (const [pid, full] of withEnv) {
    const args = argsOnly.get(pid);
    const env = args !== undefined && full.startsWith(args) ? full.slice(args.length) : '';
    if (!/(?:^|\s)[A-Za-z_][A-Za-z0-9_]*=/.test(env)) {
      unattributable.push(pid);
      continue;
    }
    const value = configDirFromEnv(env);
    const dir = value ? path.resolve(value) : defaultDir;
    const entry = byDir.get(dir) ?? [];
    entry.push(pid);
    byDir.set(dir, entry);
  }
  return { byDir, unattributable };
}

/**
 * CLAUDE_CONFIG_DIR from a ` NAME=value NAME=value…` environment string. A value
 * runs until the next ` NAME=` — but a path can itself contain one (`/a X=1/b`),
 * so every such boundary is a candidate, and the first that names an existing
 * directory wins (the shortest if none does).
 */
function configDirFromEnv(env: string): string | undefined {
  const start = /(?:^|\s)CLAUDE_CONFIG_DIR=/.exec(env);
  if (!start) return undefined;
  const rest = env.slice(start.index + start[0].length);
  const candidates: string[] = [];
  const boundary = /\s[A-Za-z_][A-Za-z0-9_]*=/g;
  for (let m = boundary.exec(rest); m; m = boundary.exec(rest)) candidates.push(rest.slice(0, m.index));
  candidates.push(rest.replace(/\s+$/, ''));
  const existing = candidates.find((c) => {
    try {
      return c !== '' && fs.statSync(c).isDirectory();
    } catch {
      return false;
    }
  });
  return existing ?? candidates[0];
}

/**
 * Interrupts every live `claude` session running against any of the given dirs,
 * so a forceful forget leaves no process alive on a just-deleted token. Uses
 * SIGKILL on purpose: on a graceful SIGTERM shutdown Claude Code flushes its
 * in-memory token back to its store (file or Keychain), which would resurrect
 * the very token we're about to delete. Callers MUST call this BEFORE signOut.
 * Returns how many processes were signalled, and how many `claude` processes
 * could not be attributed to a dir at all (and so were left alone). No-op where
 * sessions can't be listed.
 */
export function interruptSessions(dirs: string[]): { interrupted: number; unchecked: number } {
  const targets = new Set(dirs.map((d) => path.resolve(d)));
  const { byDir, unattributable } = claudeSessionsByDir();
  if (unattributable.length > 0) {
    log(`could not tell which account claude pid(s) ${unattributable.join(', ')} run — left alone`);
  }
  let killed = 0;
  for (const [dir, pids] of byDir) {
    if (!targets.has(dir)) continue;
    for (const pid of pids) {
      try {
        process.kill(pid, 'SIGKILL');
        killed++;
        log(`interrupted claude pid=${pid} on ${dir}`);
      } catch (err) {
        log(`could not signal pid=${pid}: ${(err as Error).message}`);
      }
    }
  }
  return { interrupted: killed, unchecked: unattributable.length };
}

/**
 * Every Claude data dir that may hold this account's token — the default
 * `~/.claude` (its identity lives in `~/.claude.json`) AND every named
 * `~/.claude-*` copy. "May": a dir whose Keychain lookup can't be answered is
 * included — callers must check credentialState() and refuse to act on an
 * `unknown`, rather than silently skip a dir that still holds a live token. Capturing an account snapshots its token into a named
 * dir but leaves the original in the source (often the default) dir, so the
 * SAME token can sit in several places. To truly sign an account out, forget
 * must clear the token from ALL of them, not just the registry copy.
 */
export function dirsHoldingToken(email: string): string[] {
  const home = os.homedir();
  const candidates = [path.join(home, '.claude')];
  try {
    for (const e of fs.readdirSync(home, { withFileTypes: true })) {
      if (e.isDirectory() && /^\.claude[-_]/.test(e.name)) {
        candidates.push(path.join(home, e.name));
      }
    }
  } catch {
    /* home unreadable — fall back to whatever we have */
  }
  return candidates.filter((d) => readIdentity(d)?.email === email && !lacksCredentials(d));
}
