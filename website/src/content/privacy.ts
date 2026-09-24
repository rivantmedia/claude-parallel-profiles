/**
 * “Privacy and your data”: a short, calm statement for the scrubbed big-type
 * heading, then the policy points. Each point can be checked in the source.
 */
import { links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Point, Rich } from "./types";

export type Privacy = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	/** Brightens word by word as it is read. */
	readonly statement: ContrastHeading;
	readonly lead: Rich;
	readonly points: readonly Point[];
	readonly source: LinkRef;
};

export const privacy: Privacy = {
	id: "privacy",
	eyebrow: { index: "06", label: "Privacy and your data" },
	statement: {
		runs: [
			{ text: "It handles your credentials,", weight: "heavy" },
			{ text: "so it holds itself to a strict policy.", weight: "light" }
		],
		plain: "It handles your credentials, so it holds itself to a strict policy."
	},
	lead: "No telemetry, no network code, nothing sent anywhere. Each point below can be checked in the source.",
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
			body: "Disabled in virtual workspaces. In Restricted Mode (untrusted folders) it never reads workspace content, only the folder’s path, to tell windows apart."
		},
		{
			title: "Inert on unsupported platforms",
			body: "On native Windows, or any other unsupported OS, it performs no operations at all: no file reads, no writes, no account changes. The uninstall hook is guarded the same way."
		},
		{
			title: "Uninstalling cleans up after itself",
			body: "The directories the extension created are deleted and stray OAuth tokens wiped, including their Keychain items on macOS. The one token it leaves is Claude Code’s own default login (`~/.claude`, or the `Claude Code-credentials` Keychain item on macOS), exactly where Claude Code keeps it with no extension installed."
		}
	],
	source: {
		label: "Read the source",
		href: links.github,
		external: true
	}
};
