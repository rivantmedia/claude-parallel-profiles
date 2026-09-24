/**
 * Site-wide copy: the name, the metadata description, the “Rivant for the
 * Community” lockup, the nav and the footer’s credit and legal lines.
 */
import { links } from "./links";
import type { LinkRef } from "./types";

export type Site = {
	readonly name: string;
	/** For <title> templates: "Changelog · Claude Parallel Profiles". */
	readonly titleSeparator: string;
	/** Meta description and the Open Graph card. One sentence. */
	readonly description: string;
	/** Short line under the name on the Open Graph image. */
	readonly ogLine: string;
	readonly version: string;
	/**
	 * The umbrella label, as a lockup: the Rivant logomark, then `wordmark`
	 * set like Rivant’s nav, then `tail` in extralight italic.
	 */
	readonly lockup: {
		readonly wordmark: string;
		readonly tail: string;
		/** The whole lockup as one phrase, for aria-label. */
		readonly label: string;
		readonly href: string;
	};
	readonly skipLink: string;
	readonly nav: {
		readonly items: readonly LinkRef[];
		readonly cta: LinkRef;
		readonly menuOpen: string;
		readonly menuClose: string;
	};
	readonly footer: {
		readonly statement: string;
		readonly columns: readonly {
			readonly title: string;
			readonly links: readonly LinkRef[];
		}[];
		readonly credit: {
			readonly lead: string;
			readonly name: string;
			readonly href: string;
		};
		readonly original: string;
		readonly license: string;
		readonly disclaimer: string;
		readonly backToTop: string;
	};
};

export const site: Site = {
	name: "Claude Parallel Profiles",
	titleSeparator: " · ",
	description:
		"A companion for the Claude Code extension: run a different Claude account in each VS Code window, at the same time, with one shared conversation history. Linux, macOS, WSL, Remote-SSH and dev containers.",
	ogLine: "A different Claude account in each VS Code window. One conversation history.",
	version: "1.4.0",
	lockup: {
		wordmark: "RIVANT",
		tail: "for the Community",
		label: "Rivant for the Community",
		href: links.rivant
	},
	skipLink: "Skip to content",
	nav: {
		items: [
			{ label: "The idea", href: "#idea", external: false },
			{ label: "Quick start", href: "#quick-start", external: false },
			{ label: "How it works", href: "#how-it-works", external: false },
			{ label: "Privacy", href: "#privacy", external: false },
			{ label: "Changelog", href: links.changelog, external: false }
		],
		cta: { label: "Install", href: links.marketplace, external: true },
		menuOpen: "Open menu",
		menuClose: "Close menu"
	},
	footer: {
		statement:
			"Rivant for the Community is Rivant Media’s open-source work, free to use.",
		columns: [
			{
				title: "Extension",
				links: [
					{
						label: "VS Code Marketplace",
						href: links.marketplace,
						external: true
					},
					{
						label: "Rate it",
						href: links.rate,
						external: true
					},
					{
						label: "Changelog",
						href: links.changelog,
						external: false
					}
				]
			},
			{
				title: "Source",
				links: [
					{ label: "GitHub", href: links.github, external: true },
					{
						label: "Report an issue",
						href: links.issues,
						external: true
					},
					{
						label: "MIT License",
						href: links.license,
						external: true
					}
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
		credit: {
			lead: "Designed and developed by",
			name: "Rivant Media",
			href: links.rivant
		},
		original:
			"A fork of DercasDrol’s Claude Parallel Accounts. All credit for the original design goes to its author.",
		license:
			"MIT License. Copyright © 2026 dercasdrol and Rivant Media Solutions Private Limited.",
		disclaimer:
			"Not affiliated with or endorsed by Anthropic. Claude and Claude Code are trademarks of Anthropic, PBC.",
		backToTop: "Back to top"
	}
};
