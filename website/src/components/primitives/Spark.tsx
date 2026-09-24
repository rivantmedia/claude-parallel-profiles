import { cn } from "~/lib/utils";

/**
 * The project's spark: a flat burst of nine rounded rays, drawn for its icon (an
 * original drawing, not Anthropic's logo). Unit path centred on 0,0, radius
 * about 1, so it can be placed with transform="translate() rotate() scale()".
 */
export const SPARK_PATH =
	"M-0.1700,-0.1200 L-0.0850,-0.9150 A0.0850,0.0850 0 0 1 0.0850,-0.9150 L0.1700,-0.1200 Q0.0187,-0.0464 -0.0389,-0.2044 L0.4355,-0.5734 A0.0850,0.0850 0 0 1 0.5578,-0.4553 L0.2056,0.0318 Q0.0435,-0.0246 0.0787,-0.1926 L0.8237,-0.2774 A0.0850,0.0850 0 0 1 0.8620,-0.1118 L0.1552,0.1386 Q0.0492,0.0087 0.1932,-0.0772 L0.6711,0.3345 A0.0850,0.0850 0 0 1 0.5785,0.4770 L0.0081,0.2079 Q0.0318,0.0386 0.2026,0.0476 L0.4141,0.7980 A0.0850,0.0850 0 0 1 0.2565,0.8617 L-0.1127,0.1749 Q-0.0009,0.0500 0.1065,0.1788 L-0.2050,0.6695 A0.0850,0.0850 0 0 1 -0.3603,0.6003 L-0.2041,0.0405 Q-0.0321,0.0383 -0.0044,0.2080 L-0.6530,0.5430 A0.0850,0.0850 0 0 1 -0.7481,0.4020 L-0.1945,-0.0738 Q-0.0491,0.0095 -0.1527,0.1413 L-0.7757,-0.0780 A0.0850,0.0850 0 0 1 -0.7404,-0.2443 L-0.0820,-0.1912 Q-0.0431,-0.0254 -0.2070,0.0210 L-0.6382,-0.6046 A0.0850,0.0850 0 0 1 -0.5099,-0.7161 L0.0496,-0.2021 Q-0.0175,-0.0468 -0.1700,-0.1200 Z";

/** The three spark colours, front to back (see --color-spark/ember/rust). */
export const SPARK_COLOURS = {
	spark: "var(--color-spark)",
	ember: "var(--color-ember)",
	rust: "var(--color-rust)"
} as const;

export type SparkTone = keyof typeof SPARK_COLOURS;

/**
 * A single spark, flat fill with the icon's void keyline (painted under the
 * fill, so it only shows where sparks overlap or meet the ground). Size it
 * with a width/height class. Decorative unless given a title.
 */
export function Spark({
	tone = "spark",
	stroke = true,
	title,
	className
}: {
	tone?: SparkTone;
	/** The void keyline; off for a spark drawn tiny, where it would eat the rays. */
	stroke?: boolean;
	title?: string;
	className?: string;
}) {
	return (
		<svg
			viewBox="-1.08 -1.08 2.16 2.16"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("shrink-0", className)}
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
			focusable="false"
		>
			{title && <title>{title}</title>}
			<path
				d={SPARK_PATH}
				fill={SPARK_COLOURS[tone]}
				stroke={stroke ? "var(--color-void)" : undefined}
				strokeWidth={stroke ? 0.1 : undefined}
				strokeLinejoin="round"
				paintOrder="stroke"
			/>
		</svg>
	);
}
