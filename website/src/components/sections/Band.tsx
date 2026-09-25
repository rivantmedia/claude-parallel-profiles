import { UserIcon } from "@phosphor-icons/react/ssr";
import { Fragment } from "react";
import {
	Container,
	Marquee,
	MotionToggle,
	Spark,
	type SparkTone
} from "~/components/primitives";
import { band } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./Band.module.css";

/** The hollow row's sparks cycle through the icon's three tones. */
const TONES: SparkTone[] = ["spark", "ember", "rust"];

// Both rows share one size and bleed 10vw past each side, so the scroll drift
// never uncovers an edge. The left padding cancels the bleed, then adds the
// Container's gutter; from md it resolves against the band's width (50%), so
// the first word stays on the content edge once the 1440px column centres on
// wide screens. That matters most with reduced motion, where the rows sit
// still.
const ROW =
	"-mx-[10vw] pl-[calc(10vw+1.25rem)] font-display text-[clamp(4.5rem,15vw,15rem)] leading-[0.8] select-none md:pl-[calc(10vw_+_max(2.5rem,_50%_-_42.5rem))]";

/**
 * The kinetic band between the hero and the idea, after rivant.in's intro
 * band: two full-bleed rows looping in opposite directions. The solid, heavy
 * row is a run of sample accounts, each after the person icon the status bar
 * shows beside the account; the hollow, light italic row is where it runs,
 * with a small spark between. The rows are decorative and hidden from
 * assistive tech; the tagline between them is the only line read out.
 */
export function Band() {
	return (
		<div
			data-progress=""
			className="relative isolate overflow-clip pt-16 pb-10 md:pt-24 md:pb-14"
		>
			<div
				aria-hidden="true"
				className={cn(styles.row, styles.forward)}
			>
				<Marquee
					duration={90}
					gap="0.24em"
					className={cn(
						ROW,
						// Lowercase, unlike rivant.in's caps: the @, p and y hang
						// about 0.2em below the 0.8 line box, so the row keeps
						// that room under it, clear of the tagline.
						"pb-[0.2em] font-black tracking-[-0.045em] text-paper",
						styles.pin
					)}
				>
					{band.solid.map((account, index) => (
						<Fragment key={index}>
							<UserIcon
								weight="light"
								className="size-[0.42em] shrink-0 translate-y-[0.04em] text-ash"
							/>
							<span>{account}</span>
						</Fragment>
					))}
				</Marquee>
			</div>

			<Container className="my-6 flex flex-wrap items-center gap-x-6 gap-y-5 md:my-9">
				{/* On phones each sentence takes its own line. The rule joins
				    from lg, where the line has room for it; on a tablet it
				    would squeeze the tagline onto two lines. The rows loop
				    forever, so the button that pauses them sits beside the
				    tagline, the one line here that is read. */}
				<p className="flex min-w-0 flex-1 items-center gap-6">
					<span className="font-display text-lg leading-snug md:text-2xl">
						{band.tagline.runs.map((run, index) => (
							<Fragment key={run.text}>
								{index > 0 && " "}
								<span
									className={cn(
										"block sm:inline",
										run.weight === "heavy"
											? "font-extrabold text-paper"
											: // Extralight is too thin to read at phone size.
												"font-light text-mist italic md:font-extralight"
									)}
								>
									{run.text}
								</span>
							</Fragment>
						))}
					</span>
					<span
						aria-hidden="true"
						className={cn(
							"hidden h-px min-w-12 flex-1 bg-smoke/70 lg:block",
							styles.rule
						)}
					/>
				</p>
				<MotionToggle />
			</Container>

			<div
				aria-hidden="true"
				className={cn(styles.row, styles.backward)}
			>
				<Marquee
					duration={60}
					reverse
					gap="0.3em"
					className={cn(
						ROW,
						"text-hollow font-extralight tracking-[-0.03em] italic",
						styles.pin
					)}
				>
					{band.hollow.map((word, index) => (
						<Fragment key={word}>
							<Spark
								tone={TONES[index % TONES.length]}
								stroke={false}
								className="size-[0.3em]"
							/>
							<span className="pr-[0.08em]">{word}</span>
						</Fragment>
					))}
				</Marquee>
			</div>
		</div>
	);
}
