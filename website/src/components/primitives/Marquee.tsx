"use client";

import { cn } from "~/lib/utils";

/**
 * Seamless horizontal loop: the content is rendered twice and each copy
 * travels its own width. It clips only sideways, so glyphs that rise past the
 * line box (accents, tall display type) keep their tops. A mouse that is
 * really moving over it pauses it (see `.marquee` in globals.css); it stops
 * for reduced motion.
 *
 * Only real movement counts. Scrolling slides the loop under a resting
 * pointer and the browser reports that as hover (with pointer events of zero
 * movement), so gating on :hover alone paused and resumed the loop as it
 * crossed the pointer, and each pause snapped it to a different spot. A wheel
 * turn hands it back to scrolling.
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
	function engage(event: React.PointerEvent<HTMLDivElement>) {
		if (event.pointerType !== "mouse") return;
		if (event.movementX !== 0 || event.movementY !== 0)
			event.currentTarget.dataset.engaged = "";
	}

	function disengage(event: React.SyntheticEvent<HTMLDivElement>) {
		delete event.currentTarget.dataset.engaged;
	}

	return (
		<div
			role={label ? "region" : undefined}
			aria-label={label}
			className={cn("marquee flex overflow-x-clip", className)}
			style={
				{
					"--duration": `${duration}s`,
					"--direction": reverse ? "reverse" : "normal"
				} as React.CSSProperties
			}
			onPointerMove={engage}
			onPointerLeave={disengage}
			onWheel={disengage}
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
