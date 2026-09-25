import type { Metadata } from "next";
import { site } from "~/content";

/**
 * The Open Graph card every page shares. A page's `openGraph` replaces its
 * parent's whole object, so pages that need a different one start from this.
 * No `url` here: the root layout adds "./" (the page's own address), and the
 * 404 page leaves it out, or it would point at Next's internal /_not-found/.
 */
export const baseOpenGraph = {
	type: "website",
	siteName: `${site.name} · ${site.umbrella}`,
	title: site.name,
	description: site.description,
	locale: "en_GB",
	images: [
		{
			url: "og.png",
			width: 1200,
			height: 630,
			alt: `${site.name}, by Rivant Media`
		}
	]
} satisfies NonNullable<Metadata["openGraph"]>;
