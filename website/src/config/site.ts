/**
 * Site-wide settings: names, addresses, navigation and the Rivant Media
 * details the chrome (nav, footer, metadata) needs. Section copy lives in
 * src/content/; this file is the plumbing around it.
 */

const repo = "https://github.com/rivantmedia/claude-parallel-profiles";
const extensionId = "rivantmedia.claude-parallel-profiles";
const marketplace = `https://marketplace.visualstudio.com/items?itemName=${extensionId}`;

export const siteConfig = {
	name: "Claude Parallel Profiles",
	/** The umbrella label Rivant Media's open-source work is published under. */
	umbrella: "Rivant for the Community",
	description:
		"A companion for the Claude Code extension: run a different Claude account in each VS Code window, at the same time. Free and open source, from Rivant Media.",
	/** The footer's one line about the project. */
	footerLine:
		"Rivant for the Community is Rivant Media’s open-source work, free to use. This one runs a different Claude account in each VS Code window.",
	/** The deployed site (no trailing slash); see next.config.ts. */
	url:
		process.env.NEXT_PUBLIC_SITE_URL ??
		"https://rivantmedia.github.io/claude-parallel-profiles",
	/** The extension's version, read from ../package.json at build time. */
	version: process.env.NEXT_PUBLIC_EXTENSION_VERSION ?? "",

	extension: {
		id: extensionId,
		installCommand: `code --install-extension ${extensionId}`
	},

	links: {
		marketplace,
		rate: `${marketplace}&ssr=false#review-details`,
		github: repo,
		issues: `${repo}/issues`,
		license: `${repo}/blob/main/LICENSE`,
		original: "https://github.com/DercasDrol/claude-parallel-profiles",
		claudeCode:
			"https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code",
		rivant: "https://rivant.in"
	},

	/** In-page anchors in the nav, shown from lg. */
	nav: [
		{ label: "How it works", href: "/#how-it-works" },
		{ label: "Privacy", href: "/#privacy" },
		{ label: "Changelog", href: "/changelog/" }
	],

	footer: {
		project: [
			{ label: "Marketplace", href: marketplace, external: true },
			{ label: "GitHub", href: repo, external: true },
			{ label: "Issues", href: `${repo}/issues`, external: true },
			{ label: "Changelog", href: "/changelog/", external: false },
			{
				label: "License",
				href: `${repo}/blob/main/LICENSE`,
				external: true
			}
		]
	},

	rivant: {
		name: "Rivant Media",
		legalName: "Rivant Media Solutions Private Limited",
		/** The wordmark, as the logo sets it. Prose says "Rivant Media". */
		shortName: "RIVANT",
		url: "https://rivant.in",
		urlLabel: "rivant.in"
	},

	socials: [
		{
			label: "Instagram",
			href: "https://www.instagram.com/rivantmedia/",
			icon: "instagram"
		},
		{
			label: "LinkedIn",
			href: "https://www.linkedin.com/company/rivantmedia/",
			icon: "linkedin"
		},
		{ label: "X", href: "https://x.com/rivantmedia", icon: "x" },
		{
			label: "Behance",
			href: "https://www.behance.net/rivantmedia",
			icon: "behance"
		}
	],

	legal: {
		license: "MIT License",
		disclaimer:
			"Not affiliated with or endorsed by Anthropic. Claude and Claude Code are trademarks of Anthropic, PBC.",
		original:
			"A fork of DercasDrol’s Claude Parallel Accounts. All credit for the original design goes to its author."
	}
} as const;

export type SocialIcon = (typeof siteConfig.socials)[number]["icon"];
