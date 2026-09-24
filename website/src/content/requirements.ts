/**
 * Requirements, platform support and limitations. The platform rows follow
 * the runtime check in src/extension.ts: Linux and macOS (`darwin`) run,
 * everything else is inert.
 */
import { links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Point, Rich } from "./types";

export type RequirementRow = {
	readonly requirement: Rich;
	readonly notes: Rich;
	readonly link?: LinkRef;
};

export type PlatformRow = {
	readonly platform: string;
	readonly status: "supported" | "inert";
	/** The word shown in the status column. */
	readonly statusLabel: string;
	readonly note: Rich;
};

export type Requirements = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
	readonly table: {
		readonly columns: readonly [string, string];
		readonly rows: readonly RequirementRow[];
	};
	readonly platforms: {
		readonly title: string;
		readonly columns: readonly [string, string, string];
		readonly rows: readonly PlatformRow[];
		/** Where the check happens. */
		readonly note: Rich;
	};
	readonly limitations: {
		readonly title: string;
		readonly items: readonly Point[];
	};
};

export const requirements: Requirements = {
	id: "requirements",
	eyebrow: { index: "08", label: "Requirements" },
	heading: {
		runs: [
			{ text: "Linux and macOS,", weight: "heavy" },
			{ text: "locally or remote.", weight: "light" }
		],
		plain: "Linux and macOS, locally or remote."
	},
	lead: "It runs wherever Claude Code runs on Linux or macOS: on the desktop, in WSL, over Remote-SSH and in dev containers.",
	table: {
		columns: ["Requirement", "Notes"],
		rows: [
			{
				requirement: "Linux or macOS",
				notes: "Desktop Linux or macOS, WSL, Remote-SSH (Linux or macOS host), or a dev container."
			},
			{
				requirement: "VS Code 1.85 or later",
				notes: "The extension installs where Claude Code runs. On WSL or SSH, that’s the remote side."
			},
			{
				requirement: "The Claude Code extension",
				notes: "The official extension. This one only controls which account each window uses.",
				link: {
					label: "Claude Code on the Marketplace",
					href: links.claudeCode,
					external: true
				}
			},
			{
				requirement: "The `claude` CLI",
				notes: "Asked, read-only, whether a directory is signed in. Found on `$PATH` or, failing that, bundled with the Claude Code extension. On macOS the bundled one is tried first."
			}
		]
	},
	platforms: {
		title: "Platform support",
		columns: ["Platform", "Status", "Notes"],
		rows: [
			{
				platform: "Desktop Linux",
				status: "supported",
				statusLabel: "Supported",
				note: "Tokens in `.credentials.json`, where Claude Code keeps them on Linux."
			},
			{
				platform: "macOS",
				status: "supported",
				statusLabel: "Supported",
				note: "Tokens in the login Keychain, under the item names Claude Code uses."
			},
			{
				platform: "WSL",
				status: "supported",
				statusLabel: "Supported",
				note: "Runs on the Linux side, so a Windows desktop works through a WSL window."
			},
			{
				platform: "Remote-SSH to Linux or macOS",
				status: "supported",
				statusLabel: "Supported",
				note: "Runs on the remote host."
			},
			{
				platform: "Dev containers",
				status: "supported",
				statusLabel: "Supported",
				note: "Runs inside the container."
			},
			{
				platform: "Native Windows",
				status: "inert",
				statusLabel: "Inert",
				note: "No files read or written, no accounts touched, and the status bar says why. Claude Code stores credentials differently there, and guessing would be worse than declining. Open the folder in a WSL window instead."
			}
		],
		note: "The check happens where the extension actually runs. In a WSL or SSH window that’s the remote side, so a Windows desktop driving a Linux remote works fully."
	},
	limitations: {
		title: "Limitations",
		items: [
			{
				title: "Native Windows is not supported",
				body: "Credential storage there is untested, so the extension refuses to run rather than guess. Use a WSL window instead."
			},
			{
				title: "macOS: a locked Keychain pauses account bookkeeping",
				body: "If the Keychain can’t be read (for example over SSH with the login Keychain locked), the extension leaves everything as it is and waits, rather than treating accounts as signed out. Claude Code falls back to a plaintext `.credentials.json` in that situation, and the extension honours that file."
			},
			{
				title: "Loads at every VS Code start-up",
				body: "The `*` activation event is required to win the activation race against Claude Code. The extension is deliberately small (about 45 KB, no runtime dependencies), and the part that has to run first is kept to a few checks."
			},
			{
				title: "For OAuth logins, not API keys",
				body: "This is for claude.ai logins. With `ANTHROPIC_API_KEY` you don’t need it: set the key per window yourself."
			},
			{
				title: "Switching reloads the window",
				body: "Claude Code reads its account once, at start-up, so a reload is the only way to make it really switch. The extension says so rather than hiding it."
			},
			{
				title: "Uninstalling leaves you signed in to one account",
				body: "The last one you used. Plain Claude Code holds one account at a time; sign in to the others the normal way."
			},
			{
				title: "The same project in two windows shares one conversation list",
				body: "VS Code won’t open the same folder twice, but a folder and a `.code-workspace` containing it are two windows on one project. Both see the same chats and could resume the same one under different accounts. The transcript is a tree of parent-linked entries, so this forks the conversation rather than corrupting it, but the two branches bill two accounts. Don’t drive one chat from two windows at once."
			}
		]
	}
};
