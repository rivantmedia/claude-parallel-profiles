import { Container, Eyebrow, Heading, Section } from "~/components/primitives";

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * section id ("install"): page.tsx and the nav depend on them.
 */
export function Install() {
	return (
		<Section
			id="install"
			labelledBy="install-heading"
		>
			<Container>
				<Eyebrow index="10">Install</Eyebrow>
				<Heading
					id="install-heading"
					className="mt-8 md:mt-10"
					runs={[
						{ text: "Placeholder heading", weight: "heavy" },
						{ text: "for install", weight: "light" }
					]}
				/>
			</Container>
		</Section>
	);
}
