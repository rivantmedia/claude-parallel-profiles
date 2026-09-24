import type { MetadataRoute } from "next";
import { absoluteUrl } from "~/lib/asset";

// Written once at build time into out/sitemap.xml.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{ url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
		{
			url: absoluteUrl("/changelog/"),
			changeFrequency: "monthly",
			priority: 0.6
		}
	];
}
