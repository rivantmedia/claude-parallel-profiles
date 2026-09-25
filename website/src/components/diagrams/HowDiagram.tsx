import type { HowDiagram as HowDiagramContent } from "~/content";
import { Chip, DiagramFrame, EdgeLabel, Line, Stage } from "./Diagram";
import styles from "./HowDiagram.module.css";

/*
 * Account stores → per-window working copies ← windows. Each account is one
 * row: its store is copied into a window's private working copy, and the
 * window points CLAUDE_CONFIG_DIR at that copy.
 *
 * Wide (lg+) it is the README's picture, one row per account across three
 * columns. Narrower, each row stands on end and reads top to bottom (store,
 * copy, window, the last arrow pointing back up), two side by side on
 * tablets and one after the other on phones, where each is its own stage so
 * the second draws when it arrives.
 *
 * Edge lengths (rem) must match the column widths in HowDiagram.module.css.
 */
const COPY_EDGE = 6.5;
const ENV_EDGE = 9.5;
const VERTICAL_EDGE = 3.5;

/** Delays (ms) within a row, and between rows. */
const ROW_STAGGER = 160;
const WINDOW_DELAY = 120;
const COPY_LINE_DELAY = 260;
const COPY_DELAY = 520;
const ENV_LINE_DELAY = 720;

export function HowDiagram({
	diagram,
	caption,
	className
}: {
	diagram: HowDiagramContent;
	/** Visible text under the plate. */
	caption?: React.ReactNode;
	className?: string;
}) {
	const { columns } = diagram;

	return (
		<DiagramFrame
			description={diagram.alt}
			caption={caption}
			className={className}
			plateClassName="px-4 py-10 sm:px-8 md:py-14 lg:px-12 lg:py-20"
		>
			<div className={styles.layout}>
				<div className={styles.header}>
					<span>{columns.stores.title}</span>
					<span />
					<span>{columns.copies.title}</span>
					<span />
					<span>{columns.windows.title}</span>
				</div>

				<div className={styles.rows}>
					{diagram.rows.map((row, index) => {
						const base = index * ROW_STAGGER;
						return (
							<Stage
								key={row.account}
								className={styles.row}
							>
								<Chip
									label={columns.stores.item}
									labelClassName="xl:hidden"
									delay={base}
								>
									{row.store}
								</Chip>

								<div className={styles.edge}>
									<EdgeLabel delay={base + COPY_LINE_DELAY}>
										{diagram.copyEdge}
									</EdgeLabel>
									<Line
										length={COPY_EDGE}
										delay={base + COPY_LINE_DELAY}
										className="hidden xl:block"
									/>
									<Line
										length={VERTICAL_EDGE}
										vertical
										delay={base + COPY_LINE_DELAY}
										className="xl:hidden"
									/>
								</div>

								<Chip
									label={columns.copies.item}
									labelClassName="xl:hidden"
									delay={base + COPY_DELAY}
								>
									{row.copy}
								</Chip>

								<div className={styles.edge}>
									<EdgeLabel delay={base + ENV_LINE_DELAY}>
										{diagram.envEdge}
									</EdgeLabel>
									<Line
										length={ENV_EDGE}
										arrow="start"
										delay={base + ENV_LINE_DELAY}
										className="hidden xl:block"
									/>
									<Line
										length={VERTICAL_EDGE}
										vertical
										arrow="start"
										delay={base + ENV_LINE_DELAY}
										className="xl:hidden"
									/>
								</div>

								<Chip
									icon="window"
									mono={false}
									label={columns.windows.item}
									labelClassName="xl:hidden"
									delay={base + WINDOW_DELAY}
								>
									{row.window}
								</Chip>
							</Stage>
						);
					})}
				</div>
			</div>
		</DiagramFrame>
	);
}
