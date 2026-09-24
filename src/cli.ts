import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { log } from './log';
import { readIdentity } from './accounts';
import { explicitDefaultDir, isDefaultConfigDir } from './credentials';

/**
 * Thin wrapper around the `claude` CLI's auth commands, scoped to a specific
 * CLAUDE_CONFIG_DIR. This is the AUTHORITATIVE source of an account's identity:
 * `claude auth status` reflects the real OAuth token, so it can never disagree
 * with what Claude Code actually bills to (unlike reading .claude.json, whose
 * oauthAccount field can drift out of sync with the token).
 */

export interface AuthStatus {
  loggedIn: boolean;
  authMethod?: string;
  email?: string;
  orgName?: string;
  subscriptionType?: string;
}

/**
 * The CLAUDE_CONFIG_DIR `claude` needs to act on `dir` — undefined meaning UNSET.
 * The default `~/.claude` is the dir Claude Code uses with the variable unset,
 * and unset is not the same as set to `~/.claude`: the identity then comes from
 * `~/.claude.json` at the home root, and on macOS even the Keychain item has a
 * different name. So for the default dir the variable is removed — unless the
 * user's environment itself sets it to that dir, in which case that's how
 * Claude Code runs it and it is kept.
 */
function configDirFor(dir: string): string | undefined {
  return isDefaultConfigDir(dir) ? explicitDefaultDir() : dir;
}

function envFor(dir: string): NodeJS.ProcessEnv {
  const env = { ...process.env };
  const configDir = configDirFor(dir);
  if (configDir === undefined) delete env.CLAUDE_CONFIG_DIR;
  else env.CLAUDE_CONFIG_DIR = configDir;
  return env;
}

/** Single-quotes a value for a POSIX shell. */
function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/**
 * The `claude` binary shipped inside the Claude Code extension — the very one its
 * panel runs, so its answer can't disagree with what the panel bills to.
 */
function bundledClaude(): string | undefined {
  const ext = vscode.extensions.getExtension('anthropic.claude-code');
  if (!ext) return undefined;
  const bin = path.join(ext.extensionPath, 'resources', 'native-binary', 'claude');
  return fs.existsSync(bin) ? bin : undefined;
}

/**
 * The ways to run the CLI, most reliable first. A login shell resolves nvm/PATH
 * the way the user's terminal does, which on Linux is what finds `claude`. On
 * macOS the bundled binary goes first: VSCode started from the Dock often has a
 * thinner PATH than a terminal, and it skips a login shell's start-up cost.
 */
function claudeCommands(args: string[], dir: string): Array<{ file: string; argv: string[] }> {
  // The variable is set INSIDE the command, after the login profile has run: a
  // profile that exports its own CLAUDE_CONFIG_DIR would otherwise override the
  // one passed in, and the CLI would answer for the wrong dir.
  const configDir = configDirFor(dir);
  const envPart = configDir === undefined ? 'env -u CLAUDE_CONFIG_DIR' : `env CLAUDE_CONFIG_DIR=${shellQuote(configDir)}`;
  const shell = {
    file: process.env.SHELL || '/bin/bash',
    argv: ['-lc', `exec ${envPart} claude ${args.join(' ')}`],
  };
  const bin = bundledClaude();
  const bundled = bin ? [{ file: bin, argv: args }] : [];
  return process.platform === 'darwin' ? [...bundled, shell] : [shell, ...bundled];
}

/**
 * Runs one command and reports how it ended. A non-zero exit is not a failure
 * here: `claude auth status` exits 1 when signed out, and still prints its JSON.
 */
function run(
  cmd: { file: string; argv: string[] },
  env: NodeJS.ProcessEnv,
  timeoutMs: number
): Promise<{ stdout: string; error?: string }> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (r: { stdout: string; error?: string }) => {
      if (settled) return;
      settled = true;
      clearTimeout(hardTimer);
      resolve(r);
    };
    // execFile's own `timeout` sends SIGTERM, which a login shell can trap and
    // ignore — leaving the callback pending forever. Escalate to SIGKILL and
    // back it with our own hard timer so this promise ALWAYS settles.
    const child = execFile(
      cmd.file,
      cmd.argv,
      { env, timeout: timeoutMs, killSignal: 'SIGKILL' },
      (err, stdout, stderr) =>
        settle({ stdout: stdout?.toString() ?? '', error: err ? stderr?.toString() || err.message : undefined })
    );
    const hardTimer = setTimeout(() => {
      try {
        child.kill('SIGKILL');
      } catch {
        /* already gone */
      }
      settle({ stdout: '', error: `timed out after ${timeoutMs}ms` });
    }, timeoutMs + 1000);
    if (typeof hardTimer.unref === 'function') hardTimer.unref();
  });
}

/**
 * Runs `claude <args>` against `dir` and returns its parsed JSON output — from
 * the first way of running it that produced any. Throws if none did. All the
 * attempts share one `timeoutMs` budget.
 */
async function runClaudeJson(args: string[], dir: string, timeoutMs: number): Promise<unknown> {
  const env = envFor(dir);
  const deadline = Date.now() + timeoutMs;
  let lastError = 'no way to run the claude CLI';
  for (const cmd of claudeCommands(args, dir)) {
    const left = deadline - Date.now();
    if (left <= 0) {
      lastError = `timed out after ${timeoutMs}ms`;
      break;
    }
    const { stdout, error } = await run(cmd, env, left);
    try {
      return JSON.parse(stdout);
    } catch {
      lastError = `${path.basename(cmd.file)}: ${error ?? 'output was not JSON'}`;
    }
  }
  throw new Error(`claude ${args.join(' ')}: ${lastError}`);
}

/**
 * Returns the authenticated account for a config dir, or null if the CLI call
 * fails or the dir isn't logged in. Never throws.
 */
export async function getAuthStatus(
  dir: string,
  timeoutMs = 15000
): Promise<AuthStatus | null> {
  try {
    const parsed = (await runClaudeJson(['auth', 'status', '--json'], dir, timeoutMs)) as AuthStatus;
    if (typeof parsed?.loggedIn !== 'boolean') throw new Error('unexpected output');
    // Recent Claude Code versions (2.1.x) return `email: null` from
    // `auth status --json` even when logged in via claude.ai. The email still
    // lives in the account's .claude.json (oauthAccount.emailAddress), so fall
    // back to it — otherwise every identity-dependent flow (capture, switch,
    // dedupe-by-email) silently bails out with "no signed-in account".
    if (parsed.loggedIn && !parsed.email) {
      const id = readIdentity(dir);
      if (id?.email) {
        parsed.email = id.email;
        if (!parsed.orgName && id.organizationName) parsed.orgName = id.organizationName;
      }
    }
    log(`auth status(${dir}): loggedIn=${parsed.loggedIn} email=${parsed.email ?? '(none)'}`);
    return parsed;
  } catch (err) {
    log(`auth status(${dir}) FAILED: ${(err as Error).message.split('\n')[0]}`);
    return null;
  }
}
