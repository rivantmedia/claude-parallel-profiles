import type { MetadataRoute } from "next";
import { absoluteUrl } from "~/lib/asset";

// Written once at build time into out/robots.txt. On a project site
// (/claude-parallel-profiles/) crawlers only read the host's root robots.txt,
// so this one matters when the site moves to its own domain.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: "*", allow: "/" },
		sitemap: absoluteUrl("/sitemap.xml")
	};
}
