import { readFileSync } from "node:fs";
import path from "node:path";

/** One release of CHANGELOG.md: its `## <version> — <date>` heading and body. */
export type Release = {
	/** "1.4.1" */
	version: string;
	/** ISO date from the heading ("2026-09-25"), when it has one. */
	date: string | null;
	/** The date as the brand writes it: "25 September 2026". */
	dateLabel: string | null;
	/** The date as a table would: "25 Sep 2026". */
	dateShort: string | null;
	/** Anchor id: "v1-4-1". */
	id: string;
	/** The Markdown under the heading, without it. */
	body: string;
	/**
	 * Who published it. CHANGELOG.md says the entries below 1.4.0 are the
	 * original project's history (Claude Parallel Accounts).
	 */
	project: "fork" | "original";
};

/** The first release of this fork; everything older is the original's. */
export const FORK_VERSION = "1.4.0";

const HEADING = /^(.+?)\s+[—–-]\s+(\d{4}-\d{2}-\d{2})\s*$/;

/** Numeric compare of dotted versions: "1.10.0" is newer than "1.9.2". */
function compareVersions(a: string, b: string): number {
	const pa = a.split(".").map((part) => Number.parseInt(part, 10) || 0);
	const pb = b.split(".").map((part) => Number.parseInt(part, 10) || 0);
	for (let index = 0; index < Math.max(pa.length, pb.length); index++) {
		const diff = (pa[index] ?? 0) - (pb[index] ?? 0);
		if (diff !== 0) return diff;
	}
	return 0;
}

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
] as const;

/**
 * "25 September 2026", or for tables "25 Sep 2026", as the brand writes
 * dates. Spelled out by hand: ICU's en-GB short month is "Sept".
 */
function formatDate(iso: string, month: "long" | "short"): string | null {
	const [year, monthIndex, day] = iso.split("-").map(Number);
	const name = MONTHS[(monthIndex ?? 0) - 1];
	if (!year || !day || !name) return null;
	return `${day} ${month === "long" ? name : name.slice(0, 3)} ${year}`;
}

/** Splits CHANGELOG.md into releases at its `## ` headings, newest first. */
function parseChangelog(source: string): Release[] {
	return source
		.replace(/\r\n?/g, "\n")
		.split(/^## /m)
		.slice(1)
		.map((chunk) => {
			const newline = chunk.indexOf("\n");
			const heading = (
				newline === -1 ? chunk : chunk.slice(0, newline)
			).trim();
			const body = newline === -1 ? "" : chunk.slice(newline + 1).trim();
			const match = HEADING.exec(heading);
			const version = (match?.[1] ?? heading).trim();
			const date = match?.[2] ?? null;
			return {
				version,
				date,
				dateLabel: date ? formatDate(date, "long") : null,
				dateShort: date ? formatDate(date, "short") : null,
				id: `v${version
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-|-$/g, "")}`,
				body,
				project:
					compareVersions(version, FORK_VERSION) >= 0
						? "fork"
						: "original"
			} satisfies Release;
		});
}

/**
 * The repository's CHANGELOG.md, read when the page is built. Builds run
 * from website/, so the file is one level up.
 */
export function getReleases(): Release[] {
	const file = path.join(process.cwd(), "..", "CHANGELOG.md");
	return parseChangelog(readFileSync(file, "utf8"));
}
