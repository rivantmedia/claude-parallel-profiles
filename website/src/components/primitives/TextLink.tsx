import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { cn } from "~/lib/utils";
import { InternalLink } from "./InternalLink";
import { NEW_TAB_HINT } from "./PillButton";

/**
 * The label of a link that opens a new tab, inside running text: the words,
 * then a small up-right arrow held on the line of the last word (it never
 * wraps onto a line of its own), then the hint in words for screen readers.
 */
export function ExternalLabel({ children }: { children: React.ReactNode }) {
	const mark = (
		<>
			<ArrowUpRightIcon
				weight="light"
				aria-hidden="true"
				className="ml-0.5 inline size-[0.85em] align-[-0.05em] text-ash"
			/>
			<span className="sr-only"> {NEW_TAB_HINT}</span>
		</>
	);
	if (typeof children !== "string") {
		return (
			<>
				{children}
				{mark}
			</>
		);
	}
	const at = children.lastIndexOf(" ") + 1;
	return (
		<>
			{children.slice(0, at)}
			<span className="whitespace-nowrap">
				{children.slice(at)}
				{mark}
			</span>
		</>
	);
}

/**
 * A link inside running text. Underlined at rest (so it reads as a link
 * without relying on colour), and the underline brightens on hover.
 * External addresses open in a new tab and say so: a small up-right arrow,
 * as on every other link that leaves the site, and words for screen readers.
 */
export function TextLink({
	href,
	external,
	children,
	className
}: {
	href: string;
	/** Defaults to true for http(s) addresses. */
	external?: boolean;
	children: React.ReactNode;
	className?: string;
}) {
	const classes = cn(
		"font-medium text-paper underline decoration-smoke decoration-1 underline-offset-[0.25em] transition-[text-decoration-color] duration-300 ease-out-expo hover:decoration-paper",
		className
	);

	if (external ?? /^https?:\/\//.test(href)) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={classes}
			>
				<ExternalLabel>{children}</ExternalLabel>
			</a>
		);
	}

	return (
		<InternalLink
			href={href}
			className={classes}
		>
			{children}
		</InternalLink>
	);
}
