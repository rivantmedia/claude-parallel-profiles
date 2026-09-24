/*
 * The site is served from a sub-path on GitHub Pages
 * (/claude-parallel-profiles/). Next prefixes that base path on its own
 * links, scripts and fonts, but not on plain strings pointing into public/,
 * so every <img src>, <link href> or CSS url() to a public file goes through
 * here. next.config.ts inlines NEXT_PUBLIC_BASE_PATH ("" locally).
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** A public-file URL with the base path in front: asset("/art/orbs.svg"). */
export function asset(path: string): string {
	return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The deployed site's absolute URL for a path, for metadata and sitemaps. */
export function absoluteUrl(path = "/"): string {
	const site = (
		process.env.NEXT_PUBLIC_SITE_URL ??
		"https://rivantmedia.github.io/claude-parallel-profiles"
	).replace(/\/$/, "");
	return `${site}${path.startsWith("/") ? path : `/${path}`}`;
}
