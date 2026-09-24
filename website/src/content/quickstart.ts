/**
 * Quick start: the four steps from install to two windows on two accounts,
 * then the day-to-day behaviour of the status bar item.
 */
import { installCommand, links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Point, Rich } from "./types";

export type QuickStartStep = Point & {
	/** Optional command shown under the body, with a copy button. */
	readonly command?: string;
	/** Optional aside under the step. */
	readonly note?: {
		readonly text: Rich;
		readonly link: LinkRef;
	};
};

export type QuickStart = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
	readonly steps: readonly QuickStartStep[];
	readonly daily: {
		readonly title: string;
		readonly items: readonly Point[];
	};
};

export const quickstart: QuickStart = {
	id: "quick-start",
	eyebrow: { index: "03", label: "Quick start" },
	heading: {
		runs: [
			{ text: "Four steps.", weight: "heavy" },
			{ text: "Most are already done.", weight: "light" }
		],
		plain: "Four steps. Most are already done."
	},
	lead: "There are no settings. Accounts are managed entirely from the status bar.",
	steps: [
		{
			title: "Install",
			body: "From the VS Code Marketplace (search “Claude Parallel Profiles”), or from a terminal. Install it where Claude Code runs: in a WSL or SSH window, that’s the remote side.",
			command: installCommand,
			note: {
				text: "Coming from the original Claude Parallel Accounts? Uninstall it first.",
				link: {
					label: "Switching from the original extension",
					href: "#switching",
					external: false
				}
			}
		},
		{
			title: "You’re probably already signed in",
			body: "The status bar shows your email, and the account is saved automatically."
		},
		{
			title: "Add the second account",
			body: "In Claude Code, sign in as the other account: its account menu, or `/login` in the chat. The extension saves it and reloads the window onto it. The previous account stays in the list."
		},
		{
			title: "Give each window its account",
			body: "Click the status bar and pick an account. Open another window for another project and give it the other account. Both run in parallel."
		}
	],
	daily: {
		title: "Day to day",
		items: [
			{
				title: "The status bar item",
				body: "It shows the account this window runs as, confirmed against the real token (`claude auth status`), not just a label. A click does the one action that makes sense right now: switch when there are other accounts, pick a saved account when the window is signed out, save when the account is new. Hover it for the full card, with account details, switch and forget, and links to the extension page and its log."
			},
			{
				title: "Signing in inside a window",
				body: "Signing in as another account in a window (Claude Code’s account menu, or `/login`) replaces only that window’s account. The extension saves the new account, keeps the old one in the list and reloads the window, so Claude Code really switches to it. Other windows are untouched."
			},
			{
				title: "Reopening a project",
				body: "The extension remembers which account each repository used last and restores it automatically. The hover card says so."
			},
			{
				title: "One account, one entry",
				body: "Saving the same email twice reuses the existing entry. Lists are collapsed by email, so you always see one row per account."
			},
			{
				title: "Forgetting an account",
				body: "Hover the status bar and choose Forget… After you confirm, the account leaves the list, its OAuth token is deleted from every copy on this machine, Claude sessions running on it are interrupted, and any window using it reloads and offers another saved account. History, settings and the data folders stay on disk; signing in again brings the account back. On macOS, if the Keychain doesn’t answer for one of the copies (it’s locked, say), Forget changes nothing and asks you to unlock it and retry. A `claude` process whose environment can’t be read there is left running and reported, never guessed at."
			},
			{
				title: "Signing out",
				body: "Signing out in Claude Code (its account menu, or `/logout`) revokes the token on Anthropic’s side, for every copy of it. When that window next starts, the extension sees the logout and removes the account from the list everywhere, since switching to it could only fail."
			}
		]
	}
};
