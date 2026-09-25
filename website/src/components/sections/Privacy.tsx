import {
	Container,
	IndexNumeral,
	PillButton,
	Reveal,
	RichText,
	Section
} from "~/components/primitives";
import { PrivacyStage } from "~/components/privacy/PrivacyStage";
import { privacy } from "~/content";

/**
 * 06, Privacy and your data. The statement is pinned and set huge while it
 * is read (PrivacyStage); after it, the policy points in a grid, each under a
 * slate hairline, opened by the lead and a link to the source that proves
 * them. The Section's top padding is dropped: the stage is its own space.
 */
export function Privacy() {
	return (
		<Section
			id="privacy"
			labelledBy="privacy-heading"
			className="pt-0 md:pt-0"
		>
			<PrivacyStage
				privacy={privacy}
				headingId="privacy-heading"
			/>

			<Container className="pt-10 md:pt-16">
				<div className="grid gap-x-10 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
					<Reveal className="border-t border-slate pt-8 md:col-span-2 lg:col-span-1">
						<p className="max-w-[40ch] text-lead text-mist">
							{privacy.lead}
						</p>
						<PillButton
							href={privacy.source.href}
							external={privacy.source.external}
							variant="ghost"
							className="mt-8"
						>
							{privacy.source.label}
						</PillButton>
					</Reveal>

					{privacy.points.map((point, index) => (
						<Reveal
							key={point.title}
							as="article"
							// Rows arrive together; a short stagger across each row.
							delay={((index + 1) % 3) * 90}
							className="border-t border-slate pt-8"
						>
							<IndexNumeral
								value={index + 1}
								size="small"
								className="block"
							/>
							<h3 className="mt-5 font-display text-xl leading-snug font-normal text-paper md:text-2xl">
								{point.title}
							</h3>
							<p className="mt-4 max-w-[52ch] text-base leading-relaxed text-mist">
								<RichText text={point.body} />
							</p>
						</Reveal>
					))}
				</div>
			</Container>
		</Section>
	);
}
