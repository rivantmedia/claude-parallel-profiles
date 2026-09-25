import type { HistoryDiagram as HistoryDiagramContent } from "~/content";
import {
	Arrowhead,
	Chip,
	Connectors,
	DiagramFrame,
	EdgeLabel,
	Stage,
	Stroke
} from "./Diagram";
import styles from "./HistoryDiagram.module.css";

/*
 * Geometry, in px at 16px per rem (it must match HistoryDiagram.module.css).
 *
 * Wide (lg+): the three sources stack in 5rem cells, 1rem apart (17rem in
 * all), their centres at 40, 136 and 232; a 10rem column of lines fans them
 * into the store, centred on the middle one.
 *
 * Narrow: the sources stack in 4.5rem cells, 0.75rem apart (15rem), centres
 * at 36, 120 and 204, beside a 2.5rem gutter. Each one turns into a rail
 * down the gutter, past a 3.5rem gap that carries the label, and into the
 * store's 5rem cell, centred at 336. The flow reads top to bottom.
 */
const WIDE = { cell: 80, gap: 16, width: 10, height: 17 };
const NARROW = { cell: 72, gap: 12, rail: 18, gutter: 2.5, height: 23.5 };
const NARROW_TARGET_Y = 296 + 40;

/** Delays (ms): sources rise, lines draw, the store lands, arrows settle. */
const SOURCE_DELAY = 90;
const LINE_DELAY = 260;
const LINE_STAGGER = 110;
const TARGET_DELAY = 620;
const HEAD_DELAY = 1050;

export function HistoryDiagram({
	diagram,
	className
}: {
	diagram: HistoryDiagramContent;
	className?: string;
}) {
	const wideCentres = diagram.sources.map(
		(_, index) => WIDE.cell / 2 + index * (WIDE.cell + WIDE.gap)
	);
	const narrowCentres = diagram.sources.map(
		(_, index) => NARROW.cell / 2 + index * (NARROW.cell + NARROW.gap)
	);
	// The store lines up with the middle source.
	const wideTarget =
		wideCentres[Math.floor(wideCentres.length / 2)] ?? WIDE.height * 8;
	const w = WIDE.width * 16;
	const g = NARROW.gutter * 16;
	const r = NARROW.rail;
	const t = NARROW_TARGET_Y;

	return (
		<DiagramFrame
			description={diagram.alt}
			className={className}
			plateClassName="px-4 py-10 sm:px-8 md:py-14 lg:px-12 lg:py-20"
		>
			<Stage className={styles.layout}>
				{/* Narrow: every source joins one rail down into the store. */}
				<Connectors
					width={NARROW.gutter}
					height={NARROW.height}
					className={styles.rail}
				>
					{narrowCentres.map((y, index) => (
						<Stroke
							key={y}
							d={`M${g} ${y} H${r + 12} Q${r} ${y} ${r} ${y + 12} V${t - 12} Q${r} ${t} ${r + 12} ${t} H${g - 2}`}
							delay={LINE_DELAY + index * LINE_STAGGER}
						/>
					))}
					<Arrowhead
						x={g - 2}
						y={t}
						delay={HEAD_DELAY}
					/>
				</Connectors>

				{/* Wide: three lines fan in to the store. */}
				<Connectors
					width={WIDE.width}
					height={WIDE.height}
					className={styles.fan}
				>
					{wideCentres.map((y, index) => (
						<Stroke
							key={y}
							d={
								y === wideTarget
									? `M0 ${y} H${w - 2}`
									: `M0 ${y} H36 C84 ${y} 84 ${wideTarget} 132 ${wideTarget} H${w - 2}`
							}
							delay={LINE_DELAY + index * LINE_STAGGER}
						/>
					))}
					<Arrowhead
						x={w - 2}
						y={wideTarget}
						delay={HEAD_DELAY}
					/>
				</Connectors>

				<div className={styles.sources}>
					{diagram.sources.map((source, index) => (
						<div
							key={source.path}
							className={styles.cell}
						>
							<Chip
								label={source.note}
								delay={index * SOURCE_DELAY}
								className="w-full"
							>
								{source.path}
							</Chip>
						</div>
					))}
				</div>

				<div className={styles.edge}>
					<EdgeLabel delay={TARGET_DELAY}>{diagram.edge}</EdgeLabel>
				</div>

				<div className={styles.target}>
					<Chip
						emphasis
						label={diagram.target.note}
						delay={TARGET_DELAY}
						className="w-full lg:w-auto"
					>
						{diagram.target.path}
					</Chip>
				</div>
			</Stage>
		</DiagramFrame>
	);
}
