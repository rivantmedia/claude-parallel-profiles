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
	SparkTrio
} from "~/components/primitives";
import { install } from "~/content";

/**
 * The closing moment before the footer, and the page's one big call to
 * action: the heading, the two buttons, the install command and two short
 * notes. The content keeps to the left seven columns; the right belongs to
 * the art: the project's three sparks, large, on a near layer that runs a
 * little ahead of the scroll and turns slowly, cropped by the right edge and
 * by the footer's rounded top, with one greyscale shape far behind them. On
 * phones the sparks rise from the bottom edge beneath the content, in room
 * the section's extra bottom padding keeps for them.
 */
export function Install() {
	const { eyebrow, heading, command, primary, secondary, notes } = install;

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
			    corner; below lg they sit low on the left, behind the sparks. */}
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

			{/* Near layer: the sparks, cropped off the right and bottom edges. */}
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
				<div className="max-w-[44rem]">
					<Eyebrow>{eyebrow.label}</Eyebrow>
					<Heading
						id="install-heading"
						className="mt-8 md:mt-10"
						runs={heading.runs}
					/>

					<Reveal className="mt-10 flex flex-wrap items-center gap-3 md:mt-14 md:gap-4">
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
						delay={120}
						className="mt-8"
					>
						<Command
							command={command.text}
							label={command.copyLabel}
						/>
					</Reveal>

					<Reveal
						as="ul"
						delay={200}
						className="mt-10 grid gap-6 border-t border-slate pt-8 sm:grid-cols-2 sm:gap-10"
					>
						{notes.map((note) => (
							<li key={note.text}>
								<p className="text-[0.9375rem] leading-relaxed text-mist">
									{note.text}
								</p>
								<ArrowLink
									link={note.link}
									className="mt-1"
								/>
							</li>
						))}
					</Reveal>
				</div>
			</Container>
		</Section>
	);
}
