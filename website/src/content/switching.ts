/**
 * “Switching from the original extension”: the safe order, the macOS note,
 * why not the other way round, and the credit to the original’s author.
 */
import { links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Point, Rich } from "./types";

export type Switching = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
	/** Names the ordered steps for screen readers. */
	readonly stepsLabel: string;
	/**
	 * In order. A step’s body may name a shortcut written exactly as in
	 * `shortcut`, which the page sets as keycaps.
	 */
	readonly steps: readonly Point[];
	readonly shortcut: string;
	readonly macos: Point;
	readonly why: Point;
	/** A quiet sign-off: the sentence, then the author’s name as a signature. */
	readonly credit: {
		readonly text: Rich;
		readonly name: string;
		readonly role: string;
		readonly link: LinkRef;
	};
};

export const switching: Switching = {
	id: "switching",
	eyebrow: { index: "09", label: "Switching from the original" },
	heading: {
		runs: [
			{ text: "Coming from Claude Parallel Accounts?", weight: "heavy" },
			{ text: "Uninstall it first.", weight: "light" }
		],
		plain: "Coming from Claude Parallel Accounts? Uninstall it first."
	},
	lead: "This is a fork of Claude Parallel Accounts (`DercasDrol.claude-parallel-accounts`). Both use the same directories (`~/.claude-windows`, `~/.claude-shared`, `~/.claude-<name>`), so don’t run both at once: they register the same commands, and the second one reports the conflict.",
	stepsLabel: "The safe order",
	steps: [
		{
			title: "Uninstall the original",
			body: "Remove Claude Parallel Accounts from VS Code’s Extensions view."
		},
		{
			title: "Fully quit VS Code, then open it again",
			body: "Quit it, don’t just close the window (on macOS, Cmd+Q). VS Code runs the original’s uninstall step at its next start: it brings your conversation history back into `~/.claude` and leaves Claude Code signed in as the account you used last."
		},
		{
			title: "Install this one",
			body: "It picks that account up automatically."
		},
		{
			title: "Sign in to your other accounts once more",
			body: "Each one is saved again as you sign in."
		}
	],
	shortcut: "Cmd+Q",
	macos: {
		title: "On macOS",
		body: "From version 1.2.4 the original stayed inert on macOS, so if that’s all you had there, there is nothing to clean up: just uninstall it. Earlier versions may have moved your history into `~/.claude-shared`; installing this one keeps it linked."
	},
	why: {
		title: "Why not the other way round?",
		body: "The original’s uninstall step only knows its own name. If it runs while this extension is installed, it cleans up directories this one is using. This extension’s uninstall step recognises both, and does nothing while the other is installed."
	},
	credit: {
		text: "Claude Parallel Profiles is a fork of DercasDrol’s Claude Parallel Accounts, with macOS support added. All credit for the original design goes to its author.",
		name: "DercasDrol",
		role: "Original author",
		link: {
			label: "DercasDrol/claude-parallel-profiles on GitHub",
			href: links.original,
			external: true
		}
	}
};
