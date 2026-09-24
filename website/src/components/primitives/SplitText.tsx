import { cn } from "~/lib/utils";

/**
 * Past this many words a one-shot reveal becomes a quick wash: people start
 * reading a paragraph as soon as it arrives, so it can't take seconds to land
 * (see `.reveal-long` in globals.css).
 */
const LONG_TEXT_WORDS = 16;

type SplitTextProps = {
	as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
	children: string;
	/** Reveal granularity. */
	by?: "word" | "char";
	/** Tie the reveal to scroll position instead of playing once on entry. */
	scrub?: boolean;
	/** Extra delay before a one-shot reveal starts, in ms. */
	delay?: number;
	className?: string;
	id?: string;
	/**
	 * Hide the text from assistive tech entirely, when an ancestor already
	 * carries it (a heading made of several SplitText lines names itself
	 * once, with an sr-only copy).
	 */
	presentational?: boolean;
};

/**
 * Text split into words (or letters) on the server and revealed as it enters
 * the viewport: words rise and sharpen in sequence (`.reveal`), or, with
 * `scrub`, brighten as the reader scrolls through them (`.reveal-scrub`).
 *
 * The split spans are aria-hidden and a visually hidden copy carries the
 * text, so screen readers hear one plain sentence, not a word per span. Words
 * are inline-blocks with ordinary spaces between them, so lines wrap
 * naturally at any width, and each word can take its own weight.
 */
export function SplitText({
	as: Tag = "p",
	children,
	by = "word",
	scrub = false,
	delay = 0,
	className,
	id,
	presentational = false
}: SplitTextProps) {
	const words = children.trim().split(/\s+/).filter(Boolean);
	const long = !scrub && by === "word" && words.length > LONG_TEXT_WORDS;

	let charIndex = 0;
	const split = words.map((word, wordIndex) => (
		<span key={wordIndex}>
			{wordIndex > 0 && " "}
			<span
				className="reveal-word"
				style={{ "--word-index": wordIndex } as React.CSSProperties}
			>
				{by === "char"
					? [...word].map((char) => (
							<span
								key={charIndex}
								className="reveal-char"
								style={
									{
										"--char-index": charIndex++
									} as React.CSSProperties
								}
							>
								{char}
							</span>
						))
					: word}
			</span>
		</span>
	));

	return (
		<Tag
			id={id}
			// One-shot reveals wait for data-inview; a scrub reads --progress,
			// which the scroll layer writes on this same element.
			data-reveal={scrub ? undefined : ""}
			data-progress={scrub ? "" : undefined}
			className={cn(
				scrub ? "reveal-scrub" : "reveal",
				by === "char" && "reveal-chars",
				long && "reveal-long",
				className
			)}
			style={
				{
					"--delay": `${delay}ms`,
					"--word-total": words.length
				} as React.CSSProperties
			}
		>
			{!presentational && <span className="sr-only">{children}</span>}
			<span aria-hidden="true">{split}</span>
		</Tag>
	);
}
