import {
	Container,
	Eyebrow,
	Shape,
	type ShapeName
} from "~/components/primitives";
import type { Privacy } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./PrivacyStage.module.css";
import { StatementLine } from "./StatementLine";

/**
 * A brand shape on the pinned stage. It uses the `.parallax` transform from
 * globals.css, but its progress is the track's (--track, see .onTrack), not
 * its own: an element stuck in place never moves through the viewport, so
 * its own progress would stand still for the whole pin.
 */
function TrackShape({
	name,
	depth,
	rotate = 0,
	scale,
	blur,
	opacity,
	imageClassName,
	className
}: {
	name: ShapeName;
	/** Vertical travel in px across the track (positive lags, reads far). */
	depth: number;
	rotate?: number;
	scale?: [number, number];
	/** Depth of field: blur in px at either end of the travel. */
	blur?: number;
	/** Kept dimmer than the type in front. */
	opacity: number;
	imageClassName?: string;
	className?: string;
}) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"parallax",
				blur && "parallax-dof",
				styles.onTrack,
				className
			)}
			style={
				{
					"--depth": `${depth}px`,
					"--rotate": `${rotate}deg`,
					"--scale-from": scale?.[0] ?? 1,
					"--scale-to": scale?.[1] ?? 1,
					...(blur ? { "--dof": `${blur}px` } : {}),
					opacity
				} as React.CSSProperties
			}
		>
			<Shape
				name={name}
				className={cn("w-full", imageClassName)}
			/>
		</div>
	);
}

/**
 * The privacy statement, pinned (after rivant.in's Statement). A tall track
 * scrolls past a sticky, full-height stage. On it the line brightens word by
 * word, one word per line, framed from the corners by brand shapes on their
 * own depths and a faint ghost word far behind.
 *
 * Everything behind the type lags the scroll, so while the stage is pinned
 * the shapes drift down, away from the nav. The rings sit high on the right,
 * cropped by the edge, as they are on the extension's icon.
 *
 * With reduced motion the track collapses to the stage's own height: no pin,
 * the statement fully lit, every shape at rest.
 */
export function PrivacyStage({
	privacy,
	headingId
}: {
	privacy: Privacy;
	headingId: string;
}) {
	return (
		<div
			data-progress=""
			className={styles.track}
		>
			<div className={styles.stage}>
				{/* Farthest layer: a faint word under the line. */}
				<div
					aria-hidden="true"
					className={styles.ghost}
				>
					<span className="font-style">{privacy.ghost}</span>
				</div>

				{/* The icon's rings, high on the right, cropped by the edge. */}
				<TrackShape
					name="rings"
					depth={160}
					rotate={18}
					scale={[1.04, 0.94]}
					blur={4}
					opacity={0.42}
					imageClassName="rotate-180"
					className={styles.rings}
				/>

				{/* Far, small and crisp in the wide-screen corridor left of the type. */}
				<TrackShape
					name="knot"
					depth={180}
					rotate={-26}
					scale={[1.05, 0.92]}
					blur={4}
					opacity={0.5}
					className={styles.knot}
				/>

				{/* Cropped by the left edge, low on the stage. */}
				<TrackShape
					name="orbs"
					depth={200}
					rotate={12}
					scale={[1.06, 0.94]}
					blur={5}
					opacity={0.55}
					className={styles.orbs}
				/>

				{/* Cropped by the right edge, low beside the type on wide screens. */}
				<TrackShape
					name="pill"
					depth={160}
					rotate={-14}
					scale={[1.05, 0.95]}
					blur={5}
					opacity={0.5}
					imageClassName="-rotate-[28deg]"
					className={styles.pill}
				/>

				<Container className="relative z-10">
					<div className={styles.type}>
						<div className={styles.eyebrow}>
							<Eyebrow index={privacy.eyebrow.index}>
								{privacy.eyebrow.label}
							</Eyebrow>
						</div>

						<div className={styles.lineBox}>
							{/* Tucked into the gaps the stagger leaves; sized in
							    em so they stay locked to the type at every width. */}
							<TrackShape
								name="trio"
								depth={-80}
								rotate={-16}
								opacity={0.4}
								className={styles.notchTrio}
							/>
							<TrackShape
								name="capsule"
								depth={50}
								rotate={30}
								opacity={0.35}
								className={styles.notchCapsule}
							/>

							<StatementLine
								id={headingId}
								statement={privacy.statement}
							/>
						</div>

						<p className={styles.signature}>
							<span className="text-paper">
								{privacy.signature.name}
							</span>
							<span
								aria-hidden="true"
								className={cn(
									styles.signatureRule,
									"h-px w-8 bg-smoke"
								)}
							/>
							<span>{privacy.signature.line}</span>
						</p>
					</div>
				</Container>
			</div>
		</div>
	);
}
