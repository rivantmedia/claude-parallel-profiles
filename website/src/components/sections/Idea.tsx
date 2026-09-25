import { EngagedList } from "~/components/idea/EngagedList";
import {
	ArrowLink,
	Container,
	Eyebrow,
	Heading,
	IndexNumeral,
	Parallax,
	Reveal,
	RichText,
	Rule,
	Section,
	Shape,
	SplitText
} from "~/components/primitives";
import { idea } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./Idea.module.css";

/**
 * The answer, set like a heading (heavy words first, then the light italic)
 * but a paragraph: it is the payoff of the problem above, not the title of
 * what follows. Read out once, as a sentence.
 */
function Answer({ className }: { className?: string }) {
	const { answer } = idea;
	return (
		<p
			className={cn(
				"font-display text-title text-balance text-paper",
				className
			)}
		>
			<span className="sr-only select-none">{answer.plain}</span>
			{answer.runs.map((run, index) => (
				<span key={index}>
					{index > 0 && " "}
					<SplitText
						as="span"
						presentational
						delay={index * 140}
						className={cn(
							"block md:inline",
							run.weight === "heavy"
								? "font-extrabold"
								: "pr-[0.06em] font-extralight text-mist italic"
						)}
					>
						{run.text}
					</SplitText>
				</span>
			))}
		</p>
	);
}

/**
 * 01, the idea. The problem as a display heading that brightens as it is
 * read, the lead, then the answer; then the idea in 30 seconds as a Rivant
 * numbered index (hairlines draw in, numerals in light italic, titles lean
 * into italic under a moving mouse while the other rows recede). A dim knot
 * drifts off the right edge beside the answer. It closes on the quiet note
 * that this is a companion to Claude Code.
 */
export function Idea() {
	const { eyebrow, problem, lead, pointsTitle, points, companion } = idea;

	return (
		<Section
			id={idea.id}
			labelledBy="idea-heading"
		>
			<Container>
				<Eyebrow index={eyebrow.index}>{eyebrow.label}</Eyebrow>
				<div className={styles.problem}>
					<Heading
						id="idea-heading"
						scrub
						runs={problem.runs}
						className="mt-8 md:mt-10"
					/>
				</div>
			</Container>

			{/* Full-bleed, so the knot can be cropped by the viewport edge. */}
			<div className="relative mt-10 md:mt-14">
				<Parallax
					depth={140}
					rotate={-12}
					aria-hidden="true"
					className="absolute top-[58%] -right-[36vw] -z-10 w-[64vw] max-w-[620px] md:top-[6%] md:-right-[14vw] md:w-[40vw] lg:-top-[6%] lg:-right-[9vw] lg:w-[34vw]"
				>
					<Shape
						name="knot"
						className="w-full -rotate-[8deg] opacity-[0.22]"
					/>
				</Parallax>

				<Container className="grid gap-y-16 md:gap-y-24 lg:grid-cols-12 lg:gap-x-10">
					<SplitText className="max-w-[46ch] text-lead text-mist lg:col-span-6">
						{lead}
					</SplitText>
					<Answer className="lg:col-span-7" />
				</Container>
			</div>

			<Container className="mt-24 md:mt-36">
				<Reveal className="flex items-baseline justify-between gap-6 pb-6 md:pb-8">
					<p
						id="idea-points-title"
						className="text-eyebrow font-semibold text-ash uppercase"
					>
						{pointsTitle}
					</p>
					<p
						aria-hidden="true"
						className="font-display text-sm font-extralight text-ash italic tabular-nums"
					>
						01 – {String(points.length).padStart(2, "0")}
					</p>
				</Reveal>

				<EngagedList
					aria-labelledby="idea-points-title"
					className={styles.list}
				>
					{points.map((point, index) => (
						<li
							key={point.title}
							className={styles.row}
						>
							<Rule
								delay={index * 90}
								className="absolute inset-x-0 top-0"
							/>
							<Reveal
								delay={120 + index * 90}
								className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-3 py-8 md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-x-6 md:py-10 lg:grid-cols-12 lg:gap-x-10 lg:py-12"
							>
								{/* The <ol> already conveys order to assistive tech. */}
								<IndexNumeral
									value={index + 1}
									className={cn(
										styles.dim,
										styles.num,
										"lg:col-span-2"
									)}
								/>
								<h3
									className={cn(
										styles.dim,
										"min-w-0 font-display text-[1.375rem] leading-[1.15] font-normal tracking-[-0.015em] md:text-[1.75rem] lg:col-span-4 lg:text-[clamp(1.5rem,2.1vw,2.125rem)]"
									)}
								>
									<span className={cn("slant", styles.title)}>
										{point.title}
									</span>
								</h3>
								<p
									className={cn(
										styles.dim,
										styles.body,
										"col-start-2 max-w-[46ch] text-base leading-relaxed text-mist md:text-[1.0625rem] lg:col-span-5 lg:col-start-8"
									)}
								>
									<RichText text={point.body} />
								</p>
							</Reveal>
						</li>
					))}
				</EngagedList>
				<Rule delay={points.length * 90} />

				<Reveal className="mt-12 grid md:mt-16 lg:grid-cols-12 lg:gap-x-10">
					<div className="lg:col-span-6 lg:col-start-3">
						<p className="max-w-[54ch] text-[0.9375rem] leading-relaxed text-ash md:text-base">
							<span className="font-medium text-bone">
								{companion.lead}
							</span>{" "}
							<RichText text={companion.text} />
						</p>
						<ArrowLink
							link={companion.link}
							className="mt-3"
						/>
					</div>
				</Reveal>
			</Container>
		</Section>
	);
}
