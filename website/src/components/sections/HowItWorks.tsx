import { HowDiagram } from "~/components/diagrams/HowDiagram";
import {
	Accordion,
	Container,
	Heading,
	Reveal,
	RichText,
	Section,
	SectionIntro
} from "~/components/primitives";
import { how } from "~/content";

/**
 * How it works: the CLAUDE_CONFIG_DIR mechanism as the lead, the
 * stores-to-windows diagram (the same visual language as the history one)
 * with the rest of the mechanism as its caption, then the eight details that
 * make it reliable in the site's accordion, beside a heading that stays in
 * view while they're read.
 */
export function HowItWorks() {
	const [lead, ...more] = how.mechanism;

	return (
		<Section
			id={how.id}
			labelledBy="how-it-works-heading"
		>
			<Container>
				<SectionIntro
					id="how-it-works-heading"
					eyebrow={how.eyebrow}
					heading={how.heading}
					lead={lead}
				/>

				<Reveal className="mt-14 md:mt-20">
					<HowDiagram
						diagram={how.diagram}
						caption={
							more.length > 0 &&
							more.map((paragraph, index) => (
								<span key={paragraph}>
									{index > 0 && " "}
									<RichText text={paragraph} />
								</span>
							))
						}
					/>
				</Reveal>

				<div className="mt-24 grid gap-x-10 gap-y-10 md:mt-32 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<Heading
							as="h3"
							size="title"
							runs={how.detailsHeading.runs}
							className="lg:sticky lg:top-32"
						/>
					</div>
					<Accordion
						name="how-it-works-details"
						items={how.details}
						className="lg:col-span-8"
					/>
				</div>
			</Container>
		</Section>
	);
}
