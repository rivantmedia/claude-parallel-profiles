import { site } from "~/content";
import { cn } from "~/lib/utils";
import { Logo } from "./Logo";

/**
 * "Rivant for the Community": the official logomark, RIVANT set as
 * rivant.in's nav sets it (Montserrat 700, tracked), and "for the Community"
 * in extralight italic mist, the brand's weight contrast. Presentational:
 * the link or heading around it carries the accessible name.
 *
 * `compact` lets the tail drop below 25rem (400px), where the nav has no
 * room for it beside the GitHub pill; the logomark and RIVANT always stay.
 * The space between the two words is real text (the gap only spaces them),
 * so the visible text reads "RIVANT for the Community", matching the link's
 * accessible name.
 */
export function Lockup({
	compact = false,
	className
}: {
	compact?: boolean;
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cn("flex items-center gap-3", className)}
		>
			<Logo className="h-[22px] w-[34px] shrink-0" />
			<span className="flex items-baseline gap-[0.55em] font-display text-[0.8rem] whitespace-nowrap">
				<span className="font-bold tracking-[0.22em] text-paper">
					{site.lockup.wordmark}
				</span>{" "}
				<span
					className={cn(
						"text-[0.95rem] font-extralight tracking-[0.01em] text-mist italic",
						compact && "max-[25rem]:hidden"
					)}
				>
					{site.lockup.tail}
				</span>
			</span>
		</span>
	);
}
