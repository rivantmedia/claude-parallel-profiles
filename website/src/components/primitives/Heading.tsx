import { Fragment } from "react";
import { cn } from "~/lib/utils";
import { SplitText } from "./SplitText";

/** One run of a heading: heavy (extrabold, paper) or light (extralight italic, mist). */
type HeadingRun = {
	text: string;
	weight: "heavy" | "light";
};

const SIZE = {
	hero: "text-hero",
	display: "text-display",
	title: "text-title"
} as const;

const WEIGHT: Record<HeadingRun["weight"], string> = {
	heavy: "font-extrabold text-paper",
	light: "font-extralight text-mist italic"
};

/**
 * A heading in the brand's weight contrast: extrabold Montserrat against
 * extralight italic Montserrat in mist, heavy words first. Each run is its
 * own line (`inline` keeps them on one line, wrapping naturally) and reveals
 * word by word, the runs staggered. Screen readers get the sentence once.
 *
 *   <Heading id="idea-heading" runs={[
 *     { text: "One account", weight: "heavy" },
 *     { text: "per window", weight: "light" }
 *   ]} />
 */
export function Heading({
	runs,
	as: Tag = "h2",
	size = "display",
	id,
	inline = false,
	scrub = false,
	delay = 0,
	entrance = "view",
	className
}: {
	runs: readonly HeadingRun[];
	as?: "h1" | "h2" | "h3";
	size?: keyof typeof SIZE;
	id?: string;
	/** Runs flow on one line instead of one line each. */
	inline?: boolean;
	/** Brighten with the scroll instead of revealing once. */
	scrub?: boolean;
	/** Delay before the first run, in ms. */
	delay?: number;
	/** "load" for a page's first screen (see SplitText). */
	entrance?: "view" | "load";
	className?: string;
}) {
	return (
		<Tag
			id={id}
			className={cn("font-display text-paper", SIZE[size], className)}
		>
			<span className="sr-only select-none">
				{runs.map((run) => run.text).join(" ")}
			</span>
			{runs.map((run, index) => (
				<Fragment key={index}>
					{inline && index > 0 && " "}
					<SplitText
						as="span"
						presentational
						scrub={scrub}
						entrance={entrance}
						delay={delay + index * 140}
						className={cn(
							inline ? "inline" : "block",
							// Light italics lean right; a hair of room keeps
							// their last letter clear of the next run.
							run.weight === "light" && "pr-[0.06em]",
							WEIGHT[run.weight]
						)}
					>
						{run.text}
					</SplitText>
				</Fragment>
			))}
		</Tag>
	);
}
