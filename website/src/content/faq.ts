/**
 * Questions and answers. Every answer restates a fact from the README; add a
 * question only when its answer is already written down there.
 */
import type { ContrastHeading, Eyebrow, Rich } from "./types";

export type FaqItem = {
	readonly question: string;
	readonly answer: Rich;
};

export type Faq = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly items: readonly FaqItem[];
};

export const faq: Faq = {
	id: "faq",
	eyebrow: { index: "10", label: "Questions" },
	heading: {
		runs: [
			{ text: "Questions,", weight: "heavy" },
			{ text: "answered plainly.", weight: "light" }
		],
		plain: "Questions, answered plainly."
	},
	items: [
		{
			question: "Does it replace the Claude Code extension?",
			answer: "No. It’s a companion: the official Claude Code extension must be installed, and this one only controls which account each window uses."
		},
		{
			question: "Does it work with API keys?",
			answer: "It’s for OAuth (claude.ai) logins. With `ANTHROPIC_API_KEY` you don’t need it: set the key per window yourself."
		},
		{
			question: "Why does switching reload the window?",
			answer: "Claude Code reads its account once, at start-up. Only a reload makes it both show and bill the account you picked."
		},
		{
			question: "Will I lose my conversations?",
			answer: "No. History stays in one store, `~/.claude-shared`, linked from every data directory, so it’s the single history Claude Code always had. Uninstalling moves it back into `~/.claude`."
		},
		{
			question: "Does it send anything anywhere?",
			answer: "No. The source contains no telemetry, no analytics and no network calls, and it has zero runtime dependencies. Credentials are never parsed, displayed, logged or transmitted."
		},
		{
			question: "Are there any settings?",
			answer: "None. It does one thing and there is nothing to tune. Accounts are managed entirely from the status bar."
		},
		{
			question: "Does it remember which account a project used?",
			answer: "Yes. It remembers which account each repository used last and restores it automatically when you reopen the project."
		},
		{
			question:
				"What happens if I sign in as someone else inside a window?",
			answer: "Only that window’s account changes. The extension saves the new account, keeps the old one in the list and reloads the window, so Claude Code really switches. Other windows are untouched."
		},
		{
			question: "Why does it load at every VS Code start-up?",
			answer: "Claude Code reads `CLAUDE_CONFIG_DIR` the moment it activates, so this extension has to set it first. That takes the `*` activation event. The step that has to come first only makes sure the window’s working copy is in place and sets the variable; everything heavier runs after it."
		},
		{
			question: "Does it work on Windows?",
			answer: "Not natively: there it stays inert and touches nothing. Open your folder in a WSL window and install it there, or use Remote-SSH to a Linux or macOS host."
		},
		{
			question:
				"Can I run it alongside the original Claude Parallel Accounts?",
			answer: "No. Both use the same directories and register the same commands. Uninstall the original first, fully quit and reopen VS Code, then install this one."
		}
	]
};
