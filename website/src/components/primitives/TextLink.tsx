import Link from "next/link";
import { cn } from "~/lib/utils";
import { NEW_TAB_HINT } from "./PillButton";

/**
 * A link inside running text. Underlined at rest (so it reads as a link
 * without relying on colour), and the underline brightens on hover.
 * External addresses open in a new tab and say so to screen readers.
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
				{children}
				<span className="sr-only"> {NEW_TAB_HINT}</span>
			</a>
		);
	}

	return (
		<Link
			href={href}
			className={classes}
		>
			{children}
		</Link>
	);
}
