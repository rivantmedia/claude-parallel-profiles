# Claude Parallel Profiles

[![CI](https://img.shields.io/github/actions/workflow/status/rivantmedia/claude-parallel-profiles/ci.yml?label=CI)](https://github.com/rivantmedia/claude-parallel-profiles/actions)
[![Platform: Linux | macOS](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20WSL%20%7C%20SSH-orange.svg)](#requirements)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A companion for the [Claude Code extension for VS Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code): run a different Claude account in each VSCode window, at the same time — with one shared conversation history.**

**[⬇️ Install from the Marketplace](https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles)** · **[🐙 Source](https://github.com/rivantmedia/claude-parallel-profiles)** · **[🐛 Report an issue](https://github.com/rivantmedia/claude-parallel-profiles/issues)**

Published by **Rivant Media**. A fork of [DercasDrol/claude-parallel-profiles](https://github.com/DercasDrol/claude-parallel-profiles) ("Claude Parallel Accounts") that adds **macOS** support; all credit for the original design goes to its author.

Claude Code signs you into **one** account, shared by every VSCode window. If you juggle several — personal, work, a second Pro for when the first hits its limits — this extension gives **each window its own account**: pick it once per window, and your conversations follow you across accounts instead of disappearing.

ℹ️ It's a **companion**, not a replacement: the official Claude Code extension must be installed; this one only controls which account each window uses.

> 🐧🍎 **Linux and macOS.** Runs on desktop VSCode on Linux and **macOS**, in **WSL**, over **Remote-SSH** to a Linux or macOS host, and in dev containers. The check happens where the extension actually runs (in a WSL/SSH window, that's the *remote* side), so a Windows desktop driving a Linux remote works fully. On **native Windows** the extension stays completely **inert**: no files read or written, no accounts touched, and the status bar says why. Claude Code stores credentials differently there, and guessing would be worse than declining.
>
> On macOS, Claude Code keeps each account's token in the **login Keychain** rather than in a file. The extension handles those Keychain items the same way Claude Code does. See [How it works](#how-it-works).

---

## The idea in 30 seconds

- **Sign in as usual** — through Claude Code's own UI (its account menu; `/login` in the chat works too). The extension notices and saves the account by itself — nothing extra to click, no names to invent: the account *is* its email.
- **Each window picks its account** from the status bar. Two windows run two accounts simultaneously — no logout/login dance, no cross-contamination. The window's integrated terminals get the same account.
- **Switching reloads the window** — required, not cosmetic: Claude Code reads its account once at start-up, so only a reload makes it both *show* and *bill* the account you picked.
- **History stays one whole.** Giving each window its own data directory would scatter your chats across them, so the extension keeps them in one store instead — your history is exactly the single history Claude Code always had. Hit a usage limit, switch account, *continue the same conversation*.
- **Forget really signs out.** Forgetting an account deletes its OAuth token from every copy on this machine and stops sessions running on it. The data directories stay — signing in again restores everything.
- **Uninstalling really cleans up.** Your history is consolidated back into the default `~/.claude`, your last account is handed back to Claude Code (still signed in), and every folder the extension made is deleted — no tokens left lying around.

> ⭐ **Enjoying it?** [Rate it on the Marketplace](https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles&ssr=false#review-details) — it helps other developers discover it.

---

## Requirements

| Requirement | Notes |
| --- | --- |
| Linux or macOS | desktop Linux or macOS, WSL, Remote-SSH (Linux or macOS host), or a dev container |
| VSCode ≥ 1.85 | the extension installs where Claude Code runs (on WSL/SSH, the remote side) |
| [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) | the thing being multiplied |
| `claude` CLI | asked read-only whether a directory is signed in. Found on `$PATH` or, failing that, bundled with the Claude Code extension (on macOS the bundled one is tried first) |

---

## Quick start

1. **Install** from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles) (search "Claude Parallel Profiles"). Coming from the original *Claude Parallel Accounts*? See [Switching from the original extension](#switching-from-the-original-extension) first.
2. **You're probably already signed in** — the status bar shows your email, and the account is saved automatically.
3. **Add the second account**: in Claude Code, sign in as the other account (its account menu — or `/login` in the chat). The extension saves it and reloads the window onto it — the previous account stays in the list.
4. **Assign accounts to windows**: status bar → **Switch account**. Open another window for another project, give it the other account — both run in parallel.

---

## Daily use

**The status bar item** — `👤 you@example.com` is the account **this window** runs as, confirmed against the real token (`claude auth status`), not just a label. **Click** it and the one action that makes sense right now happens directly: switch when there are other accounts, pick a saved account when the window is signed out, save when the account is new. **Hover** it for the full card — account details, switch/forget actions, and quick links to the extension page, its settings and its log.

**Switching** reloads the window; after the reload both the identity Claude Code shows and the token it bills are the ones you picked.

**Signing in as another account inside a window** (Claude Code's account menu, or `/login`) replaces only *that window's* account. The extension saves the new account, keeps the old one in the list, and reloads the window so Claude Code actually switches to it — other windows are untouched.

**Reopening a project** — the extension remembers which account each repository used last and restores it automatically (the tooltip says so).

**One account, one entry** — saving the same email twice reuses the existing entry; lists are collapsed by email, so you always see one row per account.

**Forgetting** (status bar hover → *Forget…*) asks for confirmation, then removes the account from the list, **deletes its OAuth token from every copy on this machine**, interrupts Claude sessions running on it, and reloads any window that was using it (that window then offers to switch to another saved account). History, settings and the data folders stay on disk; signing in again brings the account back. On macOS, if the Keychain doesn't answer for one of the copies (for example because it's locked), *Forget* changes nothing and asks you to unlock it and retry. It never reports a sign-out it couldn't complete.

**Signing out** (Claude Code's account menu, or `/logout`) revokes the token on Anthropic's side — for every copy of it. The extension notices and removes the account from the list everywhere, since switching to it could only fail.

---

## One conversation history

Claude Code has **one** history: it is stored per *data directory*, and vanilla Claude Code only ever has one directory. This extension gives each window a directory of its own — so it has to put the history back together, or installing it would make every conversation you ever had disappear from the panel.

It does that with one store, `~/.claude-shared`, symlinked from every directory:

```text
~/.claude/projects                ──┐
~/.claude-work/projects           ──┼──▶  ~/.claude-shared/projects/<per-repo>/…
~/.claude-windows/a1b2…/projects  ──┘
```

- Conversations, session state, plans and todos live there. **Credentials and identity never do** — those stay strictly per-account, which is the whole point of the extension.
- Transcripts stay keyed by workspace folder, exactly as Claude Code writes them, so nothing leaks between repositories.
- Hit a usage limit, switch account, carry on in the same conversation.

There is **nothing to configure** — this isn't a feature bolted onto Claude Code, it's what keeps Claude Code's own behaviour intact. (Up to v1.2.7 a `sharedHistory` toggle existed. Turning it off isolated nothing meaningful — it copied the entire history into every directory. It's gone.)

**Uninstalling** moves the store back into the default `~/.claude` — see [Uninstalling](#uninstalling).

---

## How it works

Claude Code resolves its data directory from the `CLAUDE_CONFIG_DIR` environment variable. Every VSCode window runs its own extension-host process, so `process.env` is per-window — that's the isolation mechanism. Each **account** is a store (`~/.claude-<name>`); each **window** runs on a private working copy of the account it picked:

```text
account stores                    per-window working copies
~/.claude-work      ──copy──▶    ~/.claude-windows/a1b2… ◀── window A (CLAUDE_CONFIG_DIR)
~/.claude-personal  ──copy──▶    ~/.claude-windows/c3d4… ◀── window B (CLAUDE_CONFIG_DIR)
```

The details that make it reliable — each one a bug found and fixed:

- **Activation order.** Claude Code reads `CLAUDE_CONFIG_DIR` the moment it activates and caches it — so this extension must get there *first*. It uses the `*` activation event, which VSCode's docs discourage because it loads the extension at every start-up: a deliberate, load-bearing trade-off — with any lazier activation the variable would be set after Claude Code has already read it, and per-window accounts simply wouldn't work. The cost is kept negligible: a ~25 KB bundle with zero dependencies, and the activation path itself only sets the variable and does a handful of file checks — everything heavier is deferred. (The same start-up read is why switching needs a window reload.)
- **A working copy per window.** A `/login` writes into the window's own directory, so it can only ever affect that window — "which window signed in?" is answered by construction, and no other window's account can be overwritten. Copies of an OAuth token authenticate independently, so the duplicates are safe.
- **macOS: the token lives in the Keychain.** On macOS, Claude Code doesn't write `.credentials.json`. It stores each data directory's token as a login-Keychain item named after the directory: `Claude Code-credentials` for the default `~/.claude`, and `Claude Code-credentials-<first 8 hex chars of sha256(CLAUDE_CONFIG_DIR)>` for any other directory. So every per-window working copy gets a Keychain item of its own, and isolation works exactly as it does with files on Linux. The extension reads and writes those items the way Claude Code does, through `/usr/bin/security`. Values go in hex-encoded over stdin, so a token never shows up in a process listing. Claude Code's plaintext fallback file is honored when reading. A locked Keychain counts as "can't tell", never as "signed out", so no account is ever dropped because the Keychain was unavailable. Sign-ins and sign-outs inside a window are noticed by polling the keychain database's modification time and comparing an attributes-only fingerprint of the window's item; the secret is never read for that.
- **No competing source of truth.** A machine-wide `CLAUDE_CONFIG_DIR` in `claudeCode.environmentVariables` or `terminal.integrated.env` would force all windows onto one account — the extension strips it and keeps isolation in `process.env` only.
- **Terminals follow the window.** Integrated terminals get the window's account via VSCode's environment-variable API. External terminals (outside VSCode) keep using the default `~/.claude`.
- **Reload safety.** Automatic reloads (after a forget or an in-window sign-in) go through a circuit breaker: state is corrected *before* reloading, and at most one automatic reload per minute — a misbehaving edge case degrades to a message with a button, never a reload loop.
- **Survives its own absence.** The account you last used (in the focused window) is mirrored into Claude Code's own default `~/.claude`, so if the extension is ever gone — uninstalled, disabled, or not yet activated — Claude Code is already signed in there and just works. Nothing important waits on the uninstall script, which VSCode defers to its next restart and may never run.
- **Found where it runs.** The extension is published as a single universal package, not per-platform. In WSL and Remote-SSH it executes on the *remote*, but the VSCode *client* that resolves the Marketplace is often a different OS. A per-platform build would be invisible to that client, which would then report the extension as missing and never update it. The platform requirement is enforced at runtime instead (the inert mode on native Windows).

---

## Settings

**None.** The extension has no settings — it does one thing and there is nothing to tune. Accounts are managed entirely from the status bar.

---

## Privacy & your data

This extension is built to manage credentials, so it holds itself to a strict policy — each point verifiable in the [source](https://github.com/rivantmedia/claude-parallel-profiles):

- **No telemetry, no analytics, no network code at all.** The source contains zero network calls and **zero runtime dependencies** — it is your files, the `vscode` API, and Node's standard library. Nothing is ever sent anywhere.
- **Everything stays on this machine.** Accounts, working copies and the history store live under `~/.claude*`, created with owner-only permissions (`600`/`700`). On macOS the tokens stay in your login Keychain, under the item names Claude Code itself uses. Credentials are only ever *copied between* Claude Code's own data directories (or their Keychain items) on this machine. They are never parsed, never displayed, never logged and never transmitted.
- **Conversations are moved, not read.** Shared history relinks the files; the extension does not inspect their contents.
- **Minimal footprint elsewhere:** the workspace folder path is hashed to tell windows apart; `claude auth status` is asked (locally, read-only) to confirm a directory is signed in; the process list (`/proc` on Linux/WSL, `ps` on macOS) is scanned only during *Forget*, to stop `claude` processes running on the token being deleted.
- **Self-restricted in the VSCode manifest:** disabled in virtual workspaces, and in Restricted Mode (untrusted folders) it never reads workspace content — only the folder's path, to tell windows apart ([`capabilities`](package.json)).
- **Inert on unsupported platforms.** On native Windows (or any other unsupported OS) it performs no operations at all — no file reads, no writes, no account changes; the uninstall hook is guarded the same way.
- **Uninstalling cleans up after itself:** the directories the extension created are deleted and stray OAuth tokens wiped, including their Keychain items on macOS. The one token it leaves is Claude Code's own default login (`~/.claude`, or the `Claude Code-credentials` Keychain item on macOS), exactly where Claude Code keeps it with no extension installed. See [Uninstalling](#uninstalling).

---

## Uninstalling

Removing the extension leaves the machine as if it had never been installed — **and leaves Claude Code signed in and working**.

**You stay signed in the whole time, not just at the end.** While the extension runs it continuously keeps Claude Code's own default account (`~/.claude`) pointed at whichever account you last used — the normal place Claude Code keeps its login. So the instant the extension is gone — uninstalled, disabled, or simply not activated yet — plain Claude Code is already signed in and working. This does **not** depend on the uninstall step running: VSCode defers uninstall scripts to its next restart (and may skip them), so nothing that matters is trusted to one.

When the uninstall script *does* run, it tidies up:

- **Your history is consolidated** into `~/.claude` — the shared store is *moved* there (instant, whatever its size; a few hundred milliseconds even for gigabytes), and any history an account kept to itself is folded in. Plain Claude Code has one history, not one per account.
- **Every directory the extension created is deleted** — the account stores, the per-window working copies, the shared store. No duplicated history, and no OAuth token left in a folder only this extension ever used. On macOS the Keychain item of each of those directories is deleted too, so none is left orphaned.
- **If anything can't be moved in time**, the script stops rather than risk your data: it still wipes stray tokens, but keeps any directory whose history hasn't safely reached `~/.claude`. (It runs on a strict deadline — VSCode kills uninstall scripts after five seconds — so it never reads a file it can only move.)

Your other accounts stay signed out afterwards — sign into them the normal way. Directories the extension didn't create are never deleted. That includes a `~/.claude-<name>` profile you made yourself that the extension found and added to its list: it keeps its settings and its sign-in, and only has its history links pointed at `~/.claude`. The script deletes only what a manifest of its own says it created. If a newer copy of the extension is already installed, it does nothing at all.

---

## Limitations

- **Native Windows is not supported.** Credential storage there is untested, so the extension refuses to run rather than guess (see the note at the top). Use a WSL window instead.
- **macOS: a locked Keychain pauses account bookkeeping.** If the Keychain can't be read (for example over SSH with the login keychain locked), the extension leaves everything as it is and waits, rather than treating accounts as signed out. The same applies to Claude Code itself: in that situation it falls back to a plaintext `.credentials.json`, and the extension honors that file.
- **Loads at every VSCode start-up** (`*` activation). Required to win the activation race against Claude Code — see [How it works](#how-it-works). The extension is deliberately tiny, so the impact is milliseconds.
- **API-key users**: this is for OAuth (claude.ai) logins. With `ANTHROPIC_API_KEY` you don't need it — set the key per window yourself.
- **Switching reloads the window** — a consequence of Claude Code reading its account once at start-up; surfaced honestly rather than pretended around.
- **Uninstalling leaves you signed into one account** (the last one you used). Vanilla Claude Code holds one account at a time — the others have to be signed into the normal way.
- **The same project in two windows shares one conversation list.** VSCode won't open the same folder twice, but a folder and a `.code-workspace` containing it are two windows on one project — and since history is one store (as it is in plain Claude Code), both see the same chats and could resume the same one under *different accounts*. The transcript is a tree of parent-linked entries, so this forks the conversation rather than corrupting it, but the two branches will bill two accounts. Don't drive one chat from two windows at once.

---

## Switching from the original extension

This is a fork of *Claude Parallel Accounts* (`DercasDrol.claude-parallel-accounts`). Both use the same directories (`~/.claude-windows`, `~/.claude-shared`, `~/.claude-<name>`), so **don't run both at once**: they register the same commands, and the second one reports the conflict.

To switch safely, **uninstall the original first, then fully quit VS Code** (on macOS, Cmd+Q), so its uninstall step runs. That step brings your conversation history back into `~/.claude` and leaves Claude Code signed in as the account you used last. Then install this one: it picks that account up automatically. Sign in to your other accounts once more, and they're saved again.

(On macOS the original never did anything, since it only ran on Linux, so there is nothing to clean up: just uninstall it.)

Why not the other way around? The original's uninstall step only knows its own name. If it runs while this extension is installed, it cleans up directories this one is using. (This extension's uninstall step recognises both, and does nothing while the other is installed.)

---

## Development & releases

```bash
npm ci            # install
npm run watch     # dev build with watch
npm run compile   # typecheck + build
npm run package   # build .vsix
```

To try a local build, install the `.vsix` with **Extensions → ⋯ → Install from VSIX…** (or `code --install-extension claude-parallel-profiles-<version>.vsix`), then reload the window.

- **CI** ([ci.yml](.github/workflows/ci.yml)): every push/PR to `main` builds and uploads the `.vsix` artifact.
- **Release** ([release.yml](.github/workflows/release.yml)): pushing a `v*` tag builds, creates a GitHub Release with the `.vsix`, and publishes to the VS Code Marketplace (`VSCE_PAT` secret) and Open VSX (`OVSX_PAT` secret). Either publish step is skipped when its secret isn't set.

### Publishing as Rivant Media

The extension is published under the Marketplace publisher **`rivantmedia`** (`publisher` in [package.json](package.json)), so its id is `rivantmedia.claude-parallel-profiles`.

1. **Publisher**: in the [Marketplace publisher portal](https://marketplace.visualstudio.com/manage), signed in with the Rivant Media Microsoft account, create the publisher with the ID `rivantmedia` (display name *Rivant Media*). If the ID you get is different, change `publisher` in `package.json` to match. The id is part of the extension's identity, so settle it before the first release.
2. **Token**: in the Azure DevOps organisation tied to that account, create a Personal Access Token with **Organization: All accessible organizations** and **Scopes: Marketplace → Manage**. Add it to this repository as the Actions secret `VSCE_PAT`.
3. **Open VSX** (optional, for VSCodium, Cursor and others): create a `rivantmedia` namespace at [open-vsx.org](https://open-vsx.org) (`npx ovsx create-namespace rivantmedia -p <token>`), and add the token as `OVSX_PAT`.
4. **Release**: bump `version` in `package.json`, add a `CHANGELOG.md` entry, then tag and push. The workflow does the rest.

To publish by hand instead: `npx @vscode/vsce login rivantmedia`, then `npx @vscode/vsce publish --allow-star-activation`. The `*` activation is deliberate (see *How it works*), and the flag keeps vsce from stopping to ask about it.

```bash
# release flow: make sure package.json version matches the tag, then
git tag v<version>
git push origin main --tags     # CI does the rest
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
