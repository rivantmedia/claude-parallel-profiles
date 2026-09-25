import type { ContrastHeading } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./PrivacyStage.module.css";

/**
 * The pinned statement as the section's h2: one word per line, each word
 * taking its run's weight (heavy: black roman; light: extralight italic).
 * Words brighten in sequence as the track scrolls (`.reveal-scrub` in
 * globals.css), reading the track's progress through --track rather than
 * their own, because the stage they sit on is stuck in place.
 *
 * Split here rather than with SplitText so each word can carry its own
 * weight and its own place in the stagger (see .word in the CSS). Screen
 * readers get the sentence once, from the visually hidden copy.
 */
export function StatementLine({
	statement,
	id
}: {
	statement: ContrastHeading;
	id: string;
}) {
	const words = statement.runs.flatMap((run) =>
		run.text
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.map((text) => ({ text, weight: run.weight }))
	);

	return (
		<h2
			id={id}
			className={cn(styles.line, "reveal-scrub")}
			style={{ "--word-total": words.length } as React.CSSProperties}
		>
			<span className="sr-only select-none">{statement.plain}</span>
			<span aria-hidden="true">
				{words.map((word, index) => (
					<span key={index}>
						{/* Collapses between the blocks; keeps copied text spaced. */}
						{index > 0 && " "}
						<span
							className={cn(
								"reveal-word",
								styles.word,
								word.weight === "light" && styles.light
							)}
							data-word={index + 1}
							style={
								{ "--word-index": index } as React.CSSProperties
							}
						>
							{word.text}
						</span>
					</span>
				))}
			</span>
		</h2>
	);
}
