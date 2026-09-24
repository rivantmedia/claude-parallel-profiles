import { cn } from "~/lib/utils";
import { SPARK_COLOURS, SPARK_PATH, type SparkTone } from "./Spark";

/*
 * The icon's composition (on its 256 tile): three sparks stacked back to
 * front, each larger and warmer than the last. Positions, turns, scales and
 * keyline widths are the icon's own.
 */
const TRIO: {
	tone: SparkTone;
	x: number;
	y: number;
	rotate: number;
	scale: number;
	stroke: number;
}[] = [
	{ tone: "rust", x: 75.48, y: 66, rotate: -6, scale: 43.26, stroke: 0.1156 },
	{
		tone: "ember",
		x: 112.56,
		y: 92.78,
		rotate: 22,
		scale: 53.56,
		stroke: 0.0934
	},
	{
		tone: "spark",
		x: 157.88,
		y: 119.56,
		rotate: 0,
		scale: 63.86,
		stroke: 0.0783
	}
];

/**
 * The project's mark: the icon's three sparks, without its tile. Scales to
 * any width class (the viewBox hugs the art). With `turn`, each spark turns
 * slowly about its own centre, alternating direction; reduced motion stills
 * it. Decorative unless given a title.
 */
export function SparkTrio({
	turn = false,
	title,
	className
}: {
	turn?: boolean;
	title?: string;
	className?: string;
}) {
	return (
		<svg
			viewBox="34 18 188 164"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("h-auto shrink-0", className)}
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
			focusable="false"
		>
			{title && <title>{title}</title>}
			{TRIO.map((spark, index) => (
				<g
					key={spark.tone}
					transform={`translate(${spark.x} ${spark.y})`}
				>
					<g
						className={turn ? "spark-turn" : undefined}
						style={
							turn
								? ({
										"--turn": `${120 + index * 30}s`,
										"--turn-direction":
											index % 2 ? "reverse" : "normal"
									} as React.CSSProperties)
								: undefined
						}
					>
						<path
							d={SPARK_PATH}
							transform={`rotate(${spark.rotate}) scale(${spark.scale})`}
							fill={SPARK_COLOURS[spark.tone]}
							stroke="var(--color-void)"
							strokeWidth={spark.stroke}
							strokeLinejoin="round"
							paintOrder="stroke"
						/>
					</g>
				</g>
			))}
		</svg>
	);
}
