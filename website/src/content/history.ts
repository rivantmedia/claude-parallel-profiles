/**
 * “One conversation history”: why the extension keeps one store, what lives
 * in it (and what never does), and the directory diagram. Exported as
 * `conversationHistory`, so it never shadows the browser’s `history`.
 */
import type { ContrastHeading, Eyebrow, Point, Rich } from "./types";

export type HistoryDiagram = {
	/** The data directories whose `projects` folder is a link. */
	readonly sources: readonly {
		readonly path: string;
		readonly note: string;
	}[];
	/** The label on the arrows. */
	readonly edge: string;
	readonly target: {
		readonly path: string;
		readonly note: string;
	};
	/** A text equivalent of the whole diagram, for screen readers. */
	readonly alt: string;
	/** The same diagram in plain text, as the README draws it. */
	readonly ascii: string;
};

type ConversationHistory = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
	readonly diagram: HistoryDiagram;
	readonly points: readonly Point[];
	readonly config: {
		readonly title: string;
		readonly body: Rich;
		/** The old toggle, set smaller as a footnote. */
		readonly past: Rich;
	};
	readonly uninstall: Rich;
};

export const conversationHistory: ConversationHistory = {
	id: "history",
	eyebrow: { index: "04", label: "One conversation history" },
	heading: {
		runs: [
			{ text: "Switch accounts.", weight: "heavy" },
			{ text: "Keep the conversation.", weight: "light" }
		],
		plain: "Switch accounts. Keep the conversation."
	},
	lead: "Claude Code stores history per data directory, and plain Claude Code only ever has one. This extension gives each window a directory of its own, so it puts the history back together. Otherwise, installing it would make every conversation you ever had disappear from the panel.",
	diagram: {
		sources: [
			{ path: "~/.claude/projects", note: "Claude Code’s default" },
			{ path: "~/.claude-work/projects", note: "an account store" },
			{
				path: "~/.claude-windows/a1b2…/projects",
				note: "a window’s working copy"
			}
		],
		edge: "symlink",
		target: {
			path: "~/.claude-shared/projects/<per-repo>/…",
			note: "one store, a folder per repository"
		},
		alt: "Three data directories, Claude Code’s default ~/.claude, an account store and a window’s working copy, each links its projects folder to the same place: ~/.claude-shared/projects, which holds a folder per repository.",
		ascii: [
			"~/.claude/projects                ──┐",
			"~/.claude-work/projects           ──┼──▶  ~/.claude-shared/projects/<per-repo>/…",
			"~/.claude-windows/a1b2…/projects  ──┘"
		].join("\n")
	},
	points: [
		{
			title: "What lives there",
			body: "Conversations, session state, plans and todos, in one store, `~/.claude-shared`, linked from every directory."
		},
		{
			title: "What never does",
			body: "Credentials and identity. Those stay strictly per account, which is the whole point of the extension."
		},
		{
			title: "Kept per project",
			body: "Transcripts stay keyed by workspace folder, exactly as Claude Code writes them, so nothing leaks between repositories."
		},
		{
			title: "Switch and continue",
			body: "Hit a usage limit, switch account, and carry on in the same conversation."
		}
	],
	config: {
		title: "Nothing to configure",
		body: "This isn’t a feature added to Claude Code. It’s what keeps Claude Code’s own behaviour intact.",
		past: "Up to v1.2.7 a `sharedHistory` toggle existed. Turning it off isolated nothing meaningful: it copied the entire history into every directory. It’s gone."
	},
	uninstall: "Uninstalling moves the store back into the default `~/.claude`."
};
