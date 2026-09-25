/**
 * Hero: the first screen. The name, one sentence on what it does, and the
 * two ways to get it. Everything else is shown, not told, further down.
 */
import { links } from "./links";
import type { ContrastHeading, LinkRef } from "./types";

export type Hero = {
	/**
	 * The name for the giant headline, one line per run. As on rivant.in,
	 * every letter rests at the same light weight and the lines differ by
	 * colour: the `light` run in mist, then the `heavy` run in paper. The
	 * pointer’s letter accordion supplies the weight.
	 */
	readonly headline: ContrastHeading;
	/** One sentence: what it does. */
	readonly promise: string;
	readonly primary: LinkRef;
	readonly secondary: LinkRef;
	/** A quiet text link down to the demo, dropped where the row gets crowded. */
	readonly tertiary: LinkRef;
};

export const hero: Hero = {
	headline: {
		runs: [
			{ text: "Claude Parallel", weight: "light" },
			{ text: "Profiles", weight: "heavy" }
		],
		plain: "Claude Parallel Profiles"
	},
	promise:
		"A different Claude account in every VS Code window, at the same time.",
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
		href: "#demo",
		external: false
	}
};
