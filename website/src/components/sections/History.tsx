import { HistoryDiagram } from "~/components/diagrams/HistoryDiagram";
import {
	Container,
	Parallax,
	Reveal,
	RichText,
	Rule,
	Section,
	SectionIntro,
	Shape
} from "~/components/primitives";
import { conversationHistory as history } from "~/content";

/**
 * One conversation history: why the extension keeps one store, drawn as
 * every data directory's projects folder linking into it; then what lives
 * there (and what never does) on a ruled two-by-two, beside the note that
 * there is nothing to configure. A dim pair of orbs drifts behind the
 * diagram, cropped off the left edge.
 */
export function History() {
	return (
		<Section
			id={history.id}
			labelledBy="history-heading"
		>
			<Container>
				<SectionIntro
					id="history-heading"
					eyebrow={history.eyebrow}
					heading={history.heading}
					lead={history.lead}
				/>

				{/* Relative, not a stacking context: the shape below stays on the
				    section's -z-10 layer, behind the plate. */}
				<div className="relative mt-14 md:mt-20">
					{/*
					 * Depth layer: a dim pair of orbs, far away (it lags the scroll and
					 * turns slowly), cropped off the page's left edge (50% - 50vw is
					 * that edge, from this centred box). What shows sits mostly
					 * behind the frosted plate, so it reads as a glow through the
					 * glass and never passes behind text.
					 */}
					<Parallax
						depth={200}
						rotate={-12}
						aria-hidden="true"
						className="absolute top-[calc(50%-17.5vw)] left-[calc(50%-50vw-40vw)] -z-10 w-[70vw] md:top-[calc(50%-12vw)] md:left-[calc(50%-50vw-24vw)] md:w-[48vw] lg:top-[calc(50%-8vw)] lg:left-[calc(50%-50vw-14vw)] lg:w-[32vw] xl:max-w-[36rem]"
					>
						<Shape
							name="orbs"
							className="w-full rotate-[100deg] opacity-30"
						/>
					</Parallax>

					<Reveal>
						<HistoryDiagram diagram={history.diagram} />
					</Reveal>
				</div>

				<div className="mt-16 grid gap-x-10 gap-y-16 md:mt-24 lg:grid-cols-12">
					<ul
						role="list"
						className="grid gap-x-10 gap-y-12 md:grid-cols-2 md:gap-y-14 lg:col-span-8"
					>
						{history.points.map((point, index) => (
							<li
								key={point.title}
								className="min-w-0"
							>
								<Rule delay={index * 110} />
								<Reveal
									delay={120 + index * 110}
									className="pt-6 md:pt-8"
								>
									<h3 className="font-display text-xl leading-snug font-normal tracking-[-0.01em] text-paper md:text-2xl">
										{point.title}
									</h3>
									<p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-mist md:text-base">
										<RichText text={point.body} />
									</p>
								</Reveal>
							</li>
						))}
					</ul>

					<aside
						aria-labelledby="history-config-heading"
						className="self-start lg:col-span-4"
					>
						<Reveal
							delay={200}
							className="rounded-3xl bg-carbon/80 p-7 ring-1 ring-slate backdrop-blur-md ring-inset md:p-9"
						>
							<h3
								id="history-config-heading"
								className="font-display text-xl leading-snug font-semibold tracking-[-0.01em] text-paper md:text-2xl"
							>
								{history.config.title}
							</h3>
							<p className="mt-4 text-[0.9375rem] leading-relaxed text-bone md:text-base">
								<RichText text={history.config.body} />
							</p>
							<p className="mt-4 text-sm leading-relaxed text-ash">
								<RichText text={history.config.past} />
							</p>
							<p className="mt-6 border-t border-slate pt-6 text-sm leading-relaxed text-mist">
								<RichText text={history.uninstall} />
							</p>
						</Reveal>
					</aside>
				</div>
			</Container>
		</Section>
	);
}
