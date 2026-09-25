/**
 * Every outside address the site links to, in one place. Section modules pull
 * their hrefs from here, so a moved repository or listing is one edit.
 */

type Links = {
	readonly marketplace: string;
	readonly rate: string;
	readonly github: string;
	readonly issues: string;
	readonly license: string;
	readonly original: string;
	readonly claudeCode: string;
	readonly rivant: string;
	/** Site-relative: use it with next/link, which adds the base path. */
	readonly changelog: string;
};

export const links: Links = {
	marketplace:
		"https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles",
	rate: "https://marketplace.visualstudio.com/items?itemName=rivantmedia.claude-parallel-profiles&ssr=false#review-details",
	github: "https://github.com/rivantmedia/claude-parallel-profiles",
	issues: "https://github.com/rivantmedia/claude-parallel-profiles/issues",
	license:
		"https://github.com/rivantmedia/claude-parallel-profiles/blob/main/LICENSE",
	original: "https://github.com/DercasDrol/claude-parallel-profiles",
	claudeCode:
		"https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code",
	rivant: "https://rivant.in",
	changelog: "/changelog/"
};

/** The Marketplace id, and the one-line install for a terminal. */
const extensionId = "rivantmedia.claude-parallel-profiles";
export const installCommand = `code --install-extension ${extensionId}`;
