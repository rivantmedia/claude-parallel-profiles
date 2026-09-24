# Changelog

## 1.4.0 — 2026-09-25

**First release as *Claude Parallel Profiles* by Rivant Media** (`rivantmedia.claude-parallel-profiles`). It is a fork of *Claude Parallel Accounts* (`DercasDrol.claude-parallel-accounts`), and the entries below 1.4.0 are that project's history. Both use the same directories, so don't run both; see *Switching from the original extension* in the README. This version's uninstall step recognises the original and leaves the data alone while it is installed.

### Added

- **macOS support.** On macOS, Claude Code keeps each data directory's OAuth token in the login Keychain rather than in `.credentials.json`. It names the item after the directory: `Claude Code-credentials` for the default `~/.claude`, and `Claude Code-credentials-<first 8 hex of sha256(CLAUDE_CONFIG_DIR)>` otherwise. A new credential layer (`src/credentials.ts`) reads and writes the token where Claude Code actually looks for it on each OS:
  - on Linux, the file, as before;
  - on macOS, the Keychain item, through `/usr/bin/security` exactly as Claude Code does. The token is written hex-encoded through `security -i` on stdin, so it never appears in a process listing. Claude Code's plaintext fallback file is honored on read.

  Per-window isolation carries over unchanged, because each working directory gets its own Keychain item by construction. Verified against Claude Code 2.1.281: its CLI reads a Keychain item written by the extension as signed in.
- A Keychain that can't be asked (locked, timed out, prompt dismissed) is reported as **unknown**, never as "signed out". Nothing destructive happens on an unknown answer: no account is pruned, no window is treated as logged out, and nothing is signed out everywhere. *Forget* checks every copy of the account first and changes nothing if one can't be checked. It then deletes the token from the account's own store (no session runs there) before touching anything else, and if the Keychain refuses that delete, it stops with nothing changed. After one such failure, background work leaves the Keychain alone for 60 s, so a locked Keychain can't freeze the window again and again. Anything you ask for yourself retries every Keychain call for real.
- Live-session detection for *Forget* on macOS uses `ps -E` instead of `/proc`. It reads `CLAUDE_CONFIG_DIR` only from a process's environment, never from its arguments. A process whose environment can't be read (for example a Node-hosted `claude` that sets its title) is left alone and reported, never guessed at.
- The account watcher notices Keychain changes on macOS (sign-in or sign-out inside a window) by polling the keychain database's modification time and comparing an attributes-only fingerprint of the window's item. It never reads the secret to do this.
- The uninstall hook runs on macOS too. It hands the last-used account back to the `Claude Code-credentials` item and deletes every Keychain item belonging to the extension's directories.

### Changed

- **New icon**: three stacked sparks, flat, in Claude's colour palette, set on Rivant Media's brand ground: void black, the faded slate grid and the rings shape, signed "by" with the official Rivant logo. The spark is an original drawing, not Anthropic's logo. It ships at 256×256 for high-DPI displays.

### Fixed

- **Uninstall never deletes a profile you made yourself.** A `~/.claude-<name>` directory the extension found and adopted (say, from running `CLAUDE_CONFIG_DIR=~/.claude-work claude`) used to be deleted on uninstall, together with its settings and token. Stores are now recorded as *created* or *adopted* (created ones also carry a marker file, so every window agrees), and only created ones are deleted. Adopted ones keep everything, and their history links are pointed at `~/.claude`. Entries from before 1.4.0 count as created only if they hold nothing but what the extension puts in a store. This affects Linux too.
- **Two windows on different accounts no longer fight over the default account.** Every window mirrored its account into `~/.claude` on every reconcile and woke up on the other window's mirror, so the two overwrote each other every few seconds. Now only the focused window mirrors, and a bound window no longer watches `~/.claude.json`. This affects Linux too.
- *Forget* and the automatic sign-out after a `/logout` no longer claim success when a token couldn't be deleted. The directory keeps its identity, and the message says what is left.
- A window whose working copy couldn't be stocked (its store's token was unreadable) is retried instead of being mistaken for a `/logout` once Claude Code writes an empty config into it. Switching to an account whose saved sign-in can't be read now says so and changes nothing, instead of reloading onto the old account.
- The uninstall hand-back writes large tokens (over ~2 KB) to the Keychain, as Claude Code does. It fails closed instead of writing a plaintext token that an older Keychain item would shadow. A directory whose Keychain item couldn't be deleted is kept, since its path is the only record of the item's name. The Keychain calls stay within VS Code's 5 s limit.
- `CLAUDE_CONFIG_DIR` inherited as `~/.claude` (with or without a trailing slash) is honored: Claude Code then uses the hashed Keychain name and keeps the identity inside the directory. An unbound window goes back to the inherited value rather than to an unset variable. `CLAUDE_CODE_CUSTOM_OAUTH_URL` set in `claudeCode.environmentVariables` is honored when naming Keychain items. `CLAUDE_SECURESTORAGE_CONFIG_DIR` is also removed from those settings, and pointed at the window's own directory in its terminals.
- `~/.claude-vault` (a leftover of an early Linux-only design) is only ever removed on Linux.
- `claude auth status` for a signed-out directory was reported as "CLI unreachable". It exits with code 1 but still prints valid JSON, which is now read.
- The default `~/.claude` is now queried with `CLAUDE_CONFIG_DIR` **unset**, which is how Claude Code runs it, instead of set to `~/.claude`. The two differ in where the identity lives and, on macOS, in the Keychain item's name. Through a login shell the variable is now set *after* the profile runs, so a profile that exports its own `CLAUDE_CONFIG_DIR` can no longer make the CLI answer for the wrong directory.
- If the `claude` CLI can't be run through a login shell, the binary bundled with the Claude Code extension is used. On macOS that binary is tried first: it is the one the panel runs, and it avoids depending on a GUI-launched VS Code's PATH. All attempts share one time budget.
- A working directory is no longer stocked with just the identity when the account's store has no readable token. That half-state looked exactly like a logout.
- An inherited `CLAUDE_SECURESTORAGE_CONFIG_DIR` is dropped from the extension host. It would pin every window's Claude Code to one token.

## 1.2.5 — 2026-07-12

### Fixed

- **Shared-history links are created the moment a window's working directory is stocked**, not only at activation. Previously a `claude` process started right after a mid-session bind could write history into unlinked real directories — invisible to other accounts — and could not see conversations recorded before the bind, failing with "Session … not found" when forking/resuming (the root cause of that error on v1.2.0/1.2.1; the stray history was merged back into the shared store automatically, nothing was lost).

### Changed

- Sign-in/out wording in the README and in messages now leads with Claude Code's account-menu UI; slash commands are mentioned as the alternative.
- README documents the deliberate `*` activation trade-off: why winning the activation race against Claude Code requires it, and why the cost stays negligible (~25 KB bundle, zero dependencies, trivial activation path).
- README: the single-setting table replaced with plain text.

## 1.2.4 — 2026-07-12

### Changed

- **Linux-only platform gate.** The extension is built for the file-based credential layout Claude Code uses on Linux; elsewhere those assumptions break (macOS keeps credentials in the Keychain, native Windows is untested). Two layers now enforce this honestly:
  - the Marketplace release ships **Linux packages only** (x64/arm64/armhf + Alpine), so macOS / native Windows aren't offered the extension at all — WSL, Remote-SSH and dev containers install into the remote Linux side and keep working;
  - if a VSIX is side-loaded anywhere else, the extension activates into an **inert mode**: no files read or written, no accounts or settings touched (the uninstall hook is guarded the same way); the status bar and all commands explain the situation instead of failing cryptically.
- README: prominent platform-support note; deduplicated the header links (one Marketplace link instead of six) and replaced the retired shields.io marketplace badges with live CI/platform/license ones.

## 1.2.3 — 2026-07-12

The per-window architecture release: account isolation is now structural, not heuristic.

### Added

- **Per-window working directories.** Each window runs a private copy (`~/.claude-windows/<id>`) of its account's store, so a `/login` can only ever affect the window it happened in — no shared state, no focus guessing, no races.
- **Auto-save.** A signed-in account is saved the moment it's noticed; the separate "save" step is no longer required (the command remains for manual use).
- **Forceful forget.** Forgetting an account now deletes its OAuth token from every copy on the machine, interrupts live `claude` sessions running on it, and reloads any window that used it — with a confirmation up front and a "Switch account" offer after.
- **Logout handling.** `/logout` revokes the token server-side, so the account is removed from the list everywhere instead of lingering as a dead entry.
- **Terminals follow the window.** Integrated terminals get the window's account via VSCode's environment-variable collection.
- **Status bar hover card** with the extension's name, account details, actions, and quick links to Settings, the extension page, and the log (new *Show Log* command).
- **Reload circuit breaker.** All automatic window reloads correct their trigger state first and are capped at one per minute — a misbehaving edge degrades to a message with a manual button, never a reload loop.
- **Manifest self-restrictions:** disabled in virtual workspaces; limited (content never read, settings not overridable) in Restricted Mode.
- Signed-out windows offer one-click switching to a saved account (status bar click, notices, hover).

### Fixed

- Infinite reload loop after forgetting the account a window was running.
- Switching appearing to do nothing after an in-window `/login` (the window now fully reloads onto the new account; the old one stays in the list).
- Newly added accounts not appearing in other windows until restart (the registry now converges on the on-disk stores).
- A fresh login taking ~30 s to be saved (identity is read from disk instead of spawning the CLI).
- A failed working-copy stocking is no longer mistaken for a logout (which used to drop a perfectly good account).
- Uninstall now also reverts the nested per-window directories and removes their token copies.

## 1.1.5 — 2026-07-12

- Reliable per-window switching: activation-order fix (the extension now sets `CLAUDE_CONFIG_DIR` before Claude Code reads it), machine-wide setting overrides stripped, identity confirmed against the real token.

## 1.0.5 — 2026-07-12

- Rework into per-window parallel accounts with a shared conversation history store (`~/.claude-shared`) and clean uninstall.

## 1.0.0 — 2026-07-12

- Initial release: capture, switch and isolate Claude Code accounts per VSCode window.
