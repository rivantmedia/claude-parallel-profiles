# Claude Parallel Profiles

[![CI](https://img.shields.io/github/actions/workflow/status/rivantmedia/claude-parallel-profiles/ci.yml?label=CI)](https://github.com/rivantmedia/claude-parallel-profiles/actions)
[![Platform: Linux | macOS](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20WSL%20%7C%20SSH-orange.svg)](#requirements)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A companion for the [Claude Code extension for VS Code][claude-code]: run a
different Claude account in each VS Code window at the same time, with one
shared conversation history.

[Install from the Marketplace][marketplace] · [Source][repo] ·
[Report an issue][issues]

Claude Code signs you into **one** account, shared by every VS Code window. If
you juggle several (personal, work, a second Pro for when the first hits its
limits), this extension gives **each window its own account**. You pick it once
per window, and your conversations follow you across accounts instead of
disappearing.

It is a **companion**, not a replacement. The official Claude Code extension
must be installed; this one only controls which account each window uses.

Published by **Rivant Media**. It is a fork of
[DercasDrol/claude-parallel-profiles][original] ("Claude Parallel Accounts")
that adds **macOS** support. All credit for the original design goes to its
author.

## Contents

- [The idea in 30 seconds](#the-idea-in-30-seconds)
- [Requirements](#requirements) and [platform support](#platform-support)
- [Quick start](#quick-start)
- [Daily use](#daily-use)
- [One conversation history](#one-conversation-history)
- [How it works](#how-it-works)
- [Settings](#settings)
- [Privacy & your data](#privacy--your-data)
- [Uninstalling](#uninstalling)
- [Limitations](#limitations)
- [Switching from the original extension][switching]
- [For maintainers](#for-maintainers)
- [License](#license)

## The idea in 30 seconds

- **Sign in as usual.** Use Claude Code's own UI: its account menu, or
  `/login` in the chat. The extension notices and saves the account by itself.
  There is nothing extra to click and no name to invent: the account *is* its
  email.
- **Each window picks its account.** You choose it from the status bar. Two
  windows run two accounts at the same time, with no logout-and-login dance and
  no cross-contamination. The window's integrated terminals get the same
  account.
- **Switching reloads the window.** This is required, not cosmetic. Claude Code
  reads its account once at start-up, so only a reload makes it both *show* and
  *bill* the account you picked.
- **History stays whole.** Giving each window its own data directory would
  scatter your chats across them, so the extension keeps them in one store
  instead. Your history is exactly the single history Claude Code always had.
  Hit a usage limit, switch account, and *continue the same conversation*.
- **Forget really signs out.** Forgetting an account deletes its OAuth token
  from every copy on this machine and stops sessions running on it. The data
  directories stay, so signing in again restores everything.
- **Uninstalling really cleans up.** Your history is consolidated back into the
  default `~/.claude`, and your last account is handed back to Claude Code,
  still signed in. Every folder the extension made is deleted, so no tokens are
  left lying around.

Enjoying it? [Rate it on the Marketplace][rate]. It helps other developers
discover it.

## Requirements

- **Linux or macOS:** desktop Linux or macOS, WSL, Remote-SSH (Linux or macOS
  host), or a dev container. See [Platform support](#platform-support).
- **VS Code ≥ 1.85:** the extension installs where Claude Code runs (on WSL or
  SSH, the remote side).
- **The [Claude Code extension][claude-code]:** the thing being multiplied.
- **The `claude` CLI:** asked, read-only, whether a directory is signed in. It
  is found on `$PATH` or, failing that, bundled with the Claude Code extension
  (on macOS the bundled one is tried first).

### Platform support

| Where it runs | Status | Notes |
| --- | --- | --- |
| Desktop VS Code on Linux | Supported | |
| Desktop VS Code on macOS | Supported | Tokens live in the login Keychain |
| WSL | Supported | Runs on the WSL side of the window |
| Remote-SSH to a Linux or macOS host | Supported | Runs on the remote host |
| Dev containers | Supported | |
| Native Windows | Not supported | Inert: does nothing (see below) |

The check happens where the extension actually runs. In a WSL or SSH window that
is the *remote* side, so a Windows desktop driving a Linux remote works fully.

**Native Windows.** The extension stays completely **inert**: no files read or
written, no accounts touched, and the status bar says why. Claude Code stores
credentials differently there, and guessing would be worse than declining.

**macOS.** Claude Code keeps each account's token in the **login Keychain**
rather than in a file. The extension handles those Keychain items the same way
Claude Code does. See the
[Keychain details](#macos-the-token-lives-in-the-keychain) under How it works.

## Quick start

1. **Install it.** Get it from the [Marketplace][marketplace] (search "Claude
   Parallel Profiles"). Coming from the original *Claude Parallel Accounts*?
   Read [Switching from the original extension][switching] first.
2. **You're probably already signed in.** The status bar shows your email, and
   the account is saved automatically. The first time, the window reloads once
   to move onto a directory of its own.
3. **Add the second account.** In Claude Code, sign in as the other account (its
   account menu, or `/login` in the chat). The extension saves it and reloads
   the window onto it. The previous account stays in the list.
4. **Assign accounts to windows.** In the status bar, choose **Switch account**.
   Open another window for another project and give it the other account. Both
   run in parallel.

## Daily use

### The status bar item

The status bar shows a person icon followed by the account **this window** runs
as, for example `you@example.com`. The account is confirmed against the real
token (`claude auth status`), so it is not just a label. An empty circle after
the email means the account isn't saved yet, and a signed-out window shows
`Claude: sign in`.

**Click** it and the one action that makes sense right now happens directly:
switch when there are other accounts, pick a saved account when the window is
signed out, save when the account is new.

**Hover** it for the full card: account details, switch and forget actions, and
quick links to the extension page and its log.

### Switching

Switching reloads the window. After the reload, both the identity Claude Code
shows and the token it bills are the ones you picked.

### Signing in as another account

Signing in as another account inside a window (Claude Code's account menu, or
`/login`) replaces only *that window's* account. The extension saves the new
account, keeps the old one in the list, and reloads the window so Claude Code
actually switches to it. Other windows are untouched.

### Reopening a project

The extension remembers which account each repository used last and restores it
automatically. When a window picks its account up this way, rather than from its
own last choice, the hover card says it was auto-selected.

### One account, one entry

Saving the same email twice reuses the existing entry. Lists are collapsed by
email, so you always see one row per account.

### Forgetting an account

Hover the status bar item, choose *Forget…* and pick the account. After you
confirm, the extension removes the account from the list, **deletes its OAuth
token from every copy on this machine**, interrupts Claude sessions running on
it, and reloads any window that was using it. That window then offers to switch
to another saved account.

History, settings and the data folders stay on disk. Signing in again brings the
account back.

On macOS, if the Keychain doesn't answer for one of the copies (for example
because it's locked), *Forget* changes nothing and asks you to unlock it and
retry. It never reports a sign-out it couldn't complete.

### Signing out

Signing out (Claude Code's account menu, or `/logout`) revokes the token on
Anthropic's side, for every copy of it. If the window is still signed out when
it next starts, the extension removes the account from the list everywhere,
since switching to it could only fail. It waits for that restart because, while
the window runs, a logout looks the same as a sign-in still in progress.

## One conversation history

Claude Code has **one** history. It is stored per *data directory*, and vanilla
Claude Code only ever has one directory. This extension gives each window a
directory of its own, so it has to put the history back together. Otherwise,
installing it would make every conversation you ever had disappear from the
panel.

It does that with one store, `~/.claude-shared`, symlinked from every directory:

```text
~/.claude/projects                ──┐
~/.claude-work/projects           ──┼──▶  ~/.claude-shared/projects/<per-repo>/…
~/.claude-windows/a1b2…/projects  ──┘
```

- **What is shared:** conversations, session state, plans and todos.
  **Credentials and identity never are.** Those stay strictly per-account, which
  is the whole point of the extension.
- **Per repository:** transcripts stay keyed by workspace folder, exactly as
  Claude Code writes them, so nothing leaks between repositories.
- **Across accounts:** hit a usage limit, switch account, and carry on in the
  same conversation.

There is **nothing to configure**. This isn't a feature bolted onto Claude Code;
it's what keeps Claude Code's own behaviour intact. Up to v1.2.7 a
`sharedHistory` toggle existed. Turning it off isolated nothing meaningful,
since it copied the entire history into every directory, so it's gone.

**Uninstalling** moves the store back into the default `~/.claude`. See
[Uninstalling](#uninstalling).

## How it works

Claude Code resolves its data directory from the `CLAUDE_CONFIG_DIR` environment
variable. Every VS Code window runs its own extension-host process, so
`process.env` is per-window, and that is the isolation mechanism. Each
**account** is a store (`~/.claude-<name>`), and each **window** runs on a
private working copy of the account it picked:

```text
account stores                    per-window working copies
~/.claude-work      ──copy──▶    ~/.claude-windows/a1b2… ◀── window A (CLAUDE_CONFIG_DIR)
~/.claude-personal  ──copy──▶    ~/.claude-windows/c3d4… ◀── window B (CLAUDE_CONFIG_DIR)
```

The details below make it reliable. Each one is a bug found and fixed.

### Activation order

Claude Code reads `CLAUDE_CONFIG_DIR` the moment it activates and caches it, so
this extension must get there *first*. It uses the `*` activation event, which
VS Code's docs discourage because it loads the extension at every start-up. That
is a deliberate, load-bearing trade-off: with any lazier activation, the
variable would be set after Claude Code has already read it, and per-window
accounts simply wouldn't work.

The cost is kept small: a bundle of about 45 KB with zero dependencies. The step
that has to win the race only makes sure the window's working copy is in place
and sets the variable (on macOS that includes a Keychain lookup); everything
heavier runs after it. The same start-up read is why switching needs a window
reload.

### A working copy per window

A `/login` writes into the window's own directory, so it can only ever affect
that window. "Which window signed in?" is answered by construction, and no other
window's account can be overwritten. Copies of an OAuth token authenticate
independently, so the duplicates are safe.

### macOS: the token lives in the Keychain

On macOS, Claude Code doesn't write `.credentials.json`. It stores each data
directory's token as a login-Keychain item named after the directory:
`Claude Code-credentials` for the default `~/.claude`, and
`Claude Code-credentials-<first 8 hex chars of sha256(CLAUDE_CONFIG_DIR)>` for
any other directory. So every per-window working copy gets a Keychain item of
its own, and isolation works exactly as it does with files on Linux.

The extension reads and writes those items the way Claude Code does, through
`/usr/bin/security`. Values go in hex-encoded over stdin, so a token stays out
of process listings. Only a token too long for one `security -i` line (over
about 2 KB of JSON) goes through the command's arguments instead, exactly as
Claude Code handles it. Claude Code's plaintext fallback file is honoured when
reading.

A locked Keychain counts as "can't tell", never as "signed out", so no account
is ever dropped because the Keychain was unavailable. Sign-ins and sign-outs
inside a window are noticed by polling the Keychain database's modification time
and comparing an attributes-only fingerprint of the window's item. The secret is
never read for that.

### No competing source of truth

A machine-wide `CLAUDE_CONFIG_DIR` in `claudeCode.environmentVariables` or
`terminal.integrated.env` would force all windows onto one account. The
extension strips it and keeps isolation in `process.env` only.

### Terminals follow the window

Integrated terminals get the window's account through VS Code's
environment-variable API. External terminals (outside VS Code) keep using the
default `~/.claude`.

### Reload safety

Automatic reloads (after a forget or an in-window sign-in) go through a circuit
breaker. State is corrected *before* reloading, and there is at most one
automatic reload per minute. A misbehaving edge case degrades to a message with
a button, never a reload loop.

### Survives its own absence

The account you last used (in the focused window) is mirrored into Claude Code's
own default `~/.claude`. If the extension is ever gone (uninstalled, disabled,
or not yet activated), Claude Code is already signed in there and just works.
Nothing important waits on the uninstall script, which VS Code defers to its
next restart and may never run.

### Found where it runs

The extension is published as a single universal package, not per-platform. In
WSL and Remote-SSH it executes on the *remote*, but the VS Code *client* that
resolves the Marketplace is often a different OS. A per-platform build would be
invisible to that client, which would then report the extension as missing and
never update it. The platform requirement is enforced at runtime instead (the
inert mode on native Windows).

## Settings

**None.** The extension has no settings: it does one thing, and there is nothing
to tune. Accounts are managed entirely from the status bar.

## Privacy & your data

This extension is built to manage credentials, so it holds itself to a strict
policy. Each point can be checked in the [source][repo].

- **No telemetry, no analytics, no network code at all.** The source contains
  zero network calls and **zero runtime dependencies**: it is your files, the
  `vscode` API, and Node's standard library. Nothing is ever sent anywhere.
- **Everything stays on this machine.** Accounts, working copies and the history
  store live under `~/.claude*`, created with owner-only permissions
  (`600`/`700`). On macOS the tokens stay in your login Keychain, under the item
  names Claude Code itself uses. Credentials are only ever *copied between*
  Claude Code's own data directories (or their Keychain items) on this machine.
  They are never parsed, never displayed, never logged and never transmitted.
- **Conversations are moved, not parsed.** Shared history moves and relinks the
  files. Their contents are never parsed or shown; they are only read when two
  copies of a file meet, to drop exact duplicates.
- **Minimal footprint elsewhere.**
  - The workspace folder path is hashed to tell windows apart.
  - `claude auth status` is asked (locally, read-only) to confirm a directory is
    signed in.
  - The process list (`/proc` on Linux and WSL, `ps` on macOS) is scanned only
    during *Forget*, to stop `claude` processes running on the token being
    deleted.
- **Self-restricted in the VS Code manifest.** It is disabled in virtual
  workspaces. In Restricted Mode (untrusted folders) it never reads workspace
  content, only the folder's path, to tell windows apart
  ([`capabilities`](package.json)).
- **Inert on unsupported platforms.** On native Windows (or any other
  unsupported OS) it performs no operations at all: no file reads, no writes, no
  account changes. The uninstall hook is guarded the same way.
- **Uninstalling cleans up after itself.** The directories the extension created
  are deleted and stray OAuth tokens wiped, including their Keychain items on
  macOS. The tokens it leaves are Claude Code's own default login (`~/.claude`,
  or the `Claude Code-credentials` Keychain item on macOS), exactly where Claude
  Code keeps it with no extension installed, and the sign-ins of any
  `~/.claude-<name>` profiles you made yourself. See
  [Uninstalling](#uninstalling).

## Uninstalling

Removing the extension **leaves Claude Code signed in and working**. Once VS
Code runs the uninstall step, the machine is left as if the extension had never
been installed.

**You stay signed in the whole time, not just at the end.** While the extension
runs, it continuously keeps Claude Code's own default account (`~/.claude`)
pointed at whichever account you last used. That is the normal place Claude Code
keeps its login. So the instant the extension is gone (uninstalled, disabled, or
simply not activated yet), plain Claude Code is already signed in and working.

This does **not** depend on the uninstall step running. VS Code defers uninstall
scripts to its next restart (and may skip them), so nothing that matters is
trusted to one.

When the uninstall script *does* run, it tidies up:

- **Your history is consolidated.** The shared store is *moved* into
  `~/.claude`, which is instant whatever its size: a few hundred milliseconds
  even for gigabytes. Any history an account kept to itself is folded in. Plain
  Claude Code has one history, not one per account.
- **Every directory the extension created is deleted.** That means the account
  stores, the per-window working copies and the shared store, so no history is
  duplicated and no OAuth token is left in a folder only this extension ever
  used. On macOS the Keychain item of each of those directories is deleted too,
  so none is left orphaned.
- **Your data comes first.** If anything can't be moved in time, the script
  stops rather than risk it. It still wipes stray tokens, but keeps any
  directory whose history hasn't safely reached `~/.claude`. It runs on a strict
  deadline (VS Code kills uninstall scripts after five seconds), so it never
  reads a file it can only move.

What it leaves alone:

- **Directories the extension didn't create.** These are never deleted. That
  includes a `~/.claude-<name>` profile you made yourself that the extension
  found and added to its list: it keeps its settings and its sign-in, and only
  has its history links pointed at `~/.claude`.
- **Anything not in its manifest.** The script deletes only what a manifest of
  its own says it created.
- **Everything, when a newer copy is installed.** If a newer copy of the
  extension is already installed, the script does nothing at all.

Your other accounts stay signed out afterwards. Sign in to them the normal way.

## Limitations

- **Native Windows is not supported.** Credential storage there is untested, so
  the extension refuses to run rather than guess (see
  [Platform support](#platform-support)). Use a WSL window instead.
- **macOS: a locked Keychain pauses account bookkeeping.** If the Keychain can't
  be read (for example over SSH with the login Keychain locked), the extension
  leaves everything as it is and waits, rather than treating accounts as signed
  out. The same applies to Claude Code itself: in that situation it falls back
  to a plaintext `.credentials.json`, and the extension honours that file.
- **Loads at every VS Code start-up.** It uses the `*` activation event, which
  is required to win the activation race against Claude Code; see
  [Activation order](#activation-order). The extension is deliberately small,
  and the part that has to run first is kept to a minimum.
- **API-key users.** This is for OAuth (claude.ai) logins. With
  `ANTHROPIC_API_KEY` you don't need it: set the key per window yourself.
- **Switching reloads the window.** It is a consequence of Claude Code reading
  its account once at start-up, surfaced honestly rather than pretended around.
- **Uninstalling leaves you signed in to one account.** That is the last one
  you used. Vanilla Claude Code holds one account at a time, so you sign in to
  the others the normal way.
- **The same project in two windows shares one conversation list.** VS Code
  won't open the same folder twice, but a folder and a `.code-workspace`
  containing it are two windows on one project. Since history is one store (as
  it is in plain Claude Code), both see the same chats and could resume the same
  one under *different accounts*. The transcript is a tree of parent-linked
  entries, so this forks the conversation rather than corrupting it, but the two
  branches will bill two accounts. Don't drive one chat from two windows at
  once.

## Switching from the original extension

This is a fork of *Claude Parallel Accounts*
(`DercasDrol.claude-parallel-accounts`). Both use the same directories
(`~/.claude-windows`, `~/.claude-shared`, `~/.claude-<name>`), so **don't run
both at once**. They register the same commands, and the second one reports the
conflict.

To switch safely, **uninstall the original first, then fully quit VS Code** (on
macOS, Cmd+Q) and open it again. VS Code runs the original's uninstall step at
that next start. The step brings your conversation history back into
`~/.claude` and leaves Claude Code signed in as the account you used last. Then
install this one: it picks that account up automatically.
Sign in to your other accounts once more, and they're saved again.

On macOS the original has done nothing since its version 1.2.4, which made it
Linux-only, so there is nothing to clean up: just uninstall it.

Why not the other way around? The original's uninstall step only knows its own
name. If it runs while this extension is installed, it cleans up directories
this one is using. This extension's uninstall step recognises both, and does
nothing while the other is installed.

## For maintainers

### Development & releases

```bash
npm ci            # install
npm run watch     # dev build with watch
npm run compile   # typecheck + build
npm run package   # build .vsix
```

To try a local build, install the `.vsix` with
**Extensions → ⋯ → Install from VSIX…**
(or `code --install-extension claude-parallel-profiles-<version>.vsix`), then
reload the window.

- **CI** ([ci.yml](.github/workflows/ci.yml)): every push or pull request to
  `main` builds and uploads the `.vsix` artifact.
- **Release** ([release.yml](.github/workflows/release.yml)): pushing a `v*` tag
  builds, creates a GitHub Release with the `.vsix`, and publishes to the VS
  Code Marketplace (`VSCE_PAT` secret) and Open VSX (`OVSX_PAT` secret). Either
  publish step is skipped when its secret isn't set.
- **Website** ([pages.yml](.github/workflows/pages.yml)): the project site in
  [`website/`](website/README.md) is built and published to GitHub Pages on
  every push to `main` that touches it, `CHANGELOG.md` or `package.json`. Pull
  requests get the same checks and build without the deploy. Before the first
  run, set **Settings → Pages → Source** to **GitHub Actions**.

### Publishing as Rivant Media

The extension is published under the Marketplace publisher **`rivantmedia`**
(`publisher` in [package.json](package.json)), so its ID is
`rivantmedia.claude-parallel-profiles`.

1. **Publisher.** In the [Marketplace publisher portal][publisher-portal],
   signed in with the Rivant Media Microsoft account, create the publisher with
   the ID `rivantmedia` (display name *Rivant Media*). If the ID you get is
   different, change `publisher` in `package.json` to match. The ID is part of
   the extension's identity, so settle it before the first release.
2. **Token.** In the Azure DevOps organisation tied to that account, create a
   Personal Access Token with **Organization: All accessible organizations** and
   **Scopes: Marketplace → Manage**. Add it to this repository as the Actions
   secret `VSCE_PAT`.
3. **Open VSX (optional).** For VSCodium, Cursor and others, create a
   `rivantmedia` namespace at [open-vsx.org][open-vsx]
   (`npx ovsx create-namespace rivantmedia -p <token>`), and add the token as
   `OVSX_PAT`.
4. **Release.** Bump `version` in `package.json`, add a `CHANGELOG.md` entry,
   then tag and push. The workflow does the rest.

```bash
# release flow: make sure package.json version matches the tag, then
git tag v<version>
git push origin main --tags     # CI does the rest
```

To publish by hand instead, run `npx @vscode/vsce login rivantmedia`, then
`npx @vscode/vsce publish --allow-star-activation`. The `*` activation is
deliberate (see [Activation order](#activation-order)), and the flag keeps vsce
from stopping to ask about it.

## License

MIT License. See [LICENSE](LICENSE) for details.

[marketplace]: https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles
[rate]: https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles&ssr=false#review-details
[claude-code]: https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code
[repo]: https://github.com/rivantmedia/claude-parallel-profiles
[issues]: https://github.com/rivantmedia/claude-parallel-profiles/issues
[original]: https://github.com/DercasDrol/claude-parallel-profiles
[publisher-portal]: https://marketplace.visualstudio.com/manage
[open-vsx]: https://open-vsx.org
[switching]: #switching-from-the-original-extension
