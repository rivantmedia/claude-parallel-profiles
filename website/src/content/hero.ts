/**
 * Hero: the first screen. The eyebrow names the umbrella, the headline is the
 * product’s name, the promise is one sentence, and the figures line is built
 * only from facts that can be checked (the bundle size is the minified
 * dist/extension.js of 1.4.0: 45,533 bytes).
 */
import { links } from "./links";
import type { ContrastHeading, LinkRef, Rich } from "./types";

export type Figure = {
	/** Set a step brighter, in tabular numerals. */
	readonly value: string;
	readonly noun: string;
};

export type Hero = {
	readonly eyebrow: {
		readonly label: string;
		readonly tag: string;
	};
	readonly name: string;
	/** The name in weight contrast, for the giant headline. */
	readonly headline: ContrastHeading;
	/** One sentence: what it does. */
	readonly promise: string;
	/** The line under the promise. */
	readonly support: Rich;
	/**
	 * “0 network calls, 0 runtime dependencies and a ~45 KB bundle”, with a
	 * quieter tail. `text` is the whole line as one string, for screen readers.
	 */
	readonly figures: {
		readonly items: readonly Figure[];
		readonly tail: string;
		readonly text: string;
	};
	readonly primary: LinkRef;
	readonly secondary: LinkRef;
	/** A quiet text link, dropped where the row gets crowded. */
	readonly tertiary: LinkRef;
	/** Next to the buttons: what has to be installed already. */
	readonly requires: {
		readonly text: string;
		readonly link: LinkRef;
	};
	readonly platforms: {
		readonly label: string;
		readonly items: readonly string[];
	};
	readonly scrollCue: string;
};

export const hero: Hero = {
	eyebrow: {
		label: "Rivant for the Community",
		tag: "Open source"
	},
	name: "Claude Parallel Profiles",
	headline: {
		runs: [
			{ text: "Claude Parallel", weight: "heavy" },
			{ text: "Profiles", weight: "light" }
		],
		plain: "Claude Parallel Profiles"
	},
	promise:
		"Run a different Claude account in each VS Code window, at the same time, with one shared conversation history.",
	support:
		"A companion for the Claude Code extension, not a replacement. Each window picks its account from the status bar, and your conversations follow you from one account to the next.",
	figures: {
		items: [
			{ value: "0", noun: "network calls" },
			{ value: "0", noun: "runtime dependencies" },
			{ value: "~45 KB", noun: "bundle" }
		],
		tail: "MIT licensed",
		text: "Zero network calls, zero runtime dependencies and a bundle of about 45 KB. MIT licensed."
	},
	primary: {
		label: "Install from the Marketplace",
		href: links.marketplace,
		external: true
	},
	secondary: {
		label: "View the source",
		href: links.github,
		external: true
	},
	tertiary: {
		label: "See how it works",
		href: "#how-it-works",
		external: false
	},
	requires: {
		text: "Works alongside the official Claude Code extension, which must be installed.",
		link: {
			label: "Claude Code for VS Code",
			href: links.claudeCode,
			external: true
		}
	},
	platforms: {
		label: "Runs on",
		items: ["Linux", "macOS", "WSL", "Remote-SSH", "Dev containers"]
	},
	scrollCue: "Scroll"
};
