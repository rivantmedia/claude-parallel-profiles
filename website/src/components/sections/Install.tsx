import {
	ArrowLink,
	BrandGrid,
	Command,
	Container,
	Eyebrow,
	Heading,
	Parallax,
	PillButton,
	Reveal,
	Section,
	Shape,
	SparkTrio,
	TextLink
} from "~/components/primitives";
import { install } from "~/content";

/**
 * The closing moment before the footer, and the page's one big call to
 * action. The content keeps to the left seven columns; the right belongs to
 * the art: the project's three sparks, large, on a near layer that runs a
 * little ahead of the scroll and turns slowly, cropped by the right edge and
 * by the footer's rounded top, with one greyscale shape far behind them. On phones the
 * sparks rise from the bottom edge beneath the content, in room the section's
 * extra bottom padding keeps for them. The sparks are the only accent here.
 */
export function Install() {
	const {
		eyebrow,
		heading,
		body,
		command,
		primary,
		secondary,
		requires,
		rate
	} = install;

	return (
		<Section
			id={install.id}
			labelledBy="install-heading"
			// Clipped sideways only: the sparks run on past the bottom edge and
			// the footer, painted over them, crops them along its rounded top.
			className="overflow-visible overflow-x-clip pb-[19rem] sm:pb-[24rem] md:pb-[24rem] lg:pb-44"
		>
			<BrandGrid className="-z-20 [mask-image:radial-gradient(ellipse_80%_70%_at_28%_30%,black_10%,transparent_72%)]" />

			{/* Far layer: the orbs, lagging the scroll and softened with
			    distance. From lg they frame the heading from the top-right
			    corner. Below lg the content runs full width, so they sit low
			    on the left instead, behind the sparks, cropped by the left
			    and bottom edges. One shape either way. */}
			<Parallax
				depth={200}
				rotate={-12}
				blur={4}
				aria-hidden="true"
				className="absolute -top-[4%] -right-[14vw] -z-10 hidden w-[52vw] max-w-[880px] lg:block"
			>
				<Shape
					name="orbs"
					className="w-full -rotate-[18deg] opacity-20"
				/>
			</Parallax>
			<Parallax
				depth={120}
				rotate={-10}
				blur={3}
				aria-hidden="true"
				className="absolute -bottom-6 -left-[38vw] -z-10 w-[96vw] sm:-left-[24vw] sm:w-[60vw] lg:hidden"
			>
				<Shape
					name="orbs"
					className="w-full rotate-[14deg] opacity-20"
				/>
			</Parallax>

			{/* Near layer: the sparks, cropped off the right and bottom edges.
			    Below lg they rise beneath the content, in the room the extra
			    bottom padding keeps; from lg they sit beside it. */}
			<Parallax
				depth={-160}
				rotate={-10}
				aria-hidden="true"
				className="absolute -right-[20vw] -bottom-10 -z-10 w-[90vw] sm:-right-[8vw] sm:-bottom-16 sm:w-[64vw] sm:max-w-[440px] lg:-right-[6vw] lg:-bottom-[4%] lg:w-[46vw] lg:max-w-[720px]"
			>
				<SparkTrio
					turn
					className="w-full"
				/>
			</Parallax>

			<Container>
				<Eyebrow>{eyebrow.label}</Eyebrow>
				<Heading
					id="install-heading"
					className="mt-8 md:mt-10"
					runs={heading.runs}
				/>

				<div className="mt-10 max-w-[44rem] md:mt-14 lg:max-w-none">
					<div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
						<div className="lg:col-span-7">
							<Reveal>
								<p className="max-w-[46ch] text-lead text-pretty text-mist">
									{body}
								</p>
							</Reveal>

							<Reveal
								delay={120}
								className="mt-10 flex flex-wrap items-center gap-3 md:mt-12 md:gap-4"
							>
								<PillButton
									href={primary.href}
									external={primary.external}
									magnetic
								>
									{primary.label}
								</PillButton>
								<PillButton
									href={secondary.href}
									external={secondary.external}
									variant="ghost"
								>
									{secondary.label}
								</PillButton>
							</Reveal>

							<Reveal
								delay={200}
								className="mt-12 max-w-[44rem] md:mt-14"
							>
								<p
									id="install-command"
									className="text-eyebrow font-semibold text-ash uppercase"
								>
									{command.label}
								</p>
								<div
									role="group"
									aria-labelledby="install-command"
								>
									<Command
										command={command.text}
										label={command.copyLabel}
										className="mt-4"
									/>
								</div>
							</Reveal>

							<Reveal
								delay={260}
								className="mt-14 grid max-w-[44rem] gap-8 border-t border-slate pt-8 sm:grid-cols-2 sm:gap-10 md:mt-16"
							>
								<p className="text-[0.9375rem] leading-relaxed text-pretty text-mist">
									{requires.before}{" "}
									<TextLink
										href={requires.link.href}
										external={requires.link.external}
									>
										{requires.link.label}
									</TextLink>
									{requires.after}
								</p>
								<div>
									<p className="text-[0.9375rem] leading-relaxed text-pretty text-mist">
										{rate.text}
									</p>
									<ArrowLink
										link={rate.link}
										className="mt-2"
									/>
								</div>
							</Reveal>
						</div>
					</div>
				</div>
			</Container>
		</Section>
	);
}
