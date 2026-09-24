import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("requirements"): page.tsx and the nav depend on them.
 */
export function Requirements() {
	return (
		<Section
			id="requirements"
			labelledBy="requirements-heading"
		>
			<Container>
				<Eyebrow index="08">Requirements</Eyebrow>
				<Heading
					id="requirements-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for requirements", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
