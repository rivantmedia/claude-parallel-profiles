/**
 * Site-wide copy: the name, the metadata, the “Rivant for the Community”
 * lockup, the nav and the footer. The one source for the chrome (Navbar,
 * Footer, Lockup) and every page’s metadata; section copy lives beside it.
 */
import { links } from "./links";
import type { LinkRef } from "./types";

/** A column of footer links under a small heading. */
type LinkColumn = {
	readonly title: string;
	readonly links: readonly LinkRef[];
};

export type Site = {
	readonly name: string;
	/** The umbrella label Rivant Media’s open-source work is published under. */
	readonly umbrella: string;
	/**
	 * The copyright holders, exactly as LICENSE names them: the original
	 * author, then Rivant Media. The footer's copyright line.
	 */
	readonly copyrightHolders: string;
	/** The publisher: metadata and the footer credit. */
	readonly rivant: {
		readonly name: string;
		readonly legalName: string;
		readonly href: string;
	};
	/** The homepage’s <title>. Other pages set “<page> | <name>”. */
	readonly title: string;
	/** Meta description and the Open Graph card. One sentence. */
	readonly description: string;
	/**
	 * The extension’s version. next.config.ts reads it from the extension’s
	 * package.json at build time, so the site never drifts from the release.
	 */
	readonly version: string;
	/**
	 * The umbrella as a lockup: the Rivant logomark, then `wordmark` set like
	 * Rivant’s nav, then `tail` in extralight italic.
	 */
	readonly lockup: {
		readonly wordmark: string;
		readonly tail: string;
	};
	readonly skipLink: string;
	/** The button that pauses the page's looping motion, and resumes it. */
	readonly motionToggle: {
		readonly pause: string;
		readonly play: string;
	};
	readonly nav: {
		readonly items: readonly LinkRef[];
		readonly cta: LinkRef;
		/** Accessible name of the GitHub icon button. */
		readonly github: string;
	};
	readonly footer: {
		/** The one line about the project under the lockup. */
		readonly statement: string;
		/** “A fork of <link>. All credit…”, as one sentence. */
		readonly original: {
			readonly before: string;
			readonly link: LinkRef;
			readonly after: string;
		};
		readonly columns: readonly LinkColumn[];
		readonly release: {
			readonly title: string;
			readonly version: string;
			readonly license: string;
			readonly licenseName: string;
		};
		readonly license: string;
		/** “Designed and developed by”, before a link to Rivant Media. */
		readonly credit: string;
		readonly disclaimer: string;
		readonly backToTop: string;
	};
};

export const site: Site = {
	name: "Claude Parallel Profiles",
	umbrella: "Rivant for the Community",
	copyrightHolders: "dercasdrol and Rivant Media Solutions Private Limited",
	rivant: {
		name: "Rivant Media",
		legalName: "Rivant Media Solutions Private Limited",
		href: links.rivant
	},
	title: "Claude Parallel Profiles | A Claude account per VS Code window",
	description:
		"A companion for the Claude Code extension: run a different Claude account in each VS Code window, at the same time, with one shared conversation history. Linux, macOS, WSL, Remote-SSH and dev containers.",
	version: process.env.NEXT_PUBLIC_EXTENSION_VERSION ?? "",
	lockup: {
		wordmark: "RIVANT",
		tail: "for the Community"
	},
	skipLink: "Skip to content",
	motionToggle: {
		pause: "Pause motion",
		play: "Play motion"
	},
	nav: {
		items: [
			{ label: "How it works", href: "/#how-it-works", external: false },
			{ label: "Privacy", href: "/#privacy", external: false },
			{ label: "Changelog", href: links.changelog, external: false }
		],
		cta: { label: "Install", href: "/#install", external: false },
		github: "Claude Parallel Profiles on GitHub"
	},
	footer: {
		statement:
			"Rivant for the Community is Rivant Media’s open-source work, free to use. This one runs a different Claude account in each VS Code window.",
		original: {
			before: "A fork of ",
			link: {
				label: "DercasDrol’s Claude Parallel Accounts",
				href: links.original,
				external: true
			},
			after: ". All credit for the original design goes to its author."
		},
		columns: [
			{
				title: "Project",
				links: [
					{
						label: "Marketplace",
						href: links.marketplace,
						external: true
					},
					{ label: "GitHub", href: links.github, external: true },
					{ label: "Issues", href: links.issues, external: true },
					{
						label: "Changelog",
						href: links.changelog,
						external: false
					},
					{ label: "License", href: links.license, external: true }
				]
			},
			{
				title: "Rivant Media",
				links: [
					{ label: "rivant.in", href: links.rivant, external: true },
					{
						label: "Instagram",
						href: "https://www.instagram.com/rivantmedia/",
						external: true
					},
					{
						label: "LinkedIn",
						href: "https://www.linkedin.com/company/rivantmedia/",
						external: true
					},
					{
						label: "X",
						href: "https://x.com/rivantmedia",
						external: true
					},
					{
						label: "Behance",
						href: "https://www.behance.net/rivantmedia",
						external: true
					}
				]
			}
		],
		release: {
			title: "Release",
			version: "Version",
			license: "License",
			licenseName: "MIT"
		},
		license: "MIT License",
		credit: "Designed and developed by",
		disclaimer:
			"Not affiliated with or endorsed by Anthropic. Claude and Claude Code are trademarks of Anthropic, PBC.",
		backToTop: "Back to top"
	}
};
