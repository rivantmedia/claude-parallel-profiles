import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("history"): page.tsx and the nav depend on them.
 */
export function History() {
	return (
		<Section
			id="history"
			labelledBy="history-heading"
		>
			<Container>
				<Eyebrow index="04">Shared history</Eyebrow>
				<Heading
					id="history-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for history", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
