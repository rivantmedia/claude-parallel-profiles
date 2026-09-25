import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import {
	Container,
	IndexNumeral,
	Kbd,
	NEW_TAB_HINT,
	Parallax,
	Reveal,
	RichText,
	Section,
	SectionIntro,
	Shape
} from "~/components/primitives";
import { switching } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./Switching.module.css";

/** Small tracked labels are Inter SemiBold, even when they are headings. */
const eyebrowLabel = "font-sans text-eyebrow font-semibold text-ash uppercase";

/**
 * Copy with backtick code spans, where the step's shortcut ("Cmd+Q") is set
 * as keycaps rather than words.
 */
function StepText({ text }: { text: string }) {
	const { shortcut } = switching;
	const keys = shortcut.split("+");
	return (
		<>
			{text.split(shortcut).map((part, index) => (
				<span key={index}>
					{index > 0 && (
						<span className="whitespace-nowrap">
							{keys.map((key, keyIndex) => (
								<span key={key}>
									{keyIndex > 0 && "+"}
									<Kbd>{key}</Kbd>
								</span>
							))}
						</span>
					)}
					<RichText text={part} />
				</span>
			))}
		</>
	);
}

/**
 * 09, for readers coming from the original extension. A carbon band (rounded
 * like the demo's) so it reads as a side-note to the story rather than the
 * story itself. On wide screens the lead, the macOS note and the aside take
 * the left column, the steps the right; the grid lifts the notes up beside
 * the steps, so in source order (and on phones) the steps come straight
 * after the lead. It closes on a signature line crediting the original's
 * author.
 */
export function Switching() {
	const { eyebrow, heading, lead, steps, macos, why, credit } = switching;

	return (
		<Section
			id={switching.id}
			labelledBy="switching-heading"
			className="rounded-[1.5rem] bg-carbon shadow-[inset_0_1px_0_0_rgb(255_255_255/0.07)] md:rounded-[2rem]"
		>
			{/* Far layer: the pill, cropped off the band's top-right corner,
			    beside the heading. Phones have no room there; the pill peeks
			    from behind the aside card instead (below). Far enough off the
			    corner, at every width, to stay clear of the heading's last
			    letters as it drifts. */}
			<Parallax
				depth={160}
				rotate={-10}
				aria-hidden="true"
				className="absolute top-[1%] -right-[19vw] -z-10 hidden w-[36vw] max-w-[680px] md:block"
			>
				<Shape
					name="pill"
					className="w-full -rotate-[28deg] opacity-25"
				/>
			</Parallax>

			<Container>
				<SectionIntro
					id="switching-heading"
					eyebrow={eyebrow}
					heading={heading}
				/>

				<div className="mt-12 grid gap-y-14 md:mt-20 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:gap-y-12">
					<Reveal
						delay={120}
						className="lg:col-span-6 lg:row-start-1 xl:col-span-5"
					>
						<p className="max-w-[46ch] text-lead text-pretty text-mist">
							<RichText text={lead} />
						</p>
					</Reveal>

					<ol
						aria-label={switching.stepsLabel}
						className="border-b border-slate lg:col-span-6 lg:col-start-7 lg:row-span-3 lg:row-start-1 xl:col-span-7 xl:col-start-6"
					>
						{steps.map((step, index) => (
							<Reveal
								as="li"
								key={step.title}
								delay={index * 90}
								className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-slate py-7 md:grid-cols-[5.5rem_1fr] md:gap-x-6 md:py-9"
							>
								{/* The <ol> already says the order to assistive tech. */}
								<IndexNumeral value={index + 1} />
								<div className="min-w-0">
									<h3 className="font-display text-xl leading-snug font-normal text-paper md:text-2xl">
										{step.title}
									</h3>
									<p className="mt-3 max-w-[54ch] leading-relaxed text-bone">
										<StepText text={step.body} />
									</p>
								</div>
							</Reveal>
						))}
					</ol>

					<Reveal
						delay={160}
						className="border-t border-slate pt-8 lg:col-span-6 lg:row-start-2 xl:col-span-5"
					>
						<h3 className={eyebrowLabel}>{macos.title}</h3>
						<p className="mt-4 max-w-[46ch] leading-relaxed text-bone">
							<RichText text={macos.body} />
						</p>
					</Reveal>

					<Reveal
						as="div"
						delay={220}
						className="relative isolate lg:col-span-6 lg:row-start-3 lg:self-start xl:col-span-5"
					>
						{/* Phones: the pill peeks from behind the card's top-right
						    corner, cropped by the band's edge, clear of any text. */}
						<Parallax
							depth={-60}
							rotate={-12}
							aria-hidden="true"
							className="absolute -top-8 -right-24 -z-10 w-72 md:hidden"
						>
							<Shape
								name="pill"
								className="w-full -rotate-[28deg] opacity-25"
							/>
						</Parallax>
						<aside
							aria-labelledby="switching-why"
							className="rounded-3xl bg-graphite p-6 ring-1 ring-slate ring-inset md:p-8"
						>
							<h3
								id="switching-why"
								className="font-display text-xl font-extralight text-paper italic md:text-2xl"
							>
								{why.title}
							</h3>
							<p className="mt-4 max-w-[48ch] text-[0.9375rem] leading-relaxed text-mist">
								<RichText text={why.body} />
							</p>
						</aside>
					</Reveal>
				</div>

				{/* The sign-off: the credit, then the author's name as a signature. */}
				<div className="mt-16 flex flex-col gap-6 border-t border-slate pt-8 md:mt-24 md:flex-row md:items-center md:justify-between md:gap-10">
					<p className="max-w-[62ch] text-sm leading-relaxed text-pretty text-ash">
						{credit.text}
					</p>
					<a
						href={credit.link.href}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							styles.signature,
							"group inline-flex min-h-11 shrink-0 items-center gap-2.5 self-start rounded-full text-eyebrow font-semibold whitespace-nowrap text-ash uppercase transition-[color] duration-300 ease-out-expo hover:text-mist min-[22.5rem]:gap-3.5 md:self-auto"
						)}
					>
						<span className="text-paper">{credit.name}</span>
						<span
							aria-hidden="true"
							className={styles.hairline}
						/>
						<span>{credit.role}</span>
						<ArrowUpRightIcon
							weight="light"
							aria-hidden="true"
							className="size-3.5 transition-[color,translate] duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper"
						/>
						<span className="sr-only">
							, {credit.link.label} {NEW_TAB_HINT}
						</span>
					</a>
				</div>
			</Container>
		</Section>
	);
}
