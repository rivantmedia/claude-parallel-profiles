import { cn } from "~/lib/utils";
import { Spark, SPARK_TRIO, TRIO_KEYLINE, trioPlacement } from "./Spark";

/**
 * The project's mark: the icon's three sparks (SPARK_TRIO), without its
 * tile, in a box that hugs the art. Size it with a width class. With `turn`,
 * each spark turns slowly about its own centre, alternating direction; each
 * spark is its own HTML box, so the browser's compositor runs the turn, and
 * reduced motion or "Pause motion" stills it. Decorative unless given a
 * title.
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
		<div
			role={title ? "img" : undefined}
			aria-label={title}
			aria-hidden={title ? undefined : true}
			className={cn("relative aspect-[188/164] shrink-0", className)}
		>
			{SPARK_TRIO.map((spark, index) => (
				<div
					key={spark.tone}
					className="absolute"
					style={trioPlacement(spark)}
				>
					<div
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
						<div style={{ rotate: `${spark.rotate}deg` }}>
							<Spark
								tone={spark.tone}
								strokeWidth={TRIO_KEYLINE / spark.scale}
								className="block h-auto w-full"
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
