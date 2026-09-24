import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("privacy"): page.tsx and the nav depend on them.
 */
export function Privacy() {
	return (
		<Section
			id="privacy"
			labelledBy="privacy-heading"
		>
			<Container>
				<Eyebrow index="06">Privacy</Eyebrow>
				<Heading
					id="privacy-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for privacy", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
