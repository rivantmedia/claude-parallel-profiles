/**
 * Where it runs. The rows follow the runtime check in src/extension.ts:
 * Linux and macOS (`darwin`) run, everything else stays inert. In WSL and
 * Remote-SSH the extension runs on the Linux or macOS side, so a Windows
 * desktop works through them.
 */
import type { ContrastHeading, Eyebrow } from "./types";

export type PlatformIcon =
	"linux" | "apple" | "wsl" | "ssh" | "container" | "windows";

export type Platform = {
	readonly name: string;
	readonly icon: PlatformIcon;
	readonly supported: boolean;
	/** A few words under the name, when the name alone isn’t enough. */
	readonly note?: string;
};

export type Platforms = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly items: readonly Platform[];
	/** The mark beside each name, and what screen readers hear for it. */
	readonly status: {
		readonly supported: string;
		readonly unsupported: string;
	};
};

export const platforms: Platforms = {
	id: "platforms",
	eyebrow: { label: "Platforms" },
	heading: {
		runs: [
			{ text: "Linux and macOS,", weight: "heavy" },
			{ text: "local or remote.", weight: "light" }
		],
		plain: "Linux and macOS, local or remote."
	},
	items: [
		{ name: "Linux", icon: "linux", supported: true },
		{ name: "macOS", icon: "apple", supported: true },
		{ name: "WSL", icon: "wsl", supported: true },
		{
			name: "Remote-SSH",
			icon: "ssh",
			supported: true,
			note: "To a Linux or macOS host"
		},
		{ name: "Dev containers", icon: "container", supported: true },
		{
			name: "Windows",
			icon: "windows",
			supported: false,
			note: "Use a WSL window instead"
		}
	],
	status: {
		supported: "Supported",
		unsupported: "Not supported"
	}
};
