import {
	Parallax,
	Spark,
	SPARK_TRIO,
	TRIO_KEYLINE,
	trioPlacement,
	type SparkTone
} from "~/components/primitives";
import { cn } from "~/lib/utils";
import styles from "./HeroSparks.module.css";

/*
 * The icon's three sparks (SPARK_TRIO), laid out as the icon lays them out,
 * inside a box that hugs the art. Back to front: small rust at the top left,
 * ember, and the large spark at the bottom right. Each gets its own parallax
 * depth and slow turn here: nearer sparks travel further with the scroll (a
 * negative depth moves ahead of the page, a positive one lags behind it).
 */
const MOTION: Record<
	SparkTone,
	{ depth: number; turn: string; reverse: boolean }
> = {
	rust: { depth: 60, turn: "170s", reverse: false },
	ember: { depth: -50, turn: "140s", reverse: true },
	spark: { depth: -170, turn: "115s", reverse: false }
};

/**
 * The sub-brand's mark as hero art: three separate layers, each with its own
 * parallax depth and slow turn (`.spark-turn`, which reduced motion and
 * "Pause motion" still). Decorative. Size and place the box with `className`
 * (and `style`, e.g. an entrance delay); the sparks keep the icon's
 * proportions inside it.
 */
export function HeroSparks({
	className,
	style
}: {
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<div
			aria-hidden="true"
			className={cn(styles.box, className)}
			style={style}
		>
			{SPARK_TRIO.map((spark) => {
				const motion = MOTION[spark.tone];
				return (
					<Parallax
						key={spark.tone}
						depth={motion.depth}
						className="absolute"
						style={trioPlacement(spark)}
					>
						<div
							className="spark-turn"
							style={
								{
									"--turn": motion.turn,
									"--turn-direction": motion.reverse
										? "reverse"
										: "normal"
								} as React.CSSProperties
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
					</Parallax>
				);
			})}
		</div>
	);
}
