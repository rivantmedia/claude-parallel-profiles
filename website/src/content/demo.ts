/**
 * Copy for the animated demo: two VS Code windows on one account, then the
 * second switched to another from its status bar. It is an illustration,
 * not a screenshot. The status bar and quick pick strings are the
 * extension’s real ones, verbatim (src/statusBar.ts, src/setupWizard.ts);
 * `$(name)` is VS Code’s codicon syntax, which the mock draws as the
 * matching icon. The projects, files, code, chats and email addresses are
 * made-up examples.
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

/** One turn in a window’s Claude Code panel. */
export type DemoMessage = {
	readonly from: "you" | "claude";
	readonly text: Rich;
};

export type DemoWindow = {
	readonly key: "a" | "b";
	/** The folder open in it, shown in the title bar. */
	readonly project: string;
	/** The file open in the editor, and its language as the status bar names it. */
	readonly file: string;
	readonly language: string;
	readonly branch: string;
	/** Where the cursor sits, for the status bar. */
	readonly cursor: string;
	readonly tree: readonly DemoFile[];
	/** The editor’s lines, drawn in greys by a tiny highlighter. */
	readonly code: readonly string[];
	/** A question and Claude’s answer, played out in its Claude Code panel. */
	readonly chat: readonly [DemoMessage, DemoMessage];
};

export type Demo = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	/** What a screen reader hears in place of the animation. */
	readonly description: string;
	readonly windows: readonly [DemoWindow, DemoWindow];
	/** The saved accounts, in list order. Both windows start on the first. */
	readonly accounts: readonly [string, string];
	readonly panelTitle: string;
	/** The status bar item, in the real format; `<email>` is replaced. */
	readonly statusBar: string;
	/** “Switch Account for This Window”, as the extension draws it. */
	readonly quickPick: {
		readonly title: string;
		readonly placeholder: string;
		readonly currentIcon: string;
		readonly otherIcon: string;
		readonly currentDescription: string;
	};
	/** The mock’s overlay while a window reloads. Not an extension string. */
	readonly reloading: string;
	/** The steps under the windows, lit in turn as the animation plays. */
	readonly steps: readonly [string, string, string, string];
	/** The one line under the steps: where accounts come from. */
	readonly note: string;
};

export const demo: Demo = {
	id: "demo",
	eyebrow: { label: "How it works" },
	heading: {
		runs: [
			{ text: "Two windows,", weight: "heavy" },
			{ text: "two accounts, at once.", weight: "light" }
		],
		plain: "Two windows, two accounts, at once."
	},
	description:
		"An illustration of two VS Code windows, both signed in as you@work.com. In the second window you click the account in the status bar, pick you@personal.dev, and that window reloads onto it. Then both windows run at the same time, each on its own account.",
	windows: [
		{
			key: "a",
			project: "client-dashboard",
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
			]
		},
		{
			key: "b",
			project: "dotfiles",
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
			]
		}
	],
	accounts: ["you@work.com", "you@personal.dev"],
	panelTitle: "Claude Code",
	statusBar: "$(account) <email>",
	quickPick: {
		title: "Switch Claude account for this window (reloads the window)",
		placeholder: "Pick the account this window should use",
		currentIcon: "$(check)",
		otherIcon: "$(account)",
		currentDescription: "current"
	},
	reloading: "Reloading the window…",
	steps: [
		"Click the account in the status bar",
		"Pick another account",
		"The window reloads onto it",
		"Both run at the same time"
	],
	note: "Accounts join the list when you sign in to Claude Code, as usual."
};
