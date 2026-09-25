import { cn } from "~/lib/utils";
import type { Release } from "./releases";

const GROUPS: { project: Release["project"]; label: string }[] = [
	{ project: "fork", label: "This fork" },
	{ project: "original", label: "The original" }
];

/**
 * Jump links to every release. On phones and tablets a row of version pills
 * that scrolls sideways inside the gutter; on wide screens a sticky rail
 * beside the notes, grouped by who published the release, with the dates in
 * table form. The link to the release in the address bar (:target) is lit,
 * by a small generated stylesheet rather than script.
 */
export function VersionIndex({ releases }: { releases: Release[] }) {
	// Ids are [a-z0-9-] by construction (see releases.ts), safe in a selector.
	const targetStyles = releases
		.map(
			(release) =>
				`main:has(#${release.id}:target) [data-jump="${release.id}"]{color:var(--color-paper);border-color:var(--color-paper)}`
		)
		.join("");

	return (
		<nav
			aria-label="Versions"
			className="lg:sticky lg:top-28 lg:self-start"
		>
			{/* React hoists this into <head> (href + precedence). */}
			<style
				href="changelog-jump-targets"
				precedence="default"
			>
				{targetStyles}
			</style>

			<p
				aria-hidden="true"
				className="text-eyebrow font-semibold text-ash uppercase"
			>
				Versions
			</p>

			{/* Phones and tablets: one scrolling row, cropped by the gutters.
			    Positioned, so the links' sr-only text is clipped with them
			    instead of widening the page. */}
			<ul className="relative -mx-5 mt-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 py-2 md:-mx-10 md:px-10 lg:hidden [&::-webkit-scrollbar]:hidden">
				{releases.map((release) => (
					<li
						key={release.id}
						className="shrink-0"
					>
						<a
							href={`#${release.id}`}
							data-jump={release.id}
							className="relative inline-flex min-h-11 items-center rounded-full px-4 font-display text-[0.9375rem] font-light text-bone tabular-nums ring-1 ring-smoke/70 transition-[color,background-color] duration-300 ease-spring ring-inset hover:bg-white/[0.04] hover:text-paper"
						>
							<span className="sr-only">Version </span>
							{release.version}
						</a>
					</li>
				))}
			</ul>

			{/* Wide screens: the rail, grouped. */}
			<div className="mt-6 hidden gap-8 lg:grid">
				{GROUPS.map((group) => {
					const items = releases.filter(
						(release) => release.project === group.project
					);
					if (items.length === 0) return null;
					return (
						<div key={group.project}>
							<p
								id={`index-${group.project}`}
								className="font-display text-[0.8125rem] font-extralight text-mist italic"
							>
								{group.label}
							</p>
							<ul
								aria-labelledby={`index-${group.project}`}
								className="mt-2 border-l border-slate"
							>
								{items.map((release) => (
									<li key={release.id}>
										<a
											href={`#${release.id}`}
											data-jump={release.id}
											className={cn(
												"relative -ml-px flex min-h-11 flex-col justify-center border-l border-transparent py-1.5 pl-4 text-bone transition-[color,border-color] duration-300 ease-spring hover:border-smoke hover:text-paper",
												"focus-visible:outline-offset-[-2px]"
											)}
										>
											<span className="font-display text-base leading-tight font-light tabular-nums">
												<span className="sr-only">
													Version{" "}
												</span>
												{release.version}
											</span>
											{release.dateShort && (
												<span className="mt-0.5 text-xs text-ash tabular-nums">
													{release.dateShort}
												</span>
											)}
										</a>
									</li>
								))}
							</ul>
						</div>
					);
				})}
			</div>
		</nav>
	);
}
