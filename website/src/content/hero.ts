/**
 * Hero: the first screen. The eyebrow names the umbrella, the headline is the
 * product’s name, the promise is one sentence, and the figures line is built
 * only from facts that can be checked (the bundle size is the minified
 * dist/extension.js: 45,533 bytes).
 */
import { links } from "./links";
import type { ContrastHeading, LinkRef } from "./types";

/**
 * One figure in the line over the headline: an optional lead-in, the value
 * (set a step brighter, in tabular numerals) and an optional noun after it.
 */
type Figure = {
	readonly before?: string;
	readonly value: string;
	readonly noun?: string;
};

export type Hero = {
	readonly eyebrow: {
		readonly label: string;
		readonly tag: string;
	};
	/**
	 * The name for the giant headline, one line per run. As on rivant.in,
	 * every letter rests at the same light weight and the lines differ by
	 * colour: the `light` run in mist, then the `heavy` run in paper. The
	 * pointer’s letter accordion supplies the weight.
	 */
	readonly headline: ContrastHeading;
	/** One sentence: what it does. */
	readonly promise: string;
	/** The line under the promise. */
	readonly support: string;
	/**
	 * “0 network calls, 0 runtime dependencies and a bundle of about 45 KB”,
	 * with a quieter tail. `text` is the whole line as one string, for screen
	 * readers.
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
	/**
	 * Under the install command: what has to be installed already. Reads as
	 * one sentence, `before` + the link + `after`.
	 */
	readonly requires: {
		readonly before: string;
		readonly link: LinkRef;
		readonly after: string;
	};
	readonly platforms: {
		readonly items: readonly string[];
		/** The same line as a sentence, for screen readers. */
		readonly text: string;
	};
	/**
	 * Faint vertical type at the hero’s right edge (the style font): a line
	 * about the project, as rivant.in sets its tagline there. (The umbrella
	 * is already in the nav and the eyebrow.)
	 */
	readonly sideline: string;
};

export const hero: Hero = {
	eyebrow: {
		label: "Rivant for the Community",
		tag: "Open source"
	},
	headline: {
		runs: [
			{ text: "Claude Parallel", weight: "light" },
			{ text: "Profiles", weight: "heavy" }
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
			{ before: "a bundle of about", value: "45 KB" }
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
		before: "Works alongside the official ",
		link: {
			label: "Claude Code extension",
			href: links.claudeCode,
			external: true
		},
		after: ", which must be installed."
	},
	platforms: {
		items: ["Linux", "macOS", "WSL", "Remote-SSH", "Dev containers"],
		text: "Runs on Linux, macOS, WSL, Remote-SSH and dev containers."
	},
	sideline: "one account per window"
};
