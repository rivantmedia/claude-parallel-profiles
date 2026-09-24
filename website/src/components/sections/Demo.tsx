import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("demo"): page.tsx and the nav depend on them.
 */
export function Demo() {
	return (
		<Section
			id="demo"
			labelledBy="demo-heading"
		>
			<Container>
				<Eyebrow index="02">See it</Eyebrow>
				<Heading
					id="demo-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for the demo", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
