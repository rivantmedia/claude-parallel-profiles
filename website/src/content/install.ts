/**
 * The closing call to action: a heading in weight contrast, the install
 * command, the links, and a calm line inviting a rating.
 */
import { installCommand, links } from "./links";
import type { ContrastHeading, Eyebrow, LinkRef, Rich } from "./types";

export type Install = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly body: Rich;
	readonly command: {
		readonly label: string;
		readonly text: string;
		readonly copy: string;
		readonly copied: string;
	};
	readonly primary: LinkRef;
	readonly secondary: LinkRef;
	readonly issues: LinkRef;
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
	body: "Free and open source under the MIT License. Install it where Claude Code runs, next to the Claude Code extension; in a WSL or SSH window, that’s the remote side.",
	command: {
		label: "Or from a terminal",
		text: installCommand,
		copy: "Copy",
		copied: "Copied"
	},
	primary: {
		label: "Install from the Marketplace",
		href: links.marketplace,
		external: true
	},
	secondary: {
		label: "Source on GitHub",
		href: links.github,
		external: true
	},
	issues: {
		label: "Report an issue",
		href: links.issues,
		external: true
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
