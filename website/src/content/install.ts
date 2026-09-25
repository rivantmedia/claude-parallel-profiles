/**
 * The closing call to action: a heading in weight contrast, the install
 * command, the links, the one requirement, and a calm line inviting a rating.
 */
import { installCommand, links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Rich } from "./types";

export type Install = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly body: Rich;
	readonly command: {
		/** Shown above the command. */
		readonly label: string;
		readonly text: string;
		/** Accessible name of the copy button. */
		readonly copyLabel: string;
	};
	readonly primary: LinkRef;
	readonly secondary: LinkRef;
	/** The one thing it needs: `before`, the link, then `after`. */
	readonly requires: {
		readonly before: string;
		readonly link: LinkRef;
		readonly after: string;
	};
	readonly rate: {
		readonly text: string;
		readonly link: LinkRef;
	};
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
	body: "Free and open source under the MIT License. Install it where Claude Code runs, next to the Claude Code extension; in a WSL or SSH window, that’s the remote side, so run the command below in that window’s integrated terminal.",
	command: {
		label: "Or from a terminal",
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
	requires: {
		before: "Requires the",
		link: {
			label: "Claude Code extension",
			href: links.claudeCode,
			external: true
		},
		after: ". It is a companion, not a replacement: this one only controls which account each window uses."
	},
	rate: {
		text: "Useful to you? A rating on the Marketplace helps other developers find it.",
		link: {
			label: "Rate it on the Marketplace",
			href: links.rate,
			external: true
		}
	}
};
