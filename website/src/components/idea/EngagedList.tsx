"use client";

import { engageHandlers } from "~/lib/engage";

/**
 * An ordered list that knows when a mouse is really moving over it: hover
 * styling is keyed to [data-engaged] (see engageHandlers), so rows sliding
 * under a resting pointer as the page scrolls don't light up.
 */
export function EngagedList({
	children,
	...props
}: React.OlHTMLAttributes<HTMLOListElement>) {
	return (
		<ol
			{...props}
			{...engageHandlers}
		>
			{children}
		</ol>
	);
}
