import { cn } from "~/lib/utils";

type ParallaxProps = React.HTMLAttributes<HTMLElement> & {
	/**
	 * Total vertical travel in px across the element's pass through the
	 * viewport. Positive lags behind the scroll (reads as far away); negative
	 * moves ahead of it (reads as close).
	 */
	depth?: number;
	/** Rotation in degrees across the same travel. */
	rotate?: number;
	/** Scale at the start and end of the travel. */
	scale?: [number, number];
	/**
	 * Depth of field: the blur (px) at either end of the travel. Sharp at its
	 * resting place, softening progressively as it moves away from it.
	 */
	blur?: number;
	as?: "div" | "span" | "figure";
};

/**
 * Scroll parallax driven by the scroll layer's --progress (see `.parallax` in
 * globals.css). The layer rests where it is placed at the middle of its pass
 * and drifts either side, so place it where it should be seen.
 */
export function Parallax({
	depth = 120,
	rotate = 0,
	scale,
	blur,
	as: Tag = "div",
	className,
	style,
	...props
}: ParallaxProps) {
	return (
		<Tag
			data-progress=""
			className={cn("parallax", blur && "parallax-dof", className)}
			style={
				{
					"--depth": `${depth}px`,
					"--rotate": `${rotate}deg`,
					"--scale-from": scale?.[0] ?? 1,
					"--scale-to": scale?.[1] ?? 1,
					...(blur ? { "--dof": `${blur}px` } : {}),
					...style
				} as React.CSSProperties
			}
			{...props}
		/>
	);
}
