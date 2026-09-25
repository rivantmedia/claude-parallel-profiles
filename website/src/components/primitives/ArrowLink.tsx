import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpRightIcon
} from "@phosphor-icons/react/ssr";
import type { LinkRef } from "~/content";
import { cn } from "~/lib/utils";
import { InternalLink } from "./InternalLink";
import { NEW_TAB_HINT } from "./PillButton";

const ICON = "size-4 shrink-0 transition-transform duration-500 ease-spring";

/**
 * A link on a line of its own (where TextLink sits inside a sentence): set
 * small and quiet, underlined in smoke, with a 44px target and an arrow that
 * says where it goes. Down for a section further down this page, right for
 * another page, up-right for anywhere off the site, which opens a new tab
 * and says so to screen readers.
 */
export function ArrowLink({
	link,
	className
}: {
	link: LinkRef;
	className?: string;
}) {
	const classes = cn(
		"group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bone underline decoration-smoke decoration-1 underline-offset-[0.3em] transition-[color,text-decoration-color] duration-300 ease-out-expo hover:text-paper hover:decoration-paper",
		className
	);

	if (link.external) {
		return (
			<a
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				className={classes}
			>
				{link.label}
				<span className="sr-only"> {NEW_TAB_HINT}</span>
				<ArrowUpRightIcon
					weight="light"
					aria-hidden="true"
					className={cn(
						ICON,
						"group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					)}
				/>
			</a>
		);
	}

	const down = link.href.includes("#");
	const Icon = down ? ArrowDownIcon : ArrowRightIcon;
	return (
		<InternalLink
			href={link.href}
			className={classes}
		>
			{link.label}
			<Icon
				weight="light"
				aria-hidden="true"
				className={cn(
					ICON,
					down
						? "group-hover:translate-y-0.5"
						: "group-hover:translate-x-0.5"
				)}
			/>
		</InternalLink>
	);
}
