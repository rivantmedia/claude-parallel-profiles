import {
	ArrowsClockwiseIcon,
	ArrowsLeftRightIcon,
	CheckIcon,
	CircleIcon,
	ListBulletsIcon,
	PuzzlePieceIcon,
	TrashIcon,
	UserIcon,
	type Icon
} from "@phosphor-icons/react";
import { cx } from "~/lib/cx";
import styles from "./Demo.module.css";

/*
 * VS Code writes status bar and menu text with codicons inline, as
 * `$(name)`. The mock draws each one with the nearest Phosphor icon (light),
 * so the content module can keep the extension's strings verbatim.
 */
const CODICONS: Record<string, Icon> = {
	"account": UserIcon,
	"circle-outline": CircleIcon,
	"check": CheckIcon,
	"sync": ArrowsClockwiseIcon,
	"arrow-swap": ArrowsLeftRightIcon,
	"trash": TrashIcon,
	"extensions": PuzzlePieceIcon,
	"output": ListBulletsIcon
};

/** Icons whose meaning isn't in the words around them, said aloud with `spoken`. */
const SPOKEN: Record<string, string> = {
	"circle-outline": "(empty circle)"
};

const PATTERN = /\$\(([a-z-]+)(~spin)?\)/g;

/**
 * A string with `$(codicon)` marks, drawn as icons and text. Icons are
 * decorative: screen readers hear the words only, plus, with `spoken`, a
 * name for an icon that carries meaning of its own (the "not saved yet"
 * circle). Whitespace around an icon becomes a small gap, as in VS Code.
 */
export function Codicons({
	text,
	spoken = false,
	className,
	iconClassName
}: {
	text: string;
	spoken?: boolean;
	className?: string;
	iconClassName?: string;
}) {
	const parts: React.ReactNode[] = [];
	let last = 0;
	for (const match of text.matchAll(PATTERN)) {
		const before = text.slice(last, match.index).trim();
		if (before) parts.push(<span key={`t${last}`}>{before}</span>);
		const name = match[1] ?? "";
		const Glyph = CODICONS[name];
		if (spoken && SPOKEN[name])
			parts.push(
				<span
					key={`s${match.index}`}
					className="sr-only"
				>
					{SPOKEN[name]}
				</span>
			);
		if (Glyph)
			parts.push(
				<Glyph
					key={`i${match.index}`}
					weight="light"
					aria-hidden="true"
					className={cx(
						"size-[1.15em] shrink-0",
						match[2] && styles.spin,
						iconClassName
					)}
				/>
			);
		last = match.index + match[0].length;
	}
	const rest = text.slice(last).trim();
	if (rest) parts.push(<span key={`t${last}`}>{rest}</span>);

	return (
		<span className={cx("inline-flex items-center gap-[0.4em]", className)}>
			{parts}
		</span>
	);
}

/** "$(account) <email>" with the email filled in. */
export function fill(template: string, values: Record<string, string>) {
	return template.replace(/<(\w+)>/g, (whole, key: string) =>
		key in values ? (values[key] ?? "") : whole
	);
}
