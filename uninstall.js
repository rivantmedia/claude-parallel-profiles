// vscode:uninstall hook — runs via plain `node` when the extension is uninstalled.
//
// What VSCode actually gives us here — all four verified against its logs, and
// every one of them a trap this file used to fall into:
//
//   1. It does NOT run when you click Uninstall. The extension is only MARKED for
//      removal; the hook runs later, from `cleanUp() → deleteExtensionsMarkedForRemoval()`
//      at the next server start. So by the time it runs, the world may have moved on.
//   2. It gets FIVE SECONDS. Overrun and VSCode kills it mid-syscall
//      ("[error] Failed to run post uninstall script … timed out" — measured at
//      5.012s). A hook that is killed halfway through moving data destroys it.
//   3. Because of (1), it can fire AFTER a newer version has been installed — the
//      old version's folder is still on disk with its own copy of this script. A
//      cleanup that deletes account stores would then wipe the LIVE install's
//      accounts. Hence the guard below: if another copy is installed, do nothing.
//   4. It may never run at all (folder deleted by hand, cleanup skipped). So it is
//      best-effort by construction, and nothing may depend on it for correctness.
//
// The contract, in priority order — earlier goals are never sacrificed for later ones:
//   a. Never destroy a live install's data.          (the guard)
//   b. Never lose history.                           (deadline + no destructive step before its data is safe)
//   c. Leave Claude Code signed in and working.      (hand the account back first)
//   d. Leave no OAuth token behind.                  (tokens go even when (b) forces us to stop early)
//   e. Leave no leftover directories it created.     (only when everything above succeeded;
//                                                     a dir the user made is never deleted)
//
// Vanilla Claude Code (CLAUDE_CONFIG_DIR unset) reads its token from
// ~/.claude/.credentials.json and its identity from ~/.claude.json at the HOME
// ROOT — verified empirically, and NOT the layout of a CLAUDE_CONFIG_DIR account,
// where both sit inside the dir. Restoring to the wrong one leaves Claude Code
// silently signed out, which is the bug this hook exists to prevent.
//
// On macOS the token is not a file but a login-Keychain item whose name is derived
// from the dir (see src/credentials.ts — the rules are duplicated below, because
// this script runs as bare `node` and cannot import the bundle). Vanilla Claude
// Code's item is "Claude Code-credentials".
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const MAC = os.platform() === 'darwin';

/** Kept in sync with SHARED_DIRS + SHARED_FILES in src/sharedHistory.ts. */
const SHARED_DIRS = [
  'projects',
  'sessions',
  'session-env',
  'shell-snapshots',
  'file-history',
  'plans',
  'todos',
];
const SHARED_FILES = ['history.jsonl'];
const SHARED_ENTRIES = [...SHARED_DIRS, ...SHARED_FILES];

/**
 * Our own budget, comfortably inside VSCode's 5s kill timer. Being killed is not
 * an option: it happens between two syscalls of our choosing, so there is no way
 * to be safe against it — we simply must not still be running. Every loop that can
 * grow with the user's data checks this and stops at a consistent point instead.
 */
const DEADLINE_MS = 4000;
let deadline = Infinity;
const outOfTime = () => Date.now() > deadline;
/**
 * The token deletions come last and may run a little past DEADLINE_MS — they are
 * the one step that must happen even when the rest bailed out — but never into
 * VSCode's kill: each is one short `security` call, and none starts after this.
 */
const TOKEN_GRACE_MS = 600;
const outOfTokenTime = () => Date.now() > deadline + TOKEN_GRACE_MS;

/**
 * True if a DIFFERENT copy of this extension is still installed.
 *
 * VSCode defers this hook to the next server start, so the user may well have
 * reinstalled by then — and the folder we are running from is the OLD version's,
 * which knows nothing about that. Deleting the account stores at that point would
 * destroy the data of a perfectly healthy install. (This is not hypothetical: a
 * 1.3.0 folder sat in `.obsolete` with this script in it while 1.3.1 was live.)
 *
 * Everything needed to tell is right next to us: sibling folders in the same
 * extensions dir, minus the ones listed in `.obsolete` (VSCode's own record of
 * what is on its way out).
 */
function anotherCopyInstalled() {
  try {
    const root = path.dirname(__dirname); // …/extensions
    const me = path.basename(__dirname); // publisher.name-version[-target]
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    // This copy's own id, and the original extension this one is a fork of: both
    // run on the very same dirs (~/.claude-windows, ~/.claude-shared, the stores),
    // so while EITHER is still installed, that data is live and must be left be.
    const prefixes = [`${pkg.publisher}.${pkg.name}-`.toLowerCase(), 'dercasdrol.claude-parallel-accounts-'];
    let obsolete = {};
    try {
      obsolete = JSON.parse(fs.readFileSync(path.join(root, '.obsolete'), 'utf-8')) || {};
    } catch {
      // no .obsolete → nothing is pending removal → any sibling is a live install
    }
    return fs.readdirSync(root, { withFileTypes: true }).some(
      (e) =>
        e.isDirectory() &&
        e.name !== me &&
        prefixes.some((prefix) => e.name.toLowerCase().startsWith(prefix)) &&
        !obsolete[e.name]
    );
  } catch {
    // Cannot tell. Assume there IS one: leaving files behind is a nuisance,
    // deleting a live install's accounts is a catastrophe.
    return true;
  }
}

// ─── The token of a dir: a file on Linux, a Keychain item on macOS ─────────────
// Kept in step with src/credentials.ts.

const TOKEN_FILE = '.credentials.json';
const NOT_FOUND = 44; // errSecItemNotFound
const TRANSIENT = new Set([null, 36, 128]); // timed out, locked/no UI, prompt dismissed

/** By location, not spelling: resolve() also drops a trailing slash. */
function isDefaultDir(dir) {
  return path.resolve(dir) === path.resolve(os.homedir(), '.claude');
}

/**
 * What the extension recorded about how Claude Code names its Keychain items
 * (see writeManifest in src/accounts.ts): settings like a custom OAuth URL may
 * reach Claude Code from VSCode's own configuration, which this bare `node`
 * process can't see. Its own environment is only the fallback.
 */
let naming = {};

/**
 * CLAUDE_CONFIG_DIR, when the environment sets it to the default dir itself. Claude
 * Code then treats ~/.claude like any other dir: hashed Keychain name, identity
 * inside the dir rather than in ~/.claude.json.
 */
function explicitDefaultDir() {
  if (naming.defaultConfigDir !== undefined) return naming.defaultConfigDir || undefined;
  const v = process.env.CLAUDE_CONFIG_DIR;
  return v && isDefaultDir(v) ? v : undefined;
}

function keychainService(dir) {
  const custom =
    naming.customOAuth !== undefined ? naming.customOAuth : Boolean(process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL);
  const suffix = custom ? '-custom-oauth' : '';
  let named = dir;
  if (isDefaultDir(dir)) {
    const explicit = explicitDefaultDir();
    if (!explicit) return `Claude Code${suffix}-credentials`;
    named = explicit;
  }
  const hash = crypto.createHash('sha256').update(named.normalize('NFC')).digest('hex').slice(0, 8);
  return `Claude Code${suffix}-credentials-${hash}`;
}

function keychainAccount() {
  let user;
  try {
    user = process.env.USER || os.userInfo().username;
  } catch {
    user = 'claude-code-user';
  }
  return /^[a-zA-Z0-9._-]+$/.test(user) ? user : 'claude-code-user';
}

function security(args, input) {
  const r = spawnSync('/usr/bin/security', args, {
    input,
    encoding: 'utf-8',
    timeout: 1200, // several of these fit comfortably inside the deadline
    stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
  });
  return { status: r.status, stdout: r.stdout || '' };
}

/** A dir's token bytes, or null. Keychain first, then the fallback file — Claude Code's order. */
function readToken(dir) {
  if (MAC) {
    const r = security(['find-generic-password', '-a', keychainAccount(), '-s', keychainService(dir), '-w']);
    const out = r.status === 0 ? r.stdout.replace(/\r?\n$/, '') : '';
    if (out) {
      return !out.startsWith('{') && /^(?:[0-9a-fA-F]{2})+$/.test(out)
        ? Buffer.from(out, 'hex')
        : Buffer.from(out, 'utf-8');
    }
  }
  try {
    return fs.readFileSync(path.join(dir, TOKEN_FILE));
  } catch {
    return null;
  }
}

function writeTokenFile(dir, data) {
  const dst = path.join(dir, TOKEN_FILE);
  const tmp = `${dst}.tmp`;
  fs.writeFileSync(tmp, data, { mode: 0o600 });
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, dst);
}

/** Deletes a dir's Keychain item. True when it is gone (deleted, or never there). */
function deleteKeychainItem(dir) {
  const { status } = security(['delete-generic-password', '-a', keychainAccount(), '-s', keychainService(dir)]);
  return status === 0 || status === NOT_FOUND;
}

/**
 * Stores a token as `dir`'s, where Claude Code reads it. Throws if it could not —
 * including when an older token would stay in front of it, since the caller then
 * must not pair the new identity with it.
 */
function writeToken(dir, data) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  if (!MAC) {
    writeTokenFile(dir, data);
    return;
  }
  const account = keychainAccount();
  const service = keychainService(dir);
  const hex = data.toString('hex');
  const line = `add-generic-password -U -a "${account}" -s "${service}" -X "${hex}"\n`;
  const { status } =
    line.length <= 4032
      ? security(['-i'], line)
      : security(['add-generic-password', '-U', '-a', account, '-s', service, '-X', hex]); // as Claude Code does
  if (status === 0) {
    fs.rmSync(path.join(dir, TOKEN_FILE), { force: true }); // no stale fallback left behind
    return;
  }
  if (TRANSIENT.has(status)) throw new Error(`Keychain write failed (${status})`);
  // Keychain unusable: the plaintext fallback, as Claude Code does — only with no
  // Keychain item left to shadow it.
  writeTokenFile(dir, data);
  if (!deleteKeychainItem(dir)) {
    fs.rmSync(path.join(dir, TOKEN_FILE), { force: true });
    throw new Error('Keychain write failed and the old item could not be removed');
  }
}

/** Deletes a dir's token from everywhere Claude Code could read it. True if it is gone. */
function deleteToken(dir) {
  let gone = MAC ? deleteKeychainItem(dir) : true;
  try {
    fs.rmSync(path.join(dir, TOKEN_FILE), { force: true });
  } catch {
    gone = false;
  }
  return gone;
}

function mtimeOf(file) {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return -1;
  }
}

/**
 * A spawn-free guess at how recently a dir was in use (ms; -1 = never). Linux: the
 * token file's mtime. macOS: also the config's, which Claude Code touches
 * whenever it runs there — asking the Keychain would cost a process per dir.
 */
function recency(dir) {
  const token = mtimeOf(path.join(dir, TOKEN_FILE));
  return MAC ? Math.max(token, mtimeOf(path.join(dir, '.claude.json'))) : token;
}

/**
 * When a dir's token was last written (ms), or -1 if it has none: the file's
 * mtime, or on macOS the Keychain item's modification date (attributes only,
 * never the secret).
 */
function tokenTime(dir) {
  let best = mtimeOf(path.join(dir, TOKEN_FILE));
  if (MAC) {
    const r = security(['find-generic-password', '-a', keychainAccount(), '-s', keychainService(dir)]);
    if (r.status === 0) {
      // "mdat"<timedate>=0x…  "20260924171628Z\000"
      const m = /"mdat"<timedate>=\S*\s+"(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/.exec(r.stdout);
      best = Math.max(best, m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) : 0);
    }
  }
  return best;
}

/** The per-window working dirs this extension creates (~/.claude-windows/<id>). */
function workingDirs(root) {
  try {
    return fs
      .readdirSync(root, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => path.join(root, e.name));
  } catch {
    return [];
  }
}

/**
 * The account stores the extension manages, as recorded by the registry:
 * `created` — dirs it made itself, the only ones ever deleted — and `adopted` —
 * dirs that were already there (a profile the user ran by hand, say) and that it
 * merely took into its list. Those stay, config and token and all; they only get
 * their history links pointed back at a place that still exists.
 *
 * A `~/.claude-<name>` dir NOT in the manifest was made by the user (or another
 * tool) and is none of our business — guessing from the name alone is how an
 * uninstall destroys someone else's data. So is a manifest from before `created`
 * was recorded: everything in it counts as adopted.
 */
const STORE_MARKER = '.parallel-accounts-store';

/** Whether a store entry has left the store: gone, or a dir the move emptied. */
function movedOut(entry) {
  try {
    const st = fs.statSync(entry);
    return st.isDirectory() && fs.readdirSync(entry).length === 0;
  } catch {
    return true;
  }
} // dropped into every store the extension creates

function managedStores(home, manifest) {
  if (!manifest) return { created: [], adopted: [] }; // no manifest → touch no stores (fail safe)
  const home_ = path.normalize(home);
  const valid = (list) =>
    (Array.isArray(list) ? list : [])
      .filter((dir) => typeof dir === 'string')
      .map((dir) => path.normalize(dir))
      .filter((norm) => {
        if (path.dirname(norm) !== home_) return false;
        const base = path.basename(norm);
        if (!/^\.claude[-_].+$/.test(base)) return false;
        return base !== '.claude-shared' && base !== '.claude-windows';
      });
  const stores = valid(manifest.stores);
  const listed = new Set(valid(manifest.created));
  const isCreated = (d) => listed.has(d) || fs.existsSync(path.join(d, STORE_MARKER));
  return {
    created: stores.filter(isCreated),
    adopted: stores.filter((d) => !isCreated(d)),
  };
}

/**
 * Once history moved out of the store into ~/.claude, an adopted dir's links to
 * it point at nothing. Point them at the same history's new home instead, so that
 * profile keeps seeing it. `all`: the store is about to be deleted, relink every
 * entry; otherwise (consolidation stopped early) only entries that already left
 * the store — gone, or emptied by the move — and the rest keep links that work.
 */
function relinkHistory(dir, store, defaultDir, all) {
  for (const name of SHARED_ENTRIES) {
    const p = path.join(dir, name);
    try {
      const st = fs.lstatSync(p, { throwIfNoEntry: false });
      if (!st || !st.isSymbolicLink()) continue;
      if (path.normalize(fs.readlinkSync(p)) !== path.normalize(path.join(store, name))) continue;
      if (!all && !movedOut(path.join(store, name))) continue; // still there: the link still resolves
      fs.unlinkSync(p);
      if (fs.existsSync(path.join(defaultDir, name))) fs.symlinkSync(path.join(defaultDir, name), p);
    } catch {
      /* best-effort: Claude Code recreates a missing entry */
    }
  }
}

/**
 * Folds `src` into `dst` by MOVING entries, never by reading them.
 *
 * The previous version compared colliding files byte for byte. On a real 1.3 GB
 * history that is 1.3 GB of reads: measured at 22 seconds — four times over the
 * kill timer, so the hook died mid-move. Nothing here may cost more than a stat:
 * a file that is already there and the same size is a duplicate of a store every
 * dir was symlinked to, and gets dropped; anything else is left where it is and
 * reported as a conflict, so the caller keeps the store instead of deleting it.
 *
 * Returns false if anything could not be moved (conflict, error, or out of time).
 */
function moveDirInto(src, dst) {
  let complete = true;
  let entries;
  try {
    entries = fs.readdirSync(src, { withFileTypes: true });
  } catch {
    return false;
  }
  fs.mkdirSync(dst, { recursive: true, mode: 0o700 });
  for (const entry of entries) {
    if (outOfTime()) return false;
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    try {
      const dstStat = fs.lstatSync(d, { throwIfNoEntry: false });
      if (!dstStat) {
        fs.renameSync(s, d);
      } else if (entry.isDirectory() && dstStat.isDirectory()) {
        if (!moveDirInto(s, d)) complete = false;
      } else if (entry.isFile() && dstStat.isFile() && fs.statSync(s).size === dstStat.size) {
        fs.rmSync(s, { force: true }); // same size ⇒ the same file, seen twice
      } else {
        complete = false; // a real divergence — never resolved by guessing
      }
    } catch {
      complete = false;
    }
  }
  return complete;
}

/** Folds a line-based file (history.jsonl) into `dst`, skipping lines it has. */
function mergeFileInto(src, dst) {
  try {
    const existing = fs.existsSync(dst) ? fs.readFileSync(dst, 'utf-8') : '';
    const known = new Set(existing.split('\n').filter(Boolean));
    const incoming = fs
      .readFileSync(src, 'utf-8')
      .split('\n')
      .filter((line) => line && !known.has(line));
    if (incoming.length > 0) {
      const prefix = existing && !existing.endsWith('\n') ? '\n' : '';
      fs.appendFileSync(dst, `${prefix}${incoming.join('\n')}\n`, { mode: 0o600 });
    }
    fs.rmSync(src, { force: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Brings the history into the default dir, where plain Claude Code will look for it.
 *
 * In the normal case every entry is a symlink into the store, so this is one
 * unlink + one rename per entry — eight syscalls, measured at 135 ms regardless of
 * how many gigabytes the store holds. The unlink and the rename sit next to each
 * other on purpose: a kill between two ENTRIES leaves the rest still symlinked to
 * an intact store, and loses nothing.
 *
 * Returns true only if EVERY entry made it. The caller must not delete the store
 * otherwise — by then it is the only copy of whatever stayed behind.
 */
function consolidateHistory(defaultDir, store, otherDirs) {
  let complete = true;
  fs.mkdirSync(defaultDir, { recursive: true, mode: 0o700 });

  for (const name of SHARED_ENTRIES) {
    if (outOfTime()) return false;
    const src = path.join(store, name);
    const dst = path.join(defaultDir, name);
    try {
      if (!fs.existsSync(src)) continue;
      const dstStat = fs.lstatSync(dst, { throwIfNoEntry: false });
      // The common case: our own symlink. Drop it and move the real thing in.
      if (dstStat && dstStat.isSymbolicLink()) {
        fs.unlinkSync(dst);
        fs.renameSync(src, dst);
        continue;
      }
      if (!dstStat) {
        fs.renameSync(src, dst);
      } else if (SHARED_FILES.includes(name)) {
        if (!mergeFileInto(src, dst)) complete = false;
      } else if (!moveDirInto(src, dst)) {
        complete = false;
      }
    } catch {
      complete = false;
    }
  }

  // Versions up to 1.2.7 had a setting that turned sharing off, leaving real
  // history inside the account dirs that the store never saw. Fold that in too, or
  // deleting those dirs below would delete the only copy.
  for (const dir of otherDirs) {
    for (const name of SHARED_ENTRIES) {
      if (outOfTime()) return false;
      const src = path.join(dir, name);
      const dst = path.join(defaultDir, name);
      try {
        const st = fs.lstatSync(src, { throwIfNoEntry: false });
        if (!st || st.isSymbolicLink()) continue; // symlinks die with their dir (rm doesn't follow them)
        if (st.isDirectory()) {
          if (!moveDirInto(src, dst)) complete = false;
        } else if (st.isFile()) {
          if (fs.existsSync(dst)) {
            if (!mergeFileInto(src, dst)) complete = false;
          } else {
            fs.renameSync(src, dst);
          }
        }
      } catch {
        complete = false;
      }
    }
  }
  return complete;
}

/**
 * The dir holding the account to hand back: the freshest OAuth token on disk.
 *
 * Working dirs win over stores when both have one: a working dir is where Claude
 * Code actually ran, so its token is the one that got refreshed and its config is
 * the live one, where a store's config is only a snapshot from when it was saved.
 *
 * On macOS each token's age costs a `security` process, and a long-time user has
 * a working dir per folder ever opened — so only the few most recently used
 * (by a free stat) are asked; the freshest token is among them.
 */
const FRESHEST_CANDIDATES = MAC ? 5 : Infinity;

function lastUsedDir(working, stores) {
  for (const group of [working, stores]) {
    const ranked = group
      .map((dir) => ({ dir, t: recency(dir) }))
      .filter((c) => c.t >= 0 || MAC) // macOS: a token may live only in the Keychain
      .sort((a, b) => b.t - a.t)
      .slice(0, FRESHEST_CANDIDATES);
    let best;
    let bestTime = -1;
    for (const { dir } of ranked) {
      if (outOfTime()) break;
      const t = tokenTime(dir); // -1: no token here — not a candidate
      if (t > bestTime) {
        bestTime = t;
        best = dir;
      }
    }
    if (best) return best;
  }
  return undefined;
}

/**
 * Hands the account back to vanilla Claude Code: token into ~/.claude, identity
 * into ~/.claude.json. Both come from the SAME dir — an identity paired with
 * another account's token is the exact desync this extension was built to fix.
 *
 * Runs FIRST, before anything is moved or deleted: it is the one step that decides
 * whether the user still has a working Claude Code, and it costs two small copies.
 * The config is merged over whatever ~/.claude.json already had rather than
 * replacing it, so settings that predate the extension survive.
 */
function restoreDefaultAccount(source, defaultDir, defaultConfig) {
  try {
    const token = readToken(source);
    if (!token) return;
    writeToken(defaultDir, token); // throws rather than leave the identity below with another token

    const cfgFile = path.join(source, '.claude.json');
    if (!fs.existsSync(cfgFile)) return;
    const incoming = JSON.parse(fs.readFileSync(cfgFile, 'utf-8'));
    let existing = {};
    try {
      existing = JSON.parse(fs.readFileSync(defaultConfig, 'utf-8'));
    } catch {
      // no default config yet, or unreadable — the account's is all we need
    }
    const merged = {
      ...existing,
      ...incoming,
      projects: { ...(existing.projects || {}), ...(incoming.projects || {}) },
    };
    const tmp = `${defaultConfig}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(merged, null, 2), { mode: 0o600 });
    fs.renameSync(tmp, defaultConfig); // atomic: a half-written config bricks Claude Code
  } catch {
    /* best-effort */
  }
}

/**
 * Deletes the OAuth token from our dirs — the one step that must happen even when
 * we bail out. Returns the dirs whose token may still be there (a failed Keychain
 * delete, or out of time): they must NOT be deleted, because on macOS the dir's
 * path is the only thing its Keychain item's name can be derived from.
 */
function dropTokens(dirs) {
  const kept = [];
  for (const dir of dirs) {
    if (MAC && outOfTokenTime()) {
      kept.push(dir);
      continue;
    }
    try {
      if (!deleteToken(dir)) kept.push(dir);
    } catch {
      kept.push(dir);
    }
  }
  return kept;
}

function main() {
  // On unsupported platforms the extension activates into an inert mode and never
  // created anything, so there is nothing to revert — and guessing at other OSes'
  // file layouts on uninstall is exactly the manipulation that mode promises not
  // to do.
  if (os.platform() !== 'linux' && !MAC) return;

  // A newer copy is live and this data is now ITS data. Touch nothing.
  if (anotherCopyInstalled()) return;

  deadline = Date.now() + DEADLINE_MS;

  const home = os.homedir();
  const defaultDir = path.join(home, '.claude');
  const store = path.join(home, '.claude-shared');
  const workRoot = path.join(home, '.claude-windows');

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(workRoot, '.manifest.json'), 'utf-8'));
  } catch {
    manifest = undefined;
  }
  if (manifest && typeof manifest === 'object') {
    if (typeof manifest.customOAuth === 'boolean') naming.customOAuth = manifest.customOAuth;
    if ('defaultConfigDir' in manifest) naming.defaultConfigDir = manifest.defaultConfigDir;
  }

  // Where vanilla Claude Code reads the default account's identity: the home root,
  // unless the environment sets CLAUDE_CONFIG_DIR to ~/.claude itself.
  const defaultConfig = explicitDefaultDir()
    ? path.join(defaultDir, '.claude.json')
    : path.join(home, '.claude.json');

  const working = workingDirs(workRoot);
  const { created, adopted } = managedStores(home, manifest);
  const ours = [...working, ...created]; // the dirs this extension made — and may delete

  // 1. Leave Claude Code working. Cheap, and everything after it is optional.
  const source = lastUsedDir(working, [...created, ...adopted]);
  if (source) restoreDefaultAccount(source, defaultDir, defaultConfig);

  // 2. Get the history somewhere plain Claude Code can see it.
  const consolidated = consolidateHistory(defaultDir, store, ours);

  // 3. If any history stayed behind, the dirs holding it are now its only copy —
  //    keep them. The tokens still go: a leftover folder is untidy, a leftover
  //    OAuth token is a credential we promised not to leave lying around.
  if (!consolidated) {
    dropTokens(ours);
    for (const dir of adopted) relinkHistory(dir, store, defaultDir, false); // what did move
    return;
  }

  // 4. Everything is safe in ~/.claude. Our dirs hold nothing but duplicated
  //    credentials, config and dangling symlinks (rmSync does not follow those,
  //    so the store's content is never at risk here). Each dir's token goes
  //    first; on macOS it is a Keychain item, and a dir whose item could not be
  //    deleted is kept — its path is the only record of the item's name.
  const kept = new Set(dropTokens(ours));
  for (const dir of ours) {
    if (kept.has(dir)) continue;
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* best-effort */
    }
  }
  for (const dir of adopted) relinkHistory(dir, store, defaultDir, true);
  // The containers go only when nothing we kept is inside them. (A short-lived
  // Linux-only earlier version also kept token copies in ~/.claude-vault.)
  const extras = [store];
  if (![...kept].some((d) => path.dirname(d) === workRoot)) extras.push(workRoot);
  if (os.platform() === 'linux') extras.push(path.join(home, '.claude-vault'));
  for (const dir of extras) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* best-effort */
    }
  }
}

main();
