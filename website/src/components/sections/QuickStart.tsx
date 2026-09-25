import {
	ArrowLink,
	Command,
	Container,
	Heading,
	IndexNumeral,
	Reveal,
	RichText,
	Rule,
	Section,
	SectionIntro
} from "~/components/primitives";
import { quickstart } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./QuickStart.module.css";

/**
 * Quick start: the four steps from install to two windows on two accounts,
 * on a four-column grid (two by two on tablets, stacked on phones), each
 * under a hairline that draws in as it arrives. The note for people coming
 * from the original extension sits inside step 1, since it has to be read
 * before installing; the install command follows the steps, then the
 * day-to-day behaviour of the status bar as a ruled list.
 */
export function QuickStart() {
	const { steps, daily } = quickstart;
	const install = steps.find((step) => step.command);

	return (
		<Section
			id={quickstart.id}
			labelledBy="quick-start-heading"
		>
			<Container>
				<SectionIntro
					id="quick-start-heading"
					eyebrow={quickstart.eyebrow}
					heading={quickstart.heading}
					lead={quickstart.lead}
				/>

				<ol
					role="list"
					className="mt-16 grid gap-x-10 gap-y-14 md:mt-24 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4"
				>
					{steps.map((step, index) => (
						<li
							key={step.title}
							className="min-w-0"
						>
							<Rule delay={index * 120} />
							<Reveal
								delay={140 + index * 120}
								className="pt-7 md:pt-9"
							>
								<IndexNumeral
									value={index + 1}
									className="block"
								/>
								<h3 className="mt-7 font-display text-xl leading-snug font-normal tracking-[-0.01em] text-paper md:mt-10 md:text-2xl">
									{step.title}
								</h3>
								<p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-mist md:text-base">
									<RichText text={step.body} />
								</p>
								{/* Read before installing, so it sits in the
								    step itself, ahead of the way to install. */}
								{step.note && (
									<div className="mt-5 max-w-[40ch] border-l border-smoke pl-4">
										<p className="text-[0.9375rem] leading-relaxed text-bone md:text-base">
											<RichText text={step.note.text} />
										</p>
										<ArrowLink
											link={step.note.link}
											className="mt-1"
										/>
									</div>
								)}
								{step.link && (
									<ArrowLink
										link={step.link}
										className="mt-3"
									/>
								)}
							</Reveal>
						</li>
					))}
				</ol>

				{install?.command && (
					<div className="mt-16 grid md:mt-20 lg:grid-cols-12">
						<Reveal className="min-w-0 lg:col-span-7">
							<p className="text-eyebrow font-semibold text-ash uppercase">
								{install.command.label}
							</p>
							<Command
								command={install.command.text}
								label={install.command.copyLabel}
								className="mt-4"
							/>
						</Reveal>
					</div>
				)}

				<div className="mt-24 grid gap-x-10 gap-y-10 md:mt-32 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<Heading
							as="h3"
							size="title"
							runs={[{ text: daily.title, weight: "heavy" }]}
							className="lg:sticky lg:top-32"
						/>
					</div>
					<dl
						data-reveal=""
						className={cn(styles.index, "lg:col-span-8")}
					>
						{daily.items.map((item, index) => (
							<div
								key={item.title}
								className={cn(
									styles.row,
									"grid gap-y-2 py-6 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-x-10 md:py-7"
								)}
								style={{ "--i": index } as React.CSSProperties}
							>
								<dt
									className={cn(
										styles.rise,
										"font-display text-lg leading-snug font-medium tracking-[-0.005em] text-paper"
									)}
								>
									{item.title}
								</dt>
								<dd
									className={cn(
										styles.rise,
										"max-w-[62ch] text-[0.9375rem] leading-relaxed text-mist md:text-base"
									)}
								>
									<RichText text={item.body} />
								</dd>
							</div>
						))}
					</dl>
				</div>
			</Container>
		</Section>
	);
}
