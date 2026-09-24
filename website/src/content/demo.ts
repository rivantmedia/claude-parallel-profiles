/**
 * Copy for the interactive mock: two VS Code windows, each on a different
 * account. It is an illustration, not a screenshot, and the page says so.
 * The status bar, hover card and quick pick strings are the extension’s real
 * ones, verbatim, straight apostrophes included (src/statusBar.ts,
 * src/setupWizard.ts, package.json). `$(name)` is VS Code’s codicon syntax,
 * which the mock draws as the matching icon. The projects and email
 * addresses are made-up examples.
 */
import type { ContrastHeading, Eyebrow, Rich } from "./types";

export type DemoWindow = {
	readonly key: "a" | "b";
	/** How captions refer to it. */
	readonly label: string;
	/** The folder open in it, shown in the title bar. */
	readonly project: string;
	/** The account it starts on. */
	readonly account: string;
};

export type DemoStep = {
	readonly title: string;
	readonly caption: Rich;
};

export type Demo = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
	/** Shown on the mock itself. */
	readonly illustration: string;
	readonly windows: readonly [DemoWindow, DemoWindow];
	/** The saved accounts, in list order. */
	readonly accounts: readonly string[];
	/** Title-bar suffix, as VS Code shows it. */
	readonly appName: string;
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
	readonly steps: readonly DemoStep[];
	readonly controls: {
		readonly next: string;
		readonly back: string;
		readonly replay: string;
		/** `<window>` is replaced with a window’s label. */
		readonly switchWindow: string;
		readonly step: string;
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
	illustration:
		"Illustration. The status bar and menu text match the extension; the projects and accounts are examples.",
	windows: [
		{
			key: "a",
			label: "Window A",
			project: "client-dashboard",
			account: "you@work.com"
		},
		{
			key: "b",
			label: "Window B",
			project: "dotfiles",
			account: "you@personal.dev"
		}
	],
	accounts: ["you@work.com", "you@personal.dev"],
	appName: "Visual Studio Code",
	panel: {
		title: "Claude Code"
	},
	statusBar: {
		format: "$(account) <email>",
		unsavedSuffix: " $(circle-outline)",
		signedOut: "$(account) Claude: sign in",
		confirming: "$(account) Claude $(sync~spin)",
		itemName: "Claude Account",
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
		next: "Next",
		back: "Back",
		replay: "Replay",
		switchWindow: "Switch <window>",
		step: "Step"
	}
};
