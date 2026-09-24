import {
	BrandGrid,
	Container,
	Eyebrow,
	Parallax,
	PillButton,
	Shape,
	SparkTrio
} from "~/components/primitives";
import { siteConfig } from "~/config/site";

const LINES = ["Claude Parallel", "Profiles"];

/**
 * STUB, to be replaced by the section builder. Keep the export name and the
 * id "top" (the footer's "Back to top" and the skip logic use it). It shows
 * the house hero pattern: faded brand grid, shapes cropped off the edges on
 * parallax depths, the sub-brand's sparks, letters rising in on load, and
 * the content easing out as the hero scrolls away.
 */
export function Hero() {
	let letterIndex = 0;

	return (
		<section
			id="top"
			aria-labelledby="hero-heading"
			className="relative isolate flex min-h-[100dvh] flex-col overflow-clip pt-28 pb-8 md:pt-36 md:pb-10"
		>
			<BrandGrid className="-z-20" />

			{/* The icon's rings, cropped off the top-right corner. */}
			<Parallax
				depth={-220}
				rotate={14}
				aria-hidden="true"
				className="absolute -top-[8vh] -right-[34vw] -z-10 w-[92vw] max-w-[760px] md:-top-[14vh] md:-right-[8vw] md:w-[44vw]"
			>
				<Shape
					name="rings"
					priority
					className="w-full rotate-180 opacity-30"
				/>
			</Parallax>
			{/* The sub-brand's mark, on its own nearer depth. */}
			<Parallax
				depth={-160}
				aria-hidden="true"
				className="absolute top-[24vh] right-[5vw] -z-10 w-[38vw] max-w-[220px] md:top-[20vh] md:right-[12vw] md:w-[22vw] md:max-w-[340px]"
			>
				<SparkTrio
					turn
					className="w-full"
				/>
			</Parallax>

			<Container className="relative flex flex-1 flex-col">
				<div
					className="fade-up"
					style={{ "--delay": "100ms" } as React.CSSProperties}
				>
					<Eyebrow live>{siteConfig.umbrella}</Eyebrow>
				</div>

				<div
					data-progress=""
					className="hero-exit mt-auto pt-24"
				>
					<h1
						id="hero-heading"
						aria-label={LINES.join(" ")}
						className="font-display text-hero text-paper"
					>
						{LINES.map((line, lineIndex) => (
							<span
								key={line}
								aria-hidden="true"
								className={
									lineIndex === 0
										? "block text-mist"
										: "block"
								}
							>
								{line.split(" ").map((word, wordIndex) => (
									<span key={word}>
										{wordIndex > 0 && " "}
										<span className="inline-block whitespace-nowrap">
											{[...word].map((letter) => {
												const index = letterIndex++;
												return (
													<span
														key={index}
														className="hero-char"
														style={
															{
																"--i": index,
																"--w":
																	lineIndex ===
																	0
																		? 300
																		: 800
															} as React.CSSProperties
														}
													>
														{letter}
													</span>
												);
											})}
										</span>
									</span>
								))}
							</span>
						))}
					</h1>

					<div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
						<p
							className="fade-up max-w-[40ch] text-lead text-mist md:col-span-6"
							style={
								{ "--delay": "900ms" } as React.CSSProperties
							}
						>
							{siteConfig.description}
						</p>
						<div
							className="fade-up flex flex-wrap items-center gap-x-4 gap-y-4 md:col-span-6 md:justify-end"
							style={
								{ "--delay": "1050ms" } as React.CSSProperties
							}
						>
							<PillButton
								href={siteConfig.links.marketplace}
								magnetic
							>
								Install from Marketplace
							</PillButton>
							<PillButton
								href={siteConfig.links.github}
								variant="ghost"
							>
								View on GitHub
							</PillButton>
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
