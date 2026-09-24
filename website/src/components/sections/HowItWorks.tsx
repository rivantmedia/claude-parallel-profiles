import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("how-it-works"): page.tsx and the nav depend on them.
 */
export function HowItWorks() {
	return (
		<Section
			id="how-it-works"
			labelledBy="how-it-works-heading"
		>
			<Container>
				<Eyebrow index="05">How it works</Eyebrow>
				<Heading
					id="how-it-works-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for how it works", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
