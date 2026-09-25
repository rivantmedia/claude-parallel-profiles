import { ArrowDownIcon } from "@phosphor-icons/react/ssr";
import { HeroHeadline } from "~/components/hero/HeroHeadline";
import { HeroSparks } from "~/components/hero/HeroSparks";
import {
	BrandGrid,
	Container,
	Parallax,
	PillButton,
	Shape
} from "~/components/primitives";
import { hero } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./Hero.module.css";

/** A page-load stagger for .fade-up, in ms. */
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

/**
 * The first screen, in rivant.in's hero pattern and nothing more: the faded
 * brand grid, the icon's rings cropped off the top-right corner on a far
 * depth, the three sparks each on their own depth and turn, the name as a
 * letter accordion, one sentence, and the two ways to get it. The content
 * eases out as the hero scrolls away.
 *
 * The section clips sideways only: the capsule at the lower left drifts on
 * down past the hero's bottom edge instead of being cut off along it.
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
							<HeroHeadline
								id="hero-heading"
								runs={hero.headline.runs}
								plain={hero.headline.plain}
								className={styles.headline}
							/>
						</div>
					</div>

					{/* Phones stack the sentence over the buttons. From md the
					    sentence takes the left and the buttons the right; tablets
					    stack the two pills, right edges aligned, since side by
					    side they don't fit their half. */}
					<div className="hero-exit mt-10 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end md:gap-x-10">
						<p
							className="fade-up max-w-[30ch] text-lead text-mist md:col-span-6 lg:col-span-5"
							style={delay(900)}
						>
							{hero.promise}
						</p>

						<div
							className="fade-up flex flex-wrap items-center gap-x-5 gap-y-4 md:col-span-6 md:justify-end md:gap-x-6 md:max-lg:flex-col md:max-lg:items-end lg:col-span-7"
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
					</div>
				</div>
			</Container>

			<div
				aria-hidden="true"
				className="absolute bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-slate md:block"
			>
				<span className="scroll-cue block h-full w-full bg-paper/70" />
			</div>
		</section>
	);
}
