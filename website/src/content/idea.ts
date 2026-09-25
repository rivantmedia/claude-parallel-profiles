/**
 * “The idea in 30 seconds”: the problem in one heading, the answer in a
 * second, and the six points that make it work.
 */
import { links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Point, Rich } from "./types";

export type Idea = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	/** The problem, as a scrubbed statement. */
	readonly problem: ContrastHeading;
	readonly lead: Rich;
	/** The answer, set smaller under the lead. */
	readonly answer: ContrastHeading;
	readonly pointsTitle: string;
	readonly points: readonly Point[];
	/** It works with Claude Code, not instead of it. */
	readonly companion: {
		/** The one-line point, set a shade brighter than the rest. */
		readonly lead: string;
		readonly text: Rich;
		readonly link: LinkRef;
	};
};

export const idea: Idea = {
	id: "idea",
	eyebrow: { index: "01", label: "The idea" },
	problem: {
		runs: [
			{ text: "One account,", weight: "heavy" },
			{ text: "shared by every window.", weight: "light" }
		],
		plain: "One account, shared by every window."
	},
	lead: "Claude Code signs you into one account, and every VS Code window uses it. If you juggle several (personal, work, a second Pro for when the first hits its limits), switching means a logout and a login, and all your windows share whichever account you end up on.",
	answer: {
		runs: [
			{ text: "Each window,", weight: "heavy" },
			{ text: "its own account.", weight: "light" }
		],
		plain: "Each window, its own account."
	},
	pointsTitle: "The idea in 30 seconds",
	points: [
		{
			title: "Sign in as usual",
			body: "Use Claude Code’s own account menu, or `/login` in the chat. The extension notices and saves the account by itself. There is nothing to name: the account is its email."
		},
		{
			title: "Each window picks its account",
			body: "Choose it from the status bar. Two windows run two accounts at the same time, with no logout and login in between, and each window’s integrated terminals get the same account."
		},
		{
			title: "Switching reloads the window",
			body: "Claude Code reads its account once, at start-up. Only a reload makes it both show and bill the account you picked."
		},
		{
			title: "History stays whole",
			body: "Your conversations stay in one store: the single history Claude Code always had. Hit a usage limit, switch account and continue the same conversation."
		},
		{
			title: "Forget really signs out",
			body: "Forgetting an account deletes its OAuth token from every copy on this machine and stops the Claude sessions it finds running on it. The data directories stay, so signing in again restores everything."
		},
		{
			title: "Uninstalling cleans up",
			body: "Claude Code stays signed in as your last account throughout. When VS Code runs the uninstall step, at its next start, your history moves back into the default `~/.claude` and the folders the extension made are deleted."
		}
	],
	companion: {
		lead: "It’s a companion, not a replacement.",
		text: "The official Claude Code extension must be installed; this one only controls which account each window uses.",
		link: {
			label: "Claude Code on the Marketplace",
			href: links.claudeCode,
			external: true
		}
	}
};
