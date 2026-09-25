/**
 * “Uninstalling”: you stay signed in the whole time, what the uninstall script
 * does when it runs, and what it leaves alone.
 */
import type { ContrastHeading, Eyebrow, Point, Rich } from "./types";

export type Uninstall = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
	/** The principle: signed in before, during and after. */
	readonly principle: {
		readonly title: string;
		readonly body: readonly Rich[];
	};
	/** What the uninstall script does, in order. */
	readonly script: {
		readonly title: string;
		readonly lead: Rich;
		readonly steps: readonly Point[];
	};
	/** What the script never touches. */
	readonly leavesAlone: {
		readonly title: string;
		readonly items: readonly Point[];
	};
	readonly afterwards: {
		readonly label: string;
		readonly body: Rich;
	};
};

export const uninstall: Uninstall = {
	id: "uninstalling",
	eyebrow: { index: "07", label: "Uninstalling" },
	heading: {
		runs: [
			{ text: "Remove it.", weight: "heavy" },
			{ text: "Claude\u00a0Code stays signed in.", weight: "light" }
		],
		plain: "Remove it. Claude Code stays signed in."
	},
	lead: "Claude Code stays signed in and working the moment the extension is gone. Once VS Code runs the uninstall step, the machine is left as if the extension had never been installed.",
	principle: {
		title: "Signed in the whole time, not just at the end",
		body: [
			"While the extension runs, it keeps Claude Code’s own default account (`~/.claude`) pointed at the account you last used: the normal place Claude Code keeps its login. The moment the extension is gone (uninstalled, disabled, or simply not activated yet), plain Claude Code is already signed in and working.",
			"This doesn’t depend on the uninstall step running. VS Code defers uninstall scripts to its next restart and may skip them, so nothing that matters is trusted to one."
		]
	},
	script: {
		title: "When the uninstall script runs",
		lead: "It tidies up.",
		steps: [
			{
				title: "Your history is consolidated",
				body: "The shared store is moved into `~/.claude`, which is instant whatever its size: a few hundred milliseconds even for gigabytes. Any history an account kept to itself is folded in. Plain Claude Code has one history, not one per account."
			},
			{
				title: "Every directory it created is deleted",
				body: "The account stores, the per-window working copies and the shared store. No duplicated history, and no OAuth token left in a folder only this extension used. On macOS the Keychain item of each of those directories is deleted too, so none is left orphaned."
			},
			{
				title: "It stops rather than risk your data",
				body: "VS Code kills uninstall scripts after five seconds, so the script never reads a file it can only move. If anything can’t be moved in time, it still wipes stray tokens but keeps any directory whose history hasn’t safely reached `~/.claude`."
			}
		]
	},
	leavesAlone: {
		title: "What it leaves alone",
		items: [
			{
				title: "Directories it didn’t create",
				body: "These are never deleted. A `~/.claude-<name>` profile you made yourself, which the extension found and added to its list, keeps its settings and its sign-in; only its history links are pointed at `~/.claude`."
			},
			{
				title: "Anything not in its manifest",
				body: "A manifest of its own records what it created, and nothing else is deleted."
			},
			{
				title: "Everything, while another copy is installed",
				body: "If another copy is still installed (a newer version of this extension, or the original Claude Parallel Accounts), the script does nothing at all."
			}
		]
	},
	afterwards: {
		label: "Afterwards",
		body: "Your other accounts stay signed out. Plain Claude Code holds one account at a time, so sign in to the others the normal way."
	}
};
