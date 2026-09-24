import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/*
 * Static export for GitHub Pages. A project site lives under a sub-path
 * (/claude-parallel-profiles/), which the Pages workflow passes in as
 * NEXT_PUBLIC_BASE_PATH; locally it is empty, so `npm run dev` serves at /.
 * Anything that points at a file in public/ must go through asset() in
 * src/lib/asset.ts, because Next only prefixes the base path on its own links
 * and bundled assets, not on plain src/href strings.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const siteUrl = (
	process.env.NEXT_PUBLIC_SITE_URL ??
	"https://rivantmedia.github.io/claude-parallel-profiles"
).replace(/\/$/, "");

// The extension's own version, so the site never drifts from the release.
// Builds always run from website/, so the extension is one level up.
const extension = JSON.parse(
	readFileSync(path.join(process.cwd(), "..", "package.json"), "utf8")
) as { version: string };

const config: NextConfig = {
	output: "export",
	// GitHub Pages serves folders, so /changelog/ must be changelog/index.html.
	trailingSlash: true,
	images: { unoptimized: true },
	basePath: basePath || undefined,
	// Inlined into server and client bundles alike.
	env: {
		NEXT_PUBLIC_BASE_PATH: basePath,
		NEXT_PUBLIC_SITE_URL: siteUrl,
		NEXT_PUBLIC_EXTENSION_VERSION: extension.version
	},
	// The repository root has its own lockfile (the extension's); pin the
	// bundler's root here so it never walks up into the extension.
	turbopack: { root: process.cwd() },
	outputFileTracingRoot: process.cwd(),
	reactStrictMode: true,
	poweredByHeader: false
};

export default config;
