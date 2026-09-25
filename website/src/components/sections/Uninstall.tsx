import {
	Container,
	Heading,
	IndexNumeral,
	Parallax,
	Reveal,
	RichText,
	Section,
	SectionIntro,
	Shape
} from "~/components/primitives";
import { uninstall } from "~/content";

/**
 * 07, Uninstalling. The heading and the promise (you stay signed in), the
 * principle that keeps it true without the uninstall script, then two
 * columns: what the script does, numbered in order, and what it leaves
 * alone, closed by what happens to your other accounts. One shape, after
 * the pinned privacy stage's six: the capsule off the top-right corner.
 */
export function Uninstall() {
	return (
		<Section
			id="uninstalling"
			labelledBy="uninstalling-heading"
		>
			{/* Far layer: cropped off the right edge, beside the heading's
			    short first line. It lags the scroll, so it rises clear of the
			    long second line while that is read; where it meets the
			    section's top edge it fades in rather than being cut by it. */}
			<div
				aria-hidden="true"
				className="shape-fade-top pointer-events-none absolute inset-0 -z-10"
			>
				<Parallax
					depth={180}
					rotate={-18}
					className="absolute top-[1%] right-[-38vw] w-[60vw] max-w-120 md:top-[-3%] md:right-[-8vw] md:w-[25vw]"
				>
					<Shape
						name="capsule"
						className="w-full opacity-25"
					/>
				</Parallax>
			</div>

			<Container>
				<SectionIntro
					id="uninstalling-heading"
					eyebrow={uninstall.eyebrow}
					heading={uninstall.heading}
				/>

				<div className="mt-12 grid gap-y-10 md:mt-16 lg:grid-cols-12 lg:gap-x-10">
					<Reveal className="lg:col-span-5">
						<p className="max-w-[46ch] text-lead text-mist">
							<RichText text={uninstall.lead} />
						</p>
					</Reveal>
					<Reveal
						delay={120}
						className="lg:col-span-6 lg:col-start-7"
					>
						<h3 className="font-display text-xl leading-snug font-medium text-paper md:text-2xl">
							{uninstall.principle.title}
						</h3>
						<div className="mt-5 grid max-w-[62ch] gap-4 text-base leading-relaxed text-bone md:text-[1.0625rem]">
							{uninstall.principle.body.map((paragraph) => (
								<p key={paragraph}>
									<RichText text={paragraph} />
								</p>
							))}
						</div>
					</Reveal>
				</div>

				{/*
				 * Two columns on wide screens: what the script does, numbered in
				 * order, and what it leaves alone. The headers share a row so
				 * both lists start on the same line; on phones each list
				 * follows its own header (source order).
				 */}
				<div className="mt-20 grid md:mt-28 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-x-10">
					<div className="lg:col-span-7 lg:row-start-1">
						{/* Sub-section titles take the title size, heavy, as
						    every one on the page does. */}
						<Heading
							as="h3"
							size="title"
							runs={[
								{
									text: uninstall.script.title,
									weight: "heavy"
								}
							]}
						/>
						<p className="mt-3 text-base text-mist">
							<RichText text={uninstall.script.lead} />
						</p>
					</div>
					<ol className="mt-10 border-b border-slate md:mt-12 lg:col-span-7 lg:row-start-2 lg:self-start">
						{uninstall.script.steps.map((step, index) => (
							<Reveal
								as="li"
								key={step.title}
								delay={index * 90}
								className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 border-t border-slate py-7 md:grid-cols-[3.5rem_minmax(0,1fr)] md:gap-x-6 md:py-9"
							>
								{/* The <ol> gives the order to assistive tech. */}
								<IndexNumeral
									value={index + 1}
									size="small"
								/>
								<div>
									<h4 className="font-display text-xl leading-snug font-normal text-paper md:text-2xl">
										{step.title}
									</h4>
									<p className="mt-3 max-w-[58ch] text-base leading-relaxed text-mist">
										<RichText text={step.body} />
									</p>
								</div>
							</Reveal>
						))}
					</ol>

					<Heading
						as="h3"
						size="title"
						runs={[
							{
								text: uninstall.leavesAlone.title,
								weight: "heavy"
							}
						]}
						className="mt-20 md:mt-24 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0"
					/>
					<div className="mt-10 md:mt-12 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:self-start">
						<ul className="border-b border-slate">
							{uninstall.leavesAlone.items.map((item, index) => (
								<Reveal
									as="li"
									key={item.title}
									delay={index * 90}
									className="border-t border-slate py-7 md:py-9"
								>
									<h4 className="font-display text-lg leading-snug font-normal text-paper md:text-xl">
										{item.title}
									</h4>
									<p className="mt-3 text-base leading-relaxed text-mist">
										<RichText text={item.body} />
									</p>
								</Reveal>
							))}
						</ul>
						<Reveal
							delay={180}
							className="mt-8 rounded-3xl bg-carbon p-6 ring-1 ring-slate ring-inset md:p-8"
						>
							<p className="text-eyebrow font-semibold text-ash uppercase">
								{uninstall.afterwards.label}
							</p>
							<p className="mt-4 text-base leading-relaxed text-bone md:text-[1.0625rem]">
								<RichText text={uninstall.afterwards.body} />
							</p>
						</Reveal>
					</div>
				</div>
			</Container>
		</Section>
	);
}
