/**
 * “How it works”: the `CLAUDE_CONFIG_DIR` mechanism, the stores-to-windows
 * diagram, and the eight details that make it reliable, each one a bug found
 * and fixed. Keep the technical precision: these are the claims a developer
 * will check against src/.
 */
import type { ContrastHeading, Detail, Eyebrow, Rich } from "./types";

export type HowDiagramRow = {
	/** The account this row stands for. */
	readonly account: string;
	readonly store: string;
	readonly copy: string;
	readonly window: string;
};

export type HowDiagram = {
	readonly columns: {
		readonly stores: string;
		readonly copies: string;
		readonly windows: string;
	};
	readonly rows: readonly HowDiagramRow[];
	/** Store → working copy. */
	readonly copyEdge: string;
	/** Window → working copy. */
	readonly envEdge: string;
	readonly alt: string;
	readonly ascii: string;
};

export type How = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	/** Two or three sentences on the mechanism. */
	readonly mechanism: readonly Rich[];
	readonly diagram: HowDiagram;
	readonly detailsTitle: string;
	readonly detailsLead: string;
	readonly details: readonly Detail[];
	/** Labels for the expandable list. */
	readonly expand: string;
	readonly collapse: string;
};

export const how: How = {
	id: "how-it-works",
	eyebrow: { index: "05", label: "How it works" },
	heading: {
		runs: [
			{ text: "A directory per window,", weight: "heavy" },
			{ text: "set before Claude Code looks.", weight: "light" }
		],
		plain: "A directory per window, set before Claude Code looks."
	},
	mechanism: [
		"Claude Code finds its data directory through the `CLAUDE_CONFIG_DIR` environment variable. Every VS Code window runs its own extension host process, so `process.env` is per window, and that is the isolation.",
		"Each account is a store (`~/.claude-<name>`). Each window runs on a private working copy of the account it picked."
	],
	diagram: {
		columns: {
			stores: "Account stores",
			copies: "Per-window working copies",
			windows: "Windows"
		},
		rows: [
			{
				account: "work",
				store: "~/.claude-work",
				copy: "~/.claude-windows/a1b2…",
				window: "Window A"
			},
			{
				account: "personal",
				store: "~/.claude-personal",
				copy: "~/.claude-windows/c3d4…",
				window: "Window B"
			}
		],
		copyEdge: "copy",
		envEdge: "CLAUDE_CONFIG_DIR",
		alt: "Two account stores, ~/.claude-work and ~/.claude-personal, are each copied into a per-window working copy under ~/.claude-windows. Window A points CLAUDE_CONFIG_DIR at the first copy, window B at the second.",
		ascii: [
			"account stores                    per-window working copies",
			"~/.claude-work      ──copy──▶    ~/.claude-windows/a1b2… ◀── window A (CLAUDE_CONFIG_DIR)",
			"~/.claude-personal  ──copy──▶    ~/.claude-windows/c3d4… ◀── window B (CLAUDE_CONFIG_DIR)"
		].join("\n")
	},
	detailsTitle: "The details that make it reliable",
	detailsLead: "Each one is a bug found and fixed.",
	details: [
		{
			title: "Activation order",
			summary:
				"Claude Code reads `CLAUDE_CONFIG_DIR` once, when it activates, so this extension has to get there first.",
			body: [
				"Claude Code reads `CLAUDE_CONFIG_DIR` the moment it activates and caches it. So this extension uses the `*` activation event, which VS Code’s docs discourage because it loads the extension at every start-up. It’s a deliberate trade-off: with any lazier activation the variable would be set after Claude Code had already read it, and per-window accounts wouldn’t work.",
				"The cost is kept small. The bundle is about 45 KB with zero runtime dependencies, and the step that has to win the race only makes sure the window’s working copy is in place and sets the variable (on macOS, that includes a Keychain lookup); everything heavier runs after it. The same start-up read is why switching needs a window reload."
			]
		},
		{
			title: "A working copy per window",
			summary:
				"A `/login` writes into the window’s own directory, so it can only ever affect that window.",
			body: [
				"Each window runs on a private copy (`~/.claude-windows/<id>`) of its account’s store. A `/login` writes into that directory, so “which window signed in?” is answered by construction, and no other window’s account can be overwritten.",
				"Copies of an OAuth token authenticate independently, so the duplicates are safe."
			]
		},
		{
			title: "macOS: the token lives in the Keychain",
			summary:
				"Claude Code keeps each directory’s token in a login-Keychain item named after the directory. The extension handles those items the way Claude Code does.",
			body: [
				"On macOS, Claude Code doesn’t write `.credentials.json`. It stores each data directory’s token as a login-Keychain item named after the directory: `Claude Code-credentials` for the default `~/.claude`, and `Claude Code-credentials-<first 8 hex chars of sha256(CLAUDE_CONFIG_DIR)>` for any other. So every per-window working copy gets a Keychain item of its own, and isolation works exactly as it does with files on Linux.",
				"The extension reads and writes those items the way Claude Code does, through `/usr/bin/security`. Values go in hex-encoded over stdin (`security -i`), so a token stays out of process listings; only a token too long for one line (over about 2 KB) goes through the arguments, as Claude Code itself does. Claude Code’s plaintext fallback file is honoured when reading.",
				"A locked Keychain counts as “can’t tell”, never as “signed out”, so no account is ever dropped because the Keychain was unavailable. After one such failure, background work leaves the Keychain alone for 60 seconds; anything you ask for yourself tries for real.",
				"Sign-ins and sign-outs inside a window are noticed by polling the keychain database’s modification time and comparing an attributes-only fingerprint of the window’s item. The secret is never read for that."
			]
		},
		{
			title: "No competing source of truth",
			summary:
				"A machine-wide `CLAUDE_CONFIG_DIR` in VS Code settings would force every window onto one account. The extension strips it.",
			body: [
				"A `CLAUDE_CONFIG_DIR` set in `claudeCode.environmentVariables` or `terminal.integrated.env` applies to every window, which would force them all onto one account. The extension removes it from those settings and keeps isolation in `process.env` only."
			]
		},
		{
			title: "Terminals follow the window",
			summary:
				"Integrated terminals get the window’s account. External terminals keep the default `~/.claude`.",
			body: [
				"Integrated terminals get the window’s account through VS Code’s environment-variable API, so a `claude` started there runs as the same account as the panel. Terminals outside VS Code keep using the default `~/.claude`."
			]
		},
		{
			title: "Reload safety",
			summary:
				"Automatic reloads go through a circuit breaker: at most one per minute, never a loop.",
			body: [
				"Automatic reloads, after a forget or an in-window sign-in, go through a circuit breaker. The state that triggered the reload is corrected before reloading, and there is at most one automatic reload per minute.",
				"A misbehaving edge case degrades to a message with a Reload window button, never a reload loop."
			]
		},
		{
			title: "Survives its own absence",
			summary:
				"Claude Code’s default `~/.claude` is kept signed in as your last account, so it works the moment the extension is gone.",
			body: [
				"The account you last used, in the focused window, is mirrored into Claude Code’s own default `~/.claude`. If the extension is ever gone (uninstalled, disabled, or not yet activated), Claude Code is already signed in there and just works.",
				"Nothing important waits on the uninstall script, which VS Code defers to its next restart and may never run."
			]
		},
		{
			title: "Found where it runs",
			summary:
				"One universal package, with the platform check at runtime, so a VS Code client on another OS still finds and updates it.",
			body: [
				"The extension is published as a single universal package, not one per platform. In WSL and Remote-SSH it runs on the remote, but the VS Code client that talks to the Marketplace is often a different OS. A per-platform build would be invisible to that client, which would report the extension as missing and never update it.",
				"The platform requirement is enforced at runtime instead: the inert mode on native Windows."
			]
		}
	],
	expand: "Read more",
	collapse: "Show less"
};
