/**
 * The closing call to action: a heading in weight contrast, the two links,
 * the install command, the one requirement, and the one warning for people
 * coming from the original extension.
 */
import { installCommand, links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef } from "./types";

export type Install = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly command: {
		readonly text: string;
		/** Accessible name of the copy button. */
		readonly copyLabel: string;
	};
	readonly primary: LinkRef;
	readonly secondary: LinkRef;
	/** Short notes under the command, each ending in a link. */
	readonly notes: readonly {
		readonly text: string;
		readonly link: LinkRef;
	}[];
};

export const install: Install = {
	id: "install",
	eyebrow: { label: "Install" },
	heading: {
		runs: [
			{ text: "Your accounts,", weight: "heavy" },
			{ text: "side by side.", weight: "light" }
		],
		plain: "Your accounts, side by side."
	},
	command: {
		text: installCommand,
		copyLabel: "Copy the install command"
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
	notes: [
		{
			text: "Needs the official Claude Code extension.",
			link: {
				label: "Get Claude Code",
				href: links.claudeCode,
				external: true
			}
		},
		{
			text: "Using Claude Parallel Accounts? Uninstall it first.",
			link: {
				label: "How to switch",
				href: links.switching,
				external: true
			}
		}
	]
};
