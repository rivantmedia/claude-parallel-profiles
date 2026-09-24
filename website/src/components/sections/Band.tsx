import { Fragment } from "react";
import { Marquee, Spark } from "~/components/primitives";

const WORDS = ["Parallel", "Profiles", "Parallel", "Profiles"];

// Both rows bleed 10vw past each side, so no edge ever shows.
const ROW =
	"-mx-[10vw] font-display text-[clamp(4.5rem,15vw,15rem)] leading-[0.8] uppercase select-none";

/**
 * STUB, to be replaced by the section builder. Keep the export name. The
 * house kinetic band: two full-bleed rows looping in opposite directions, one
 * solid and heavy, one hollow and light italic. Decorative, so hidden from
 * assistive tech.
 */
export function Band() {
	return (
		<div
			aria-hidden="true"
			className="relative isolate overflow-clip py-16 md:py-24"
		>
			<Marquee
				duration={38}
				gap="0.26em"
				className={`${ROW} font-black tracking-[-0.035em] text-paper`}
			>
				{WORDS.map((word, index) => (
					<Fragment key={index}>
						<span>{word}</span>
						<Spark
							tone={index % 2 ? "ember" : "spark"}
							className="size-[0.42em]"
						/>
					</Fragment>
				))}
			</Marquee>
			<Marquee
				duration={46}
				reverse
				gap="0.3em"
				className={`${ROW} text-hollow mt-6 font-extralight tracking-[-0.03em] italic md:mt-9`}
			>
				{WORDS.map((word, index) => (
					<span key={index}>{word}</span>
				))}
			</Marquee>
		</div>
	);
}
