import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("switching"): page.tsx and the nav depend on them.
 */
export function Switching() {
	return (
		<Section
			id="switching"
			labelledBy="switching-heading"
		>
			<Container>
				<Eyebrow index="09">Switching</Eyebrow>
				<Heading
					id="switching-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for switching", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
