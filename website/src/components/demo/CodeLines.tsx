import { cx } from "~/lib/cx";

/*
 * A very small highlighter for the mock's example code, in greys only:
 * keywords and components light, strings and comments dim. It knows just
 * enough TSX and shell for the lines in content/demo.ts.
 */
const TOKEN =
	/(\/\/.*|#.*)|("[^"]*"|'[^']*')|(<\/?[A-Z][\w.]*|\/?>)|\b(import|from|export|function|const|return|if|autoload)\b|(\b[A-Z]\w*\b)|([{}()[\];=&|.,:?/-]+)/g;

const KIND = [
	"text-ash italic", // comment
	"text-mist", // string
	"text-paper", // JSX tag
	"text-paper", // keyword
	"text-bone", // component or type
	"text-ash" // punctuation
];

function highlight(line: string) {
	const out: React.ReactNode[] = [];
	let last = 0;
	for (const match of line.matchAll(TOKEN)) {
		if (match.index > last)
			out.push(
				<span
					key={`p${last}`}
					className="text-mist"
				>
					{line.slice(last, match.index)}
				</span>
			);
		const kind = match.slice(1).findIndex(Boolean);
		out.push(
			<span
				key={`m${match.index}`}
				className={KIND[kind]}
			>
				{match[0]}
			</span>
		);
		last = match.index + match[0].length;
	}
	if (last < line.length)
		out.push(
			<span
				key={`p${last}`}
				className="text-mist"
			>
				{line.slice(last)}
			</span>
		);
	return out;
}

/**
 * The editor: line numbers, the code, and the line with the cursor faintly
 * lit. Decorative (the window's summary says what is open).
 */
export function CodeLines({
	lines,
	cursorLine,
	className
}: {
	lines: readonly string[];
	/** 1-based. */
	cursorLine: number;
	className?: string;
}) {
	return (
		<pre
			className={cx(
				"font-mono text-[0.6875rem] leading-[1.25rem] md:text-[0.71875rem]",
				className
			)}
		>
			{lines.map((line, index) => {
				const current = index + 1 === cursorLine;
				return (
					<span
						key={index}
						className={cx(
							"flex pr-3",
							current && "bg-white/[0.035]"
						)}
					>
						<span
							className={cx(
								"w-9 shrink-0 pr-3 text-right tabular-nums select-none",
								current ? "text-bone" : "text-ash/70"
							)}
						>
							{index + 1}
						</span>
						<span className="whitespace-pre">
							{line ? highlight(line) : " "}
						</span>
					</span>
				);
			})}
		</pre>
	);
}
