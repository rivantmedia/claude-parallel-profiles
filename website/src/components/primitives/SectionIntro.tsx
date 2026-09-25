import type {
	ContrastHeading,
	Eyebrow as EyebrowContent,
	Rich
} from "~/content";
import { cn } from "~/lib/utils";
import { RichText } from "./Code";
import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

/**
 * A section's opening, as the page sets every one: the eyebrow pill with its
 * index, the heading in weight contrast at display size (heavy words first)
 * and a lead in mist. The lead reveals word by word when it's plain text;
 * one with code spans rises as a block, so the code chips stay whole.
 */
export function SectionIntro({
	id,
	eyebrow,
	heading,
	lead,
	className
}: {
	/** The heading's id, which the section is labelled by. */
	id: string;
	eyebrow: EyebrowContent;
	heading: ContrastHeading;
	lead?: Rich;
	className?: string;
}) {
	return (
		<div className={className}>
			<Eyebrow index={eyebrow.index}>{eyebrow.label}</Eyebrow>
			<Heading
				id={id}
				runs={heading.runs}
				className="mt-8 md:mt-10"
			/>
			{lead && (
				<Lead
					text={lead}
					className="mt-8 md:mt-10"
				/>
			)}
		</div>
	);
}

/** Lead-size copy in mist, at most 46 characters wide. */
function Lead({ text, className }: { text: Rich; className?: string }) {
	const classes = cn(
		"max-w-[46ch] text-lead text-pretty text-mist",
		className
	);

	if (text.includes("`")) {
		return (
			<Reveal
				delay={150}
				className={classes}
			>
				<p>
					<RichText text={text} />
				</p>
			</Reveal>
		);
	}

	return (
		<SplitText
			delay={150}
			className={classes}
		>
			{text}
		</SplitText>
	);
}
