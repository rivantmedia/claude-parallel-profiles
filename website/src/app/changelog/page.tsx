import type { Metadata } from "next";
import { Fragment } from "react";
import { ReleaseNotes } from "~/components/changelog/ReleaseNotes";
import { FORK_VERSION, getReleases } from "~/components/changelog/releases";
import { VersionIndex } from "~/components/changelog/VersionIndex";
import {
	BrandGrid,
	Container,
	Eyebrow,
	Heading,
	Parallax,
	Reveal,
	Section,
	Shape,
	TextLink
} from "~/components/primitives";
import { links, site } from "~/content";
import { baseOpenGraph } from "~/lib/metadata";

const DESCRIPTION =
	"Release notes for Claude Parallel Profiles, newest first, from the project’s CHANGELOG.md. Entries below 1.4.0 are the history of the original, Claude Parallel Accounts.";

export const metadata: Metadata = {
	title: "Changelog",
	description: DESCRIPTION,
	alternates: { canonical: "changelog/" },
	openGraph: {
		...baseOpenGraph,
		title: `Changelog | ${site.name}`,
		description: DESCRIPTION,
		url: "changelog/"
	}
};

const CHANGELOG_URL = `${links.github}/blob/main/CHANGELOG.md`;

/**
 * /changelog/: CHANGELOG.md, read and rendered when the site is built (no
 * client script of its own). A compact hero, then the releases: on wide
 * screens a sticky version rail on the left, and each release with its
 * version held beside its notes as they scroll. Where this fork's history
 * meets the original's, a quiet band says so.
 */
export default function ChangelogPage() {
	const releases = getReleases();

	return (
		<main
			id="main-content"
			tabIndex={-1}
		>
			<Section
				labelledBy="changelog-heading"
				className="pt-32 pb-14 md:pt-44 md:pb-20"
			>
				<BrandGrid className="-z-20" />
				{/* The trio, cropped off the top-right corner. */}
				<Parallax
					depth={-180}
					rotate={12}
					aria-hidden="true"
					className="absolute top-[6%] -right-[44vw] -z-10 w-[92vw] max-w-[720px] md:-top-[8%] md:-right-[10vw] md:w-[44vw]"
				>
					<Shape
						name="trio"
						priority
						className="w-full opacity-25"
					/>
				</Parallax>

				<Container>
					{/* The first screen rises in with the page (CSS only), so
					    it never waits for the scripts. */}
					<div
						className="fade-up"
						style={{ "--delay": "60ms" } as React.CSSProperties}
					>
						<Eyebrow>Changelog</Eyebrow>
					</div>
					<Heading
						as="h1"
						id="changelog-heading"
						entrance="load"
						delay={140}
						className="mt-8 md:mt-10"
						runs={[
							{ text: "Releases,", weight: "heavy" },
							{ text: "newest first.", weight: "light" }
						]}
					/>
					<Reveal
						entrance="load"
						delay={420}
						className="mt-10 md:mt-12"
					>
						<p className="max-w-[46ch] text-lead text-pretty text-mist">
							What changed in each version of {site.name}. This
							fork begins at {FORK_VERSION}; the entries below it
							are the history of the original project,
							DercasDrol’s Claude Parallel Accounts.
						</p>
						<p className="mt-6 text-[0.9375rem] text-mist">
							Kept in the repository as{" "}
							<TextLink href={CHANGELOG_URL}>
								CHANGELOG.md
							</TextLink>
							.
						</p>
					</Reveal>
				</Container>
			</Section>

			<section
				aria-label="Releases"
				className="pb-24 md:pb-36"
			>
				<Container className="lg:grid lg:grid-cols-12 lg:gap-x-10">
					<div className="lg:col-span-2">
						<VersionIndex releases={releases} />
					</div>

					<div className="mt-10 lg:col-span-10 lg:mt-0">
						{releases.map((release, index) => {
							const latest = index === 0;
							const forkBegins =
								release.project === "original" &&
								releases[index - 1]?.project === "fork";

							return (
								<Fragment key={release.id}>
									{forkBegins && (
										<div className="border-t border-slate py-14 md:py-20 lg:grid lg:grid-cols-10 lg:gap-x-10">
											<p className="text-eyebrow font-semibold text-ash uppercase lg:col-span-3">
												Before {FORK_VERSION}
											</p>
											<p className="mt-5 font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.15] tracking-[-0.02em] lg:col-span-7 lg:mt-0">
												<span className="block font-extrabold text-paper">
													Claude Parallel Accounts,
												</span>
												<span className="block font-extralight text-mist italic">
													the original project, by
													DercasDrol.
												</span>
											</p>
										</div>
									)}

									<article
										id={release.id}
										aria-labelledby={`${release.id}-title`}
										className="border-t border-slate py-14 md:py-20 lg:grid lg:grid-cols-10 lg:gap-x-10"
									>
										<header className="lg:sticky lg:top-28 lg:col-span-3 lg:self-start">
											<h2
												id={`${release.id}-title`}
												className="font-display text-[clamp(3rem,5vw,4.75rem)] leading-[0.9] font-extralight tracking-[-0.035em] text-paper italic tabular-nums"
											>
												<span className="sr-only">
													Version{" "}
												</span>
												{release.version}
											</h2>
											<div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
												{release.date && (
													<time
														dateTime={release.date}
														className="text-eyebrow font-semibold text-ash uppercase"
													>
														{release.dateLabel}
													</time>
												)}
												{latest && (
													<Eyebrow live>
														Latest
													</Eyebrow>
												)}
											</div>
										</header>

										<div className="mt-10 lg:col-span-7 lg:mt-1">
											<ReleaseNotes
												markdown={release.body}
											/>
										</div>
									</article>
								</Fragment>
							);
						})}
					</div>
				</Container>
			</section>
		</main>
	);
}
