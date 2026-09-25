/**
 * “Privacy and your data”: one short statement, pinned and set huge while it
 * is read, then the policy points. Each point can be checked in the source.
 */
import { links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Point, Rich } from "./types";

export type Privacy = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	/**
	 * The pinned line, set one word per line and brightening word by word as
	 * it is read. Every word takes its run’s weight. Keep it short (four to six
	 * words) and literally true: the statement is the claim the source proves.
	 */
	readonly statement: ContrastHeading;
	/** A faint background word behind the statement. Decorative. */
	readonly ghost: string;
	/** The small sign-off under the statement. */
	readonly signature: {
		readonly name: string;
		readonly line: string;
	};
	readonly lead: Rich;
	readonly points: readonly Point[];
	readonly source: LinkRef;
};

export const privacy: Privacy = {
	id: "privacy",
	eyebrow: { index: "06", label: "Privacy and your data" },
	statement: {
		runs: [
			{ text: "No network code", weight: "heavy" },
			{ text: "at all.", weight: "light" }
		],
		plain: "No network code at all."
	},
	ghost: "local",
	signature: {
		name: "Claude Parallel Profiles",
		line: "Zero runtime dependencies"
	},
	lead: "It handles your credentials, so it holds itself to a strict policy. Each point below can be checked in the source.",
	points: [
		{
			title: "No telemetry, no analytics, no network code",
			body: "The source contains zero network calls. Nothing is ever sent anywhere."
		},
		{
			title: "Zero runtime dependencies",
			body: "It is your files, the `vscode` API and Node’s standard library. No third-party code ships in the bundle."
		},
		{
			title: "Everything stays on this machine",
			body: "Accounts, working copies and the history store live under `~/.claude*`, created with owner-only permissions (`600` and `700`). On macOS the tokens stay in your login Keychain, under the item names Claude Code itself uses. Credentials are only ever copied between Claude Code’s own data directories, or their Keychain items, on this machine. They are never parsed, displayed, logged or transmitted."
		},
		{
			title: "Conversations are moved, not parsed",
			body: "Shared history moves and relinks the files. Their contents are never parsed or shown; the only time they are read is when two copies are merged, to drop exact duplicates."
		},
		{
			title: "A minimal footprint elsewhere",
			body: "The workspace folder path is hashed to tell windows apart. `claude auth status` is asked, locally and read-only, whether a directory is signed in. The process list (`/proc` on Linux and WSL, `ps` on macOS) is scanned only during Forget, to stop `claude` processes running on the token being deleted."
		},
		{
			title: "Self-restricted in the VS Code manifest",
			body: "Disabled in virtual workspaces. In Restricted Mode (untrusted folders) it never reads your files. From the folder it uses only its path, to tell windows apart, and its VS Code settings, where it removes any `CLAUDE_CONFIG_DIR` override that would pin every window to one account."
		},
		{
			title: "Inert on unsupported platforms",
			body: "On native Windows, or any other unsupported OS, it performs no operations at all: no file reads, no writes, no account changes. The uninstall hook is guarded the same way."
		},
		{
			title: "Uninstalling cleans up after itself",
			body: "The directories the extension created are deleted and stray OAuth tokens wiped, including their Keychain items on macOS. The only tokens it leaves are Claude Code’s own default login (`~/.claude`, or the `Claude Code-credentials` Keychain item on macOS), exactly where Claude Code keeps it with no extension installed, and the sign-ins of profiles you made yourself."
		}
	],
	source: {
		label: "Check it in the source",
		href: links.github,
		external: true
	}
};
