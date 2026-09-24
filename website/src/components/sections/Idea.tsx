import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("idea"): page.tsx and the nav depend on them.
 */
export function Idea() {
	return (
		<Section
			id="idea"
			labelledBy="idea-heading"
		>
			<Container>
				<Eyebrow index="01">The idea</Eyebrow>
				<Heading
					id="idea-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for the idea", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
