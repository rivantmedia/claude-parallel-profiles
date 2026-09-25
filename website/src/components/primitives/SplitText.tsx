import { cn } from "~/lib/utils";

/**
 * Past this many words a one-shot reveal becomes a quick wash: people start
 * reading a paragraph as soon as it arrives, so it can't take seconds to land
 * (see `.reveal-long` in globals.css).
 */
const LONG_TEXT_WORDS = 16;

/**
 * Paragraphs keep their last two words together (when they are this short
 * between them), so a lead never ends on one word alone. The words are
 * inline-blocks, which text-wrap: pretty doesn't balance, so it is done here.
 */
const LAST_PAIR_MAX = 24;

type SplitTextProps = {
	as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
	children: string;
	/** Tie the reveal to scroll position instead of playing once on entry. */
	scrub?: boolean;
	/** Extra delay before a one-shot reveal starts, in ms. */
	delay?: number;
	/**
	 * "view" (the default) reveals the words when they enter the viewport,
	 * which needs the page's scripts. "load" is for the first screen: the
	 * text rises in with the page (`.fade-up`, pure CSS), so it never waits
	 * for the scripts to download and start.
	 */
	entrance?: "view" | "load";
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
 * Text split into words on the server and revealed as it enters the
 * viewport: words rise and sharpen in sequence (`.reveal`), or, with
 * `scrub`, brighten as the reader scrolls through them (`.reveal-scrub`).
 *
 * The split spans are aria-hidden and a visually hidden copy carries the
 * text, so screen readers hear one plain sentence, not a word per span. The
 * copy can't be selected, so selecting and copying the text gives the words
 * once. Words are inline-blocks with ordinary spaces between them, so lines
 * wrap naturally at any width, and each word can take its own weight. A
 * no-break space joins two words into one unit that never breaks.
 */
export function SplitText({
	as: Tag = "p",
	children,
	scrub = false,
	delay = 0,
	entrance = "view",
	className,
	id,
	presentational = false
}: SplitTextProps) {
	const onLoad = entrance === "load" && !scrub;
	// Every space but a no-break one separates words, so content can keep
	// a phrase together ("Claude\u00a0Code").
	const words = children
		.trim()
		.split(/[^\S\u00a0]+/)
		.filter(Boolean);
	const long = !scrub && words.length > LONG_TEXT_WORDS;

	// `spaced`: the ordinary space before the word (a line may break there).
	const wordSpan = (
		word: string,
		wordIndex: number,
		spaced = wordIndex > 0
	) => (
		<span key={wordIndex}>
			{spaced && " "}
			<span
				className="reveal-word"
				style={{ "--word-index": wordIndex } as React.CSSProperties}
			>
				{word}
			</span>
		</span>
	);
	const lastTwo = words.slice(-2).join(" ");
	const pairEnd =
		(Tag === "p" || Tag === "div") &&
		words.length >= 4 &&
		lastTwo.length <= LAST_PAIR_MAX;
	const split = pairEnd ? (
		<>
			{words.slice(0, -2).map((word, index) => wordSpan(word, index))}{" "}
			<span className="whitespace-nowrap">
				{wordSpan(words.at(-2) ?? "", words.length - 2, false)}
				{wordSpan(words.at(-1) ?? "", words.length - 1)}
			</span>
		</>
	) : (
		words.map((word, index) => wordSpan(word, index))
	);

	return (
		<Tag
			id={id}
			// One-shot reveals wait for data-inview; a scrub reads --progress,
			// which the scroll layer writes on this same element.
			data-reveal={scrub || onLoad ? undefined : ""}
			data-progress={scrub ? "" : undefined}
			className={cn(
				scrub ? "reveal-scrub" : onLoad ? "fade-up" : "reveal",
				long && !onLoad && "reveal-long",
				className
			)}
			style={
				{
					"--delay": `${delay}ms`,
					"--word-total": words.length
				} as React.CSSProperties
			}
		>
			{!presentational && (
				<span className="sr-only select-none">{children}</span>
			)}
			<span aria-hidden="true">{split}</span>
		</Tag>
	);
}
