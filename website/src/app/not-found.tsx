import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import {
	BrandGrid,
	Container,
	Eyebrow,
	Parallax,
	PillButton,
	Shape,
	Spark
} from "~/components/primitives";
import { baseOpenGraph } from "~/lib/metadata";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
	title: "Page not found",
	// The root layout's canonical is the homepage; a missing page has none.
	alternates: { canonical: null },
	// Same card, but no og:url: "./" would resolve to Next's /_not-found/.
	openGraph: baseOpenGraph
};

// Each numeral rises on its own beat, like the hero headline's letters. The
// 0 is the hole where the page should be; a spark sits in it.
const NUMERALS = [
	{ char: "4", className: "font-black", delay: 120 },
	{
		char: "0",
		className: "relative font-extralight text-mist italic",
		delay: 220,
		spark: true
	},
	{ char: "4", className: "font-black", delay: 320 }
];

/**
 * The 404 page (exported as out/404.html, which GitHub Pages serves for any
 * missing path). A poster: numerals low on the left, a shape framing them
 * from the right, and the way home.
 */
export default function NotFound() {
	return (
		<main
			id="main-content"
			tabIndex={-1}
			className="relative isolate flex min-h-[100dvh] flex-col overflow-clip pt-32 pb-16 md:pt-40 md:pb-20 short:pt-20 short:pb-6"
		>
			<BrandGrid className="-z-20" />

			<Parallax
				depth={-240}
				rotate={18}
				aria-hidden="true"
				className="absolute top-[18vh] -right-[30vw] -z-10 w-[84vw] max-w-[760px] md:top-[13vh] md:-right-[7vw] md:w-[36vw]"
			>
				{/* Not `priority`: the first screen here is the numerals, which
				    are text, and as part of the root not-found boundary a
				    preload would be added to every page's head. */}
				<Shape
					name="knot"
					className="w-full opacity-45"
				/>
			</Parallax>

			<Container className="relative flex flex-1 flex-col justify-end">
				{/* The same eyebrow every page opens with; the h1 below already
				    names the page for screen readers. */}
				<div
					aria-hidden="true"
					className="fade-up mb-auto pb-16 short:pb-4"
					style={{ "--delay": "60ms" } as React.CSSProperties}
				>
					<Eyebrow>Page not found</Eyebrow>
				</div>

				{/* Sized by the height too, so on a short screen (a phone on its
				    side) the way home stays in the first screen. */}
				<h1 className="font-display text-[clamp(6rem,min(30vw,42svh),26rem)] leading-[0.8] tracking-[-0.06em] text-paper short:text-[clamp(4.5rem,min(30vw,30svh),26rem)]">
					{/* The glyphs' boxes reach down past the line; they must never
					    take a click meant for the buttons below. */}
					<span
						aria-hidden="true"
						className="pointer-events-none flex"
					>
						{NUMERALS.map((numeral, index) => (
							<span
								key={index}
								className={cn("fade-up", numeral.className)}
								style={
									{
										"--delay": `${numeral.delay}ms`
									} as React.CSSProperties
								}
							>
								{numeral.char}
								{numeral.spark && (
									<Spark className="absolute top-1/2 left-1/2 size-[0.2em] -translate-x-[40%] -translate-y-[42%]" />
								)}
							</span>
						))}
					</span>
					<span className="sr-only">Page not found</span>
				</h1>

				<div className="relative z-10 mt-10 flex flex-wrap items-center gap-x-10 gap-y-8 md:mt-12 short:mt-6 short:gap-y-4">
					<p
						className="fade-up max-w-[32ch] text-lead text-pretty text-mist"
						style={{ "--delay": "520ms" } as React.CSSProperties}
					>
						The page you were looking for has moved, or never
						existed.
					</p>
					<div
						className="fade-up flex flex-wrap items-center gap-4"
						style={{ "--delay": "640ms" } as React.CSSProperties}
					>
						{/* Arrows say where they go: back, and on to another
						    page. The up-right arrow means a new tab. */}
						<PillButton
							href="/"
							magnetic
							icon={
								<ArrowLeftIcon
									weight="light"
									className="size-4"
								/>
							}
						>
							Back to home
						</PillButton>
						<PillButton
							href="/changelog/"
							variant="ghost"
							icon={
								<ArrowRightIcon
									weight="light"
									className="size-4"
								/>
							}
						>
							Read the changelog
						</PillButton>
					</div>
				</div>
			</Container>
		</main>
	);
}
