import { asset } from "~/lib/asset";
import { cn } from "~/lib/utils";

/**
 * The six greyscale brand shapes (public/art). Intrinsic sizes come from
 * each SVG's viewBox and are passed as width/height so the box is reserved
 * before the file loads.
 */
const SHAPES = {
	orbs: { width: 50, height: 25 },
	pill: { width: 50, height: 20.7 },
	rings: { width: 50, height: 36.4 },
	knot: { width: 50, height: 48.6 },
	capsule: { width: 50, height: 50 },
	trio: { width: 50, height: 23.3 }
} as const;

export type ShapeName = keyof typeof SHAPES;

/**
 * A decorative brand shape. Size it with a width class, keep it dimmer than
 * the content in front (an opacity class), and crop it off an edge rather
 * than floating it whole in the middle. Shapes are art: they frame and fill,
 * they never stand for an idea. A plain <img> (not next/image) so the base
 * path can be added by asset().
 */
export function Shape({
	name,
	className,
	priority = false
}: {
	name: ShapeName;
	className?: string;
	/** Load eagerly, for a shape in the first screen. */
	priority?: boolean;
}) {
	const { width, height } = SHAPES[name];

	return (
		// eslint-disable-next-line @next/next/no-img-element -- static SVG art; next/image would not add the base path
		<img
			src={asset(`/art/${name}.svg`)}
			alt=""
			aria-hidden="true"
			width={width}
			height={height}
			loading={priority ? "eager" : "lazy"}
			fetchPriority={priority ? "high" : undefined}
			decoding="async"
			draggable={false}
			className={cn("pointer-events-none h-auto select-none", className)}
		/>
	);
}
