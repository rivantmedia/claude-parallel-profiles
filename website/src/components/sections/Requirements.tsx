import {
	Accordion,
	Container,
	Heading,
	Parallax,
	Reveal,
	RichText,
	Section,
	SectionIntro,
	Shape,
	TextLink
} from "~/components/primitives";
import { PlatformTile } from "~/components/requirements/PlatformTile";
import { requirements } from "~/content";

/**
 * 08, Requirements. What it needs, as a definition list under hairlines;
 * where it runs, as tiles (the inert one says why); then its limitations in
 * the site's expandable list, one open at a time.
 */
export function Requirements() {
	const supported = requirements.platforms.rows.filter(
		(row) => row.status === "supported"
	);
	const inert = requirements.platforms.rows.filter(
		(row) => row.status !== "supported"
	);

	return (
		<Section
			id="requirements"
			labelledBy="requirements-heading"
		>
			{/* Far layer: cropped off the right edge beside the heading,
			    fading in where it meets the section's top edge. */}
			<div
				aria-hidden="true"
				className="shape-fade-top pointer-events-none absolute inset-0 -z-10"
			>
				<Parallax
					depth={200}
					rotate={16}
					className="absolute top-[2%] right-[-30vw] w-[70vw] max-w-130 md:right-[-10vw] md:w-[30vw]"
				>
					<Shape
						name="orbs"
						className="w-full opacity-25"
					/>
				</Parallax>
			</div>
			{/* Near layer: cropped off the left edge, in the column under
			    "Limitations" on wide screens. */}
			<Parallax
				depth={-160}
				rotate={-20}
				aria-hidden="true"
				className="absolute bottom-[4%] left-[-9vw] -z-10 hidden w-[24vw] max-w-100 lg:block"
			>
				<Shape
					name="pill"
					className="w-full -rotate-[32deg] opacity-25"
				/>
			</Parallax>

			<Container>
				<SectionIntro
					id="requirements-heading"
					eyebrow={requirements.eyebrow}
					heading={requirements.heading}
					lead={requirements.lead}
				/>

				{/* What it needs: label left, note right, hairlines between. */}
				<dl className="mt-14 border-b border-slate md:mt-20">
					{requirements.table.rows.map((row, index) => (
						<Reveal
							key={row.requirement}
							delay={index * 70}
							className="grid gap-y-2 border-t border-slate py-6 md:grid-cols-12 md:gap-x-10 md:py-8"
						>
							<dt className="font-display text-xl leading-snug font-normal text-paper md:col-span-5 md:text-2xl lg:col-span-4">
								<RichText text={row.requirement} />
							</dt>
							<dd className="max-w-[62ch] text-base leading-relaxed text-mist md:col-span-7 md:pt-1 lg:col-span-8">
								<RichText text={row.notes} />
								{row.link && (
									<>
										{" "}
										<TextLink
											href={row.link.href}
											external={row.link.external}
										>
											{row.link.label}
										</TextLink>
									</>
								)}
							</dd>
						</Reveal>
					))}
				</dl>

				{/* Where it runs. */}
				<div className="mt-20 md:mt-28">
					{/* Sub-section titles take the title size, heavy, as
					    every one on the page does ("Limitations" below). */}
					<Heading
						as="h3"
						size="title"
						runs={[
							{
								text: requirements.platforms.title,
								weight: "heavy"
							}
						]}
					/>
					{/* Two across, then three over two on small laptops (a row
					    of five would crush the notes), five from xl. */}
					<ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-6 xl:grid-cols-5">
						{supported.map((row) => (
							<PlatformTile
								key={row.platform}
								platform={row}
								className="sm:last:col-span-2 lg:col-span-2 lg:last:col-span-3 lg:nth-last-2:col-span-3 xl:col-span-1 xl:last:col-span-1 xl:nth-last-2:col-span-1"
							/>
						))}
					</ul>
					{inert.length > 0 && (
						<ul className="mt-3 grid gap-3 md:mt-4">
							{inert.map((row) => (
								<PlatformTile
									key={row.platform}
									platform={row}
									wide
								/>
							))}
						</ul>
					)}
					<p className="mt-8 max-w-[62ch] text-base leading-relaxed text-mist md:mt-10">
						<RichText text={requirements.platforms.note} />
					</p>
				</div>

				{/* What it doesn't do, and the trade-offs it makes on purpose. */}
				<div className="mt-24 grid gap-x-10 gap-y-10 md:mt-32 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<Heading
							as="h3"
							size="title"
							runs={[
								{
									text: requirements.limitations.title,
									weight: "heavy"
								}
							]}
							className="lg:sticky lg:top-32"
						/>
					</div>
					<Accordion
						name="limitations"
						items={requirements.limitations.items}
						className="lg:col-span-8"
					/>
				</div>
			</Container>
		</Section>
	);
}
