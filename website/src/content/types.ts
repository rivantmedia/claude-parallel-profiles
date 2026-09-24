/**
 * Shared shapes for the site's copy. Every module in content/ is plain data:
 * strings, arrays and objects, no JSX.
 *
 * Conventions for the strings:
 * - A `Rich` string may hold `backtick spans`, rendered as inline code.
 *   Nothing else in it is parsed: no Markdown, no HTML.
 * - Prose uses curly quotes and apostrophes (’ “ ”); code spans keep straight
 *   ones, exactly as they are typed.
 * - Headings are in sentence case. Product and UI names keep their capitals.
 * - Every product claim is traceable to the extension’s README, CHANGELOG,
 *   package.json or src/. Change the facts there first.
 */

/** Prose that may contain `backtick` code spans. */
export type Rich = string;

/**
 * One run of a heading set in the brand’s weight contrast: `heavy` is
 * extrabold Montserrat in paper, `light` is extralight italic Montserrat in
 * mist. Heavy words come first.
 */
export type Run = {
	readonly text: string;
	readonly weight: "heavy" | "light";
};

/**
 * A heading in weight contrast. Runs are joined with a single space; `plain`
 * is the same sentence as one string, for aria-label, metadata and tests.
 */
export type ContrastHeading = {
	readonly runs: readonly Run[];
	readonly plain: string;
};

/** The small pill over a section: an optional index ("01") and a label. */
export type Eyebrow = {
	readonly index?: string;
	readonly label: string;
};

/** A labelled link. `external` opens off-site (target and rel are the page’s call). */
export type LinkRef = {
	readonly label: string;
	readonly href: string;
	readonly external: boolean;
};

/** A titled point: a list item, a card or a step. */
export type Point = {
	readonly title: string;
	readonly body: Rich;
};

/** A point with a one-line summary and a fuller body, for expandable lists. */
export type Detail = {
	readonly title: string;
	readonly summary: Rich;
	/** Paragraphs, in order. */
	readonly body: readonly Rich[];
};

/** The opening of a homepage section. `id` is the anchor the nav links to. */
export type SectionIntro = {
	readonly id: string;
	readonly eyebrow: Eyebrow;
	readonly heading: ContrastHeading;
	readonly lead: Rich;
};
