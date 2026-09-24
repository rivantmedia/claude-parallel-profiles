/**
 * “Uninstalling”: you stay signed in the whole time, and what the uninstall
 * script does when it runs.
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
	readonly scriptTitle: string;
	readonly scriptLead: Rich;
	readonly steps: readonly Point[];
	readonly afterwards: Rich;
};

export const uninstall: Uninstall = {
	id: "uninstalling",
	eyebrow: { index: "07", label: "Uninstalling" },
	heading: {
		runs: [
			{ text: "Uninstall it.", weight: "heavy" },
			{ text: "Stay signed in.", weight: "light" }
		],
		plain: "Uninstall it. Stay signed in."
	},
	lead: "Removing the extension leaves the machine as if it had never been installed, and leaves Claude Code signed in and working.",
	principle: {
		title: "Signed in the whole time, not just at the end",
		body: [
			"While the extension runs, it keeps Claude Code’s own default account (`~/.claude`) pointed at the account you last used: the normal place Claude Code keeps its login. The moment the extension is gone (uninstalled, disabled, or simply not activated yet), plain Claude Code is already signed in and working.",
			"This doesn’t depend on the uninstall step running. VS Code defers uninstall scripts to its next restart and may skip them, so nothing that matters is trusted to one."
		]
	},
	scriptTitle: "When the uninstall script runs",
	scriptLead: "It tidies up.",
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
		},
		{
			title: "It deletes only what it created",
			body: "A manifest of its own records what it created, and nothing else is deleted. A `~/.claude-<name>` profile you made yourself, which the extension found and added to its list, keeps its settings and its sign-in; only its history links are pointed at `~/.claude`."
		},
		{
			title: "It steps aside for another copy",
			body: "If another copy is still installed (a newer version of this extension, or the original Claude Parallel Accounts), the script does nothing at all."
		}
	],
	afterwards:
		"Your other accounts stay signed out afterwards. Plain Claude Code holds one account at a time, so sign in to the others the normal way."
};
