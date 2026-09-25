"use client";

import { engageHandlers } from "~/lib/engage";
import { cx } from "~/lib/cx";

/**
 * Seamless horizontal loop: the content is rendered twice and each copy
 * travels its own width. It clips only sideways, so glyphs that rise past the
 * line box (accents, tall display type) keep their tops. A mouse that is
 * really moving over it pauses it (see `.marquee` in globals.css); it stops
 * for reduced motion.
 *
 * Only real movement counts (see engageHandlers): gating on :hover alone
 * paused and resumed the loop as scrolling slid it under a resting pointer,
 * and each pause snapped it to a different spot. "Pause motion" stops it for
 * good (see MotionToggle).
 */
export function Marquee({
	children,
	duration = 40,
	reverse = false,
	gap = "4rem",
	className,
	label
}: {
	children: React.ReactNode;
	/** Seconds per loop. */
	duration?: number;
	reverse?: boolean;
	gap?: string;
	className?: string;
	/** Accessible name for the region; the duplicate copy is hidden. */
	label?: string;
}) {
	return (
		<div
			role={label ? "region" : undefined}
			aria-label={label}
			className={cx("marquee flex overflow-x-clip", className)}
			style={
				{
					"--duration": `${duration}s`,
					"--direction": reverse ? "reverse" : "normal"
				} as React.CSSProperties
			}
			{...engageHandlers}
		>
			{[0, 1].map((copy) => (
				<div
					key={copy}
					aria-hidden={copy === 1 || undefined}
					className="marquee-track flex shrink-0 items-center"
					style={{ gap, paddingRight: gap }}
				>
					{children}
				</div>
			))}
		</div>
	);
}
