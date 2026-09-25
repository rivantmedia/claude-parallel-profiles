import { ArrowDownIcon } from "@phosphor-icons/react/ssr";
import { Fragment } from "react";
import { HeroHeadline } from "~/components/hero/HeroHeadline";
import { HeroSparks } from "~/components/hero/HeroSparks";
import {
	BrandGrid,
	Command,
	Container,
	Eyebrow,
	Parallax,
	PillButton,
	Shape,
	TextLink
} from "~/components/primitives";
import { hero, installCommand } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./Hero.module.css";

/** A page-load stagger for .fade-up, in ms. */
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

/**
 * "Linux · macOS · WSL …" in small tracked Inter, in normal case so the
 * product names keep their own spelling (macOS, not MACOS); screen readers
 * get a sentence.
 * Every item carries its own separator, on the side that faces the ragged
 * edge, and the list is pulled that far past the clipped edge, so a wrapped
 * line never starts (or, right-aligned, ends) with a stray dot.
 */
function Platforms({
	align = "start",
	className
}: {
	align?: "start" | "end";
	className?: string;
}) {
	const dot = (
		<span className="inline-block w-[2.2em] text-center text-smoke">·</span>
	);
	return (
		<p
			className={cn(
				"overflow-hidden text-[0.8125rem] leading-loose font-medium tracking-[0.03em] text-ash",
				className
			)}
		>
			<span className="sr-only select-none">{hero.platforms.text}</span>
			<span
				aria-hidden="true"
				className={cn(
					"flex flex-wrap",
					align === "start"
						? "-ml-[2.2em]"
						: "-mr-[2.2em] justify-end"
				)}
			>
				{hero.platforms.items.map((item) => (
					<span
						key={item}
						className="whitespace-nowrap"
					>
						{align === "start" && dot}
						{item}
						{align === "end" && dot}
					</span>
				))}
			</span>
		</p>
	);
}

/**
 * The figures line over the name, as rivant.in sets its studio figures: each
 * value a step brighter in tabular numerals, the nouns in mist, and a
 * quieter tail. Screen readers get the plain sentence.
 */
function Figures() {
	const { items, tail, text } = hero.figures;
	return (
		<p
			className="fade-up mb-5 font-display text-[clamp(1.0625rem,1.3vw,1.3rem)] leading-[1.35] font-light text-wrap text-mist md:mb-7"
			style={delay(250)}
		>
			<span className="sr-only select-none">{text}</span>
			<span aria-hidden="true">
				{items.map((item, index) => (
					<Fragment key={index}>
						{index > 0 &&
							(index === items.length - 1 ? " and " : ", ")}
						{item.before && <>{item.before} </>}
						<span className="whitespace-nowrap">
							<span className="font-medium text-paper tabular-nums">
								{item.value}
							</span>
							{item.noun && <> {item.noun}</>}
						</span>
					</Fragment>
				))}{" "}
				<span className="ml-[0.35em] text-[0.74em] whitespace-nowrap text-ash italic">
					{tail}
				</span>
			</span>
		</p>
	);
}

/**
 * The first screen, in rivant.in's hero pattern: the faded brand grid, the
 * icon's rings cropped off the top-right corner on a far depth, the three
 * sparks each on their own depth and turn, the name as a letter accordion,
 * and the content easing out as the hero scrolls away. At 1440x900 all of it,
 * calls to action and install command included, fits in the first screen.
 *
 * The section clips sideways only: the capsule at the lower left drifts on
 * down behind the band as the page scrolls, instead of being cut off along
 * the hero's bottom edge.
 */
export function Hero() {
	return (
		<section
			id="top"
			aria-labelledby="hero-heading"
			className="relative isolate flex min-h-[min(100dvh,72rem)] flex-col overflow-x-clip pt-28 pb-8 md:pt-36 md:pb-24 short:pt-24"
		>
			<BrandGrid className="-z-20" />

			{/* The icon's rings, turned over and cropped off the top-right corner
			    as on the icon's tile, on the farthest depth. */}
			<Parallax
				depth={180}
				blur={3}
				rotate={10}
				aria-hidden="true"
				className="absolute -top-[16vw] -right-[40vw] -z-10 w-[96vw] max-w-[820px] md:-top-[17vw] md:-right-[12vw] md:w-[46vw]"
			>
				<Shape
					name="rings"
					priority
					className="w-full rotate-180 opacity-25"
				/>
			</Parallax>

			{/* A dim, soft capsule cropped off the lower-left edge, on a far
			    depth. */}
			<Parallax
				depth={220}
				blur={6}
				rotate={-22}
				aria-hidden="true"
				className="absolute -bottom-[16vh] -left-[10vw] -z-10 hidden w-[17vw] max-w-[380px] md:block"
			>
				<Shape
					name="capsule"
					className="w-full opacity-20 blur-[2px]"
				/>
			</Parallax>

			<Container className="relative flex flex-1 flex-col">
				<div
					className="fade-up flex items-start justify-between gap-8 lg:items-center"
					style={delay(100)}
				>
					<div className="flex flex-wrap items-center gap-2">
						<Eyebrow live>{hero.eyebrow.label}</Eyebrow>
						<Eyebrow className="text-ash ring-slate">
							{hero.eyebrow.tag}
						</Eyebrow>
					</div>
					<Platforms
						align="end"
						className="hidden max-w-[34rem] lg:block"
					/>
				</div>

				{/* The block scrolls away as one (--progress set here, read by
				    both .hero-exit halves); the sparks sit outside both halves,
				    so they stay and drift while the words leave. */}
				<div
					data-progress=""
					className={cn("mt-auto", styles.content)}
				>
					<div className="relative">
						{/* The art arrives with the name, not ahead of it. */}
						<HeroSparks
							className={cn("fade-up", styles.sparks)}
							style={delay(600)}
						/>
						<div className="hero-exit">
							<Figures />
							<HeroHeadline
								id="hero-heading"
								runs={hero.headline.runs}
								plain={hero.headline.plain}
								className={styles.headline}
							/>
						</div>
					</div>

					{/* Phones stack everything. Tablets set the promise beside
					    the buttons and give the command the full width (the
					    right column's wrapper is `contents` there, so its two
					    children are grid items of their own). From lg the
					    buttons and the command share the right column. */}
					<div className="hero-exit mt-10 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end md:gap-x-10">
						<div className="md:col-span-6 lg:col-span-5">
							<p
								className="fade-up max-w-[40ch] text-lead text-mist"
								style={delay(900)}
							>
								{hero.promise}
							</p>
							<p
								className="fade-up mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-ash"
								style={delay(980)}
							>
								{hero.support}
							</p>
						</div>

						<div className="contents lg:col-span-7 lg:flex lg:flex-col lg:items-end lg:gap-5">
							{/* Tablets stack the two pills, right edges aligned:
							    side by side they don't fit their half. */}
							<div
								className="fade-up flex flex-wrap items-center gap-x-5 gap-y-4 md:col-span-6 md:justify-end md:gap-x-6 md:max-lg:flex-col md:max-lg:items-end"
								style={delay(1050)}
							>
								<PillButton
									href={hero.primary.href}
									magnetic
								>
									{hero.primary.label}
								</PillButton>
								<PillButton
									href={hero.secondary.href}
									variant="ghost"
								>
									{hero.secondary.label}
								</PillButton>
								{/* Left out from tablet to small-laptop widths, where a
								    third call to action would crowd the row. */}
								<a
									href={hero.tertiary.href}
									className="group inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-mist transition-colors duration-300 ease-spring hover:text-paper md:max-xl:hidden"
								>
									{hero.tertiary.label}
									<ArrowDownIcon
										weight="light"
										aria-hidden="true"
										className="size-4 transition-transform duration-500 ease-spring group-hover:translate-y-0.5"
									/>
								</a>
							</div>

							<div
								className="fade-up w-full md:col-span-12 lg:w-auto lg:max-w-full"
								style={delay(1150)}
							>
								<Command
									command={installCommand}
									label="Copy the install command"
								/>
								<p className="mt-3 text-sm leading-relaxed text-ash md:pl-5">
									{hero.requires.before}
									<TextLink
										href={hero.requires.link.href}
										external={hero.requires.link.external}
									>
										{hero.requires.link.label}
									</TextLink>
									{hero.requires.after}
								</p>
								<Platforms className="mt-5 md:ml-5 lg:hidden" />
							</div>
						</div>
					</div>
				</div>
			</Container>

			{/* Faint vertical type at the right, in the style font, held just
			    outside the 1440px column so it stays beside the content on
			    wide screens. From xl only: below that it crowds the sparks. */}
			<Parallax
				depth={320}
				aria-hidden="true"
				className="pointer-events-none absolute top-[42%] right-[max(1rem,calc((100vw_-_1440px)/2_-_1.5rem))] hidden xl:block"
			>
				<span className="block origin-center translate-x-1/2 rotate-90 font-style text-[1.7rem] whitespace-nowrap text-ash/70 uppercase">
					{hero.sideline}
				</span>
			</Parallax>

			<div
				aria-hidden="true"
				className="absolute bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-slate md:block"
			>
				<span className="scroll-cue block h-full w-full bg-paper/70" />
			</div>
		</section>
	);
}
