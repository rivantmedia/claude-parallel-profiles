import { cx } from "~/lib/cx";

/** Up to this many characters a code span never wraps. */
const WHOLE_UP_TO = 24;

/**
 * Splits a long code span into pieces that never break inside (so an
 * identifier is never split at one of its hyphens, "~/.claude-" / "shared",
 * which reads as two words). A line may break at a space, after a "/" that
 * ends a path segment (not the one in "~/"), and after the "." of a dotted name ("DercasDrol." /
 * "claude-parallel-accounts"), where the code reads naturally across two
 * lines. Joined, the pieces are exactly the original text.
 */
function codePieces(text: string) {
	const pieces: { text: string; space: boolean }[] = [];
	let current = "";
	const flush = () => {
		if (current) pieces.push({ text: current, space: false });
		current = "";
	};
	[...text].forEach((char, index, chars) => {
		if (/\s/.test(char)) {
			flush();
			pieces.push({ text: char, space: true });
			return;
		}
		current += char;
		const next = chars[index + 1] ?? "";
		// Not after "~/" or "./": those stay with what follows.
		const endsPath =
			char === "/" &&
			!/[~.]/.test(chars[index - 1] ?? "") &&
			current.length > 2;
		const endsName =
			char === "." &&
			/[A-Za-z0-9]/.test(chars[index - 1] ?? "") &&
			/[A-Za-z]/.test(next);
		if (endsPath || endsName) flush();
	});
	flush();
	return pieces;
}

function breakable(text: string) {
	const pieces = codePieces(text);
	return pieces.map((piece, index) =>
		piece.space ? (
			piece.text
		) : (
			<span key={index}>
				<span className="whitespace-nowrap">{piece.text}</span>
				{!pieces[index + 1]?.space && index < pieces.length - 1 && (
					<wbr />
				)}
			</span>
		)
	);
}

/**
 * Inline code: a quiet graphite chip in the system mono. A short span never
 * wraps; a long one wraps only after a "/" or "." or at a space (see
 * breakable), never at a hyphen.
 */
export function Code({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const text = typeof children === "string" ? children : null;
	return (
		<code
			className={cx(
				"rounded-md bg-graphite px-[0.4em] py-[0.12em] font-mono text-[0.86em] text-bone ring-1 ring-slate ring-inset",
				text !== null && text.length <= WHOLE_UP_TO
					? "whitespace-nowrap"
					: "[overflow-wrap:anywhere]",
				className
			)}
		>
			{text !== null && text.length > WHOLE_UP_TO
				? breakable(text)
				: children}
		</code>
	);
}

/**
 * Copy with `backtick spans` (the content modules' Rich strings) rendered
 * as inline code. Nothing else is parsed.
 */
export function RichText({ text }: { text: string }) {
	return (
		<>
			{text
				.split("`")
				.map((part, index) =>
					index % 2 === 1 ? (
						<Code key={index}>{part}</Code>
					) : (
						part && <span key={index}>{part}</span>
					)
				)}
		</>
	);
}
