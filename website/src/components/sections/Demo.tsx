import { DemoIllustration } from "~/components/demo/DemoIllustration";
import {
	Container,
	Parallax,
	Reveal,
	Section,
	SectionIntro,
	Shape
} from "~/components/primitives";
import { demo } from "~/content";

/**
 * 02, see it. A carbon band (rounded, with the footer shell's faint top
 * highlight) holding the page's one hands-on moment: two VS Code windows on
 * two accounts. Click a status bar, pick an account, watch that window
 * reload onto it while the other keeps its own. The steps and the status
 * bar legend sit under the mock. Dim rings drift off the band's top-right
 * corner, beside the heading.
 */
export function Demo() {
	return (
		<Section
			id={demo.id}
			labelledBy="demo-heading"
			className="rounded-[1.5rem] bg-carbon shadow-[inset_0_1px_0_0_rgb(255_255_255/0.07)] md:rounded-[2rem]"
		>
			<Parallax
				depth={160}
				rotate={24}
				aria-hidden="true"
				className="absolute top-[2%] -right-[30vw] -z-10 w-[62vw] max-w-[560px] md:top-[1%] md:-right-[15vw] md:w-[34vw]"
			>
				<Shape
					name="rings"
					className="w-full opacity-[0.16]"
				/>
			</Parallax>

			<Container>
				<SectionIntro
					id="demo-heading"
					eyebrow={demo.eyebrow}
					heading={demo.heading}
					lead={demo.lead}
				/>

				<Reveal className="mt-16 md:mt-24">
					<DemoIllustration />
				</Reveal>
			</Container>
		</Section>
	);
}
