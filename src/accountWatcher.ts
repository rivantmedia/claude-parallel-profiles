import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { WindowBinding } from './binding';
import { defaultSourceDir } from './capture';
import { credentialStamp, isDefaultConfigDir, keychainFiles, tokenFile } from './credentials';

/**
 * Keeps the status bar honest by repainting it the moment this window's account
 * identity changes on disk — e.g. the user runs `/login` inside this window,
 * which (because our binding wins the activation race) rewrites the bound dir's
 * identity. Without this the bar would lag until the next focus/TTL tick.
 *
 * It deliberately does NOT compare against the default `~/.claude` account:
 * once Claude Code reads `CLAUDE_CONFIG_DIR` at activation, the account this
 * window uses IS the bound dir, not the ambient default — so the default file
 * is irrelevant here and comparing to it only produces false "diverged" alarms.
 */
export class AccountWatcher implements vscode.Disposable {
  private readonly watched: string[] = [];
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly binding: WindowBinding,
    /** Called on any identity-file change so the status bar can repaint live. */
    private readonly onIdentityChange: () => void
  ) {}

  start(): void {
    // Watch the identity file backing this window's account: the bound dir's
    // .claude.json, or — for an unbound window — the home-root ~/.claude.json
    // where the default account keeps its identity. watchFile (poll-based)
    // survives the atomic temp+rename writes that break fs.watch, and fires on
    // deletion too.
    //
    // The TOKEN file is watched as well, and it's the one that actually decides
    // whether this window is signed in: a `/logout`, or a forget performed in
    // ANOTHER window, deletes `.credentials.json` while the identity file stays
    // behind. Without this the bar would keep showing the account as live.
    const dir = this.binding.getEnvDir() ?? defaultSourceDir();
    const onDefault = isDefaultConfigDir(dir);
    const files = new Set<string>([path.join(dir, '.claude.json'), tokenFile(dir)]);
    // The home-root config is the DEFAULT account's identity — this window's only
    // while it runs on the default dir. A bound window must not wake up on it:
    // other windows mirror their account into it, and reacting to that is how two
    // windows ended up rewriting the default back and forth forever.
    if (onDefault) files.add(path.join(os.homedir(), '.claude.json'));
    for (const f of files) {
      fs.watchFile(f, { interval: 2000 }, () => this.schedule());
      this.watched.push(f);
    }

    // On macOS the token isn't a file: a `/login` or `/logout` rewrites this dir's
    // Keychain item instead. Nothing announces that, but any Keychain write
    // touches the keychain database — so poll that (a stat, like the files
    // above) and, when it moves, check whether it was THIS dir's item. Other apps
    // write to the login keychain too; the fingerprint keeps their writes from
    // waking reconcile up.
    let stamp = keychainFiles().length > 0 ? credentialStamp(dir) : '';
    for (const f of keychainFiles()) {
      fs.watchFile(f, { interval: 2000 }, () => {
        const next = credentialStamp(dir);
        if (next === stamp) return;
        stamp = next;
        this.schedule();
      });
      this.watched.push(f);
    }
  }

  private schedule(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onIdentityChange(), 400);
  }

  dispose(): void {
    if (this.timer) clearTimeout(this.timer);
    for (const f of this.watched) fs.unwatchFile(f);
  }
}
