/**
 * Copy for the interactive mock: two VS Code windows, each on a different
 * account. It is an illustration, not a screenshot, and the page says so.
 * The status bar, hover card and quick pick strings are the extension’s real
 * ones, verbatim, straight apostrophes included (src/statusBar.ts,
 * src/setupWizard.ts, package.json). `$(name)` is VS Code’s codicon syntax,
 * which the mock draws as the matching icon. The projects, files, code,
 * chat exchanges and email addresses are made-up examples: they only give
 * each window something to show, and say nothing about the extension.
 */
import type { ContrastHeading, Eyebrow, Rich } from "./types";

/** One row of a window’s file explorer. */
type DemoFile = {
	readonly name: string;
	/** Nesting level, 0 at the project root. */
	readonly depth: number;
	readonly kind: "folder" | "file";
	/** The file open in the editor. */
	readonly active?: boolean;
};

/** One turn of the example exchange in a window’s Claude Code panel. */
type DemoMessage = {
	readonly from: "you" | "claude";
	readonly text: Rich;
};

export type DemoWindow = {
	readonly key: "a" | "b";
	/** How captions refer to it. */
	readonly label: string;
	/** The folder open in it, shown in the title bar. */
	readonly project: string;
	/** The account it starts on. */
	readonly account: string;
	/** The file open in the editor, and its language as the status bar names it. */
	readonly file: string;
	readonly language: string;
	readonly branch: string;
	/** Where the cursor sits, for the status bar. */
	readonly cursor: string;
	readonly tree: readonly DemoFile[];
	/** The editor’s lines, drawn in greys by a tiny highlighter. */
	readonly code: readonly string[];
	/** The conversation in its Claude Code panel. After a switch it is still in the shared history. */
	readonly chat: readonly DemoMessage[];
	/** What a screen reader hears about the window as a whole. */
	readonly summary: string;
};

type DemoStep = {
	readonly title: string;
	readonly caption: Rich;
};

export type Demo = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
	/** The label on the mock, and the note under it. */
	readonly illustration: {
		readonly label: string;
		readonly note: string;
	};
	readonly windows: readonly [DemoWindow, DemoWindow];
	/** The saved accounts, in list order. */
	readonly accounts: readonly string[];
	/** The Claude Code panel in the mock: its title only, nothing invented. */
	readonly panel: {
		readonly title: string;
	};
	readonly statusBar: {
		/** The real format; `<email>` is replaced. */
		readonly format: string;
		/** Appended when the account isn’t saved yet. */
		readonly unsavedSuffix: string;
		readonly signedOut: string;
		/** While the first confirmation runs. */
		readonly confirming: string;
		/** Accessible name of the item (its `name` in VS Code). */
		readonly itemName: string;
		/** What each state means, for a legend under the mock. */
		readonly legendTitle: string;
		readonly legend: readonly {
			readonly text: string;
			readonly meaning: Rich;
		}[];
	};
	/** The hover card: the full menu, above the status bar item. */
	readonly hoverCard: {
		readonly title: string;
		readonly runs: string;
		/** `<count>` is replaced. */
		readonly saved: string;
		readonly unsaved: string;
		readonly actions: {
			readonly save: string;
			readonly switch: string;
			readonly forget: string;
		};
		readonly links: {
			readonly extension: string;
			readonly log: string;
		};
	};
	/** “Switch Account for This Window”. */
	readonly quickPick: {
		/** As it appears in the Command Palette. */
		readonly command: string;
		readonly title: string;
		readonly placeholder: string;
		readonly currentIcon: string;
		readonly otherIcon: string;
		readonly currentDescription: string;
	};
	readonly reload: {
		/** The mock’s overlay while the window reloads. Not an extension string. */
		readonly overlay: string;
		/** Shown after a sign-in inside the window (src/setupWizard.ts). `<email>` is replaced. */
		readonly signedInNotice: string;
	};
	/** Picking the account the window already runs. `<email>` is replaced. */
	readonly alreadyCurrent: string;
	/** The steps, lit one at a time as the visitor tries the mock. */
	readonly stepsTitle: string;
	readonly steps: readonly DemoStep[];
	readonly controls: {
		/** Beside the label: what to try. */
		readonly hint: string;
		/** In place of the hint when scripts are off: the mock is a picture then. */
		readonly noScript: string;
		readonly reset: string;
		/** `<window>` is replaced with a window’s label. */
		readonly switchWindow: string;
	};
	/**
	 * What the polite live region says. `<window>`, `<other>`, `<email>` and
	 * `<otherEmail>` are replaced.
	 */
	readonly narration: {
		readonly opened: string;
		readonly closed: string;
		readonly reloading: string;
		readonly switched: string;
		readonly reset: string;
	};
};

export const demo: Demo = {
	id: "demo",
	eyebrow: { index: "02", label: "See it" },
	heading: {
		runs: [
			{ text: "Two windows,", weight: "heavy" },
			{ text: "two accounts, at once.", weight: "light" }
		],
		plain: "Two windows, two accounts, at once."
	},
	lead: "Click a status bar to switch that window’s account. The other window keeps running its own.",
	illustration: {
		label: "Illustration",
		note: "The status bar and menu text match the extension; the projects and accounts are examples."
	},
	windows: [
		{
			key: "a",
			label: "Window A",
			project: "client-dashboard",
			account: "you@work.com",
			file: "RevenueChart.tsx",
			language: "TypeScript JSX",
			branch: "main",
			cursor: "Ln 6, Col 12",
			tree: [
				{ name: "src", depth: 0, kind: "folder" },
				{ name: "charts", depth: 1, kind: "folder" },
				{ name: "Chart.tsx", depth: 2, kind: "file" },
				{
					name: "RevenueChart.tsx",
					depth: 2,
					kind: "file",
					active: true
				},
				{ name: "useRevenue.ts", depth: 2, kind: "file" },
				{ name: "App.tsx", depth: 1, kind: "file" },
				{ name: "package.json", depth: 0, kind: "file" },
				{ name: "README.md", depth: 0, kind: "file" }
			],
			code: [
				'import { Chart } from "./Chart";',
				"",
				"export function RevenueChart() {",
				"  const q = useRevenue();",
				"  if (q.isPending) {",
				"    return <ChartSkeleton />;",
				"  }",
				"  return <Chart data={q.data} />;",
				"}"
			],
			chat: [
				{
					from: "you",
					text: "The revenue chart flashes empty on first load. Why?"
				},
				{
					from: "claude",
					text: "It renders before the data arrives. I added a skeleton while `q.isPending` is true."
				}
			],
			summary:
				"Window A has the project client-dashboard open, with a conversation about its revenue chart in the Claude Code panel."
		},
		{
			key: "b",
			label: "Window B",
			project: "dotfiles",
			account: "you@personal.dev",
			file: ".zshrc",
			language: "Shell Script",
			branch: "main",
			cursor: "Ln 5, Col 3",
			tree: [
				{ name: "git", depth: 0, kind: "folder" },
				{ name: ".gitconfig", depth: 1, kind: "file" },
				{ name: "nvim", depth: 0, kind: "folder" },
				{ name: "init.lua", depth: 1, kind: "file" },
				{ name: ".zshrc", depth: 0, kind: "file", active: true },
				{ name: "Brewfile", depth: 0, kind: "file" },
				{ name: "install.sh", depth: 0, kind: "file" }
			],
			code: [
				"# Node follows the folder",
				"autoload -U add-zsh-hook",
				"",
				"load-nvmrc() {",
				"  [[ -f .nvmrc ]] && nvm use",
				"}",
				"add-zsh-hook chpwd load-nvmrc",
				"load-nvmrc"
			],
			chat: [
				{
					from: "you",
					text: "Switch Node versions per project, automatically."
				},
				{
					from: "claude",
					text: "Done. A `chpwd` hook runs `nvm use` in any folder with an `.nvmrc`."
				}
			],
			summary:
				"Window B has the project dotfiles open, with a conversation about its shell setup in the Claude Code panel."
		}
	],
	accounts: ["you@work.com", "you@personal.dev"],
	panel: {
		title: "Claude Code"
	},
	statusBar: {
		format: "$(account) <email>",
		unsavedSuffix: " $(circle-outline)",
		signedOut: "$(account) Claude: sign in",
		confirming: "$(account) Claude $(sync~spin)",
		itemName: "Claude Account",
		legendTitle: "What the status bar says",
		legend: [
			{
				text: "$(account) you@work.com",
				meaning:
					"The account this window runs, confirmed against the real token with `claude auth status`."
			},
			{
				text: "$(account) you@work.com $(circle-outline)",
				meaning:
					"Signed in, but not saved yet. Saving lets you switch back to it later."
			},
			{
				text: "$(account) Claude: sign in",
				meaning:
					"No account is signed in for this window. If you have saved accounts, clicking it offers them."
			}
		]
	},
	hoverCard: {
		title: "Claude Parallel Profiles",
		runs: "This window runs this account. Other windows can run others at the same time.",
		saved: "Accounts saved: <count>",
		unsaved: "Not saved yet — saving lets you switch back to it later.",
		actions: {
			save: "Save this account",
			switch: "Switch account",
			forget: "Forget…"
		},
		links: {
			extension: "Extension",
			log: "Log"
		}
	},
	quickPick: {
		command: "Claude Accounts: Switch Account for This Window",
		title: "Switch Claude account for this window (reloads the window)",
		placeholder: "Pick the account this window should use",
		currentIcon: "$(check)",
		otherIcon: "$(account)",
		currentDescription: "current"
	},
	reload: {
		overlay: "Reloading the window…",
		signedInNotice:
			"Claude Accounts: Signed in as <email> — the window was reloaded so Claude Code fully switches to it."
	},
	alreadyCurrent: "<email> is already this window's account.",
	stepsTitle: "What you’re seeing",
	steps: [
		{
			title: "Two windows, two accounts",
			caption:
				"Window A runs you@work.com and window B runs you@personal.dev, at the same time. Each status bar shows the account that window runs."
		},
		{
			title: "Click the status bar",
			caption:
				"A click does the one action that makes sense right now. With another account saved, that’s switching. Hover instead for the full menu."
		},
		{
			title: "Pick an account",
			caption:
				"The list shows each saved account once, by email. The one this window runs is ticked."
		},
		{
			title: "The window reloads",
			caption:
				"Claude Code reads its account once, at start-up. The reload is what makes it both show and bill the account you picked."
		},
		{
			title: "The other window is untouched",
			caption:
				"Each window runs a private copy of its account, so a switch or a sign-in in one window can’t reach another. The switched window keeps its conversations too: history is one store, kept per project folder."
		}
	],
	controls: {
		hint: "Click either status bar to switch that window’s account.",
		noScript:
			"With JavaScript on, clicking a status bar switches that window’s account.",
		reset: "Reset",
		switchWindow: "Switch <window>"
	},
	narration: {
		opened: "Switch Account for This Window, in <window>. Use the arrow keys and Enter to choose, or Escape to close.",
		closed: "Closed. <window> still runs <email>.",
		reloading: "<window> is reloading onto <email>.",
		switched:
			"<window> reloaded and now runs <email>. Its conversations are still in the history, ready to resume. <other> still runs <otherEmail>.",
		reset: "Reset. <window> runs <email> and <other> runs <otherEmail>."
	}
};
