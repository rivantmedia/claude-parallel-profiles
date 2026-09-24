import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("uninstalling"): page.tsx and the nav depend on them.
 */
export function Uninstall() {
	return (
		<Section
			id="uninstalling"
			labelledBy="uninstalling-heading"
		>
			<Container>
				<Eyebrow index="07">Uninstalling</Eyebrow>
				<Heading
					id="uninstalling-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for uninstalling", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
