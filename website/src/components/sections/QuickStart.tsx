import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("quick-start"): page.tsx and the nav depend on them.
 */
export function QuickStart() {
	return (
		<Section
			id="quick-start"
			labelledBy="quick-start-heading"
		>
			<Container>
				<Eyebrow index="03">Quick start</Eyebrow>
				<Heading
					id="quick-start-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for quick start", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
