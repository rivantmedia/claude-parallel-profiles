/**
 * The big-type marquee band under the hero: one solid heavy row of sample
 * accounts, one hollow light-italic row of the places it runs, and a tagline
 * between them. Decorative: the rows are aria-hidden, the tagline is read.
 * The accounts are made-up examples; keep their case (don’t uppercase them).
 */

export type Band = {
	/** Solid, heavy. Alternates, so keep an even count. */
	readonly solid: readonly string[];
	/** Hollow, light italic. */
	readonly hollow: readonly string[];
	readonly tagline: string;
};

export const band: Band = {
	solid: [
		"you@work.com",
		"you@personal.dev",
		"you@work.com",
		"you@personal.dev"
	],
	hollow: ["Linux", "macOS", "WSL", "Remote-SSH", "Dev containers"],
	tagline: "One account per window. One history across them."
};
