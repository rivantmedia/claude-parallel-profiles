import { DemoTour } from "~/components/demo/DemoTour";
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
 * How it works, shown rather than told: a carbon band (rounded, with the
 * footer shell's faint top highlight) holding two VS Code windows, where a
 * tour plays a switch from the status bar. Dim rings drift off the band's
 * top-right corner, beside the heading.
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
				/>

				<Reveal className="mt-14 md:mt-20">
					<DemoTour />
				</Reveal>
			</Container>
		</Section>
	);
}
