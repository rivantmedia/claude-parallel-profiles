import type { Metadata } from "next";
import {
	BrandGrid,
	Container,
	Eyebrow,
	Heading,
	Section
} from "~/components/primitives";

export const metadata: Metadata = {
	title: "Changelog",
	description:
		"Every release of Claude Parallel Profiles, newest first, from the project's CHANGELOG.md.",
	alternates: { canonical: "changelog/" }
};

/**
 * STUB, to be replaced by the changelog builder: it renders ../CHANGELOG.md
 * at build time (fs, relative to process.cwd()/..) with react-markdown and
 * remark-gfm.
 */
export default function ChangelogPage() {
	return (
		<main
			id="main-content"
			tabIndex={-1}
		>
			<Section
				labelledBy="changelog-heading"
				className="pt-32 md:pt-44"
			>
				<BrandGrid className="-z-20" />
				<Container>
					<Eyebrow>Changelog</Eyebrow>
					<Heading
						as="h1"
						id="changelog-heading"
						className="mt-8 md:mt-10"
						runs={[
							{ text: "Every release,", weight: "heavy" },
							{ text: "newest first", weight: "light" }
						]}
					/>
				</Container>
			</Section>
		</main>
	);
}
