import { AppWindowIcon, FolderSimpleIcon } from "@phosphor-icons/react/ssr";
import { Fragment } from "react";
import { BrandGrid } from "~/components/primitives";
import { cn } from "~/lib/utils";
import styles from "./Diagram.module.css";

/*
 * The building blocks both diagrams are drawn with (the conversation-history
 * links and the stores-to-windows flow), so they read as one visual
 * language: a carbon plate on the brand grid, graphite chips holding real
 * text (paths are type, never SVG text), and a layer of hairline connectors
 * that draw in from their source when the diagram arrives.
 *
 * Geometry is fixed in rem, not measured: every connector SVG is sized in rem
 * and its viewBox is the same box in px at 16px per rem, so it scales evenly
 * with the reader's font size, strokes keep their width, and the lines meet
 * the chips without any JavaScript. The chips sit centred in fixed-height
 * cells, so a path that has to wrap on a very narrow phone grows its chip
 * about the same centre the lines aim at.
 */

/** px per rem in the connector viewBoxes. */
const REM = 16;

type Delay = { delay?: number };

function delayStyle(delay = 0) {
	return { "--delay": `${delay}ms` } as React.CSSProperties;
}

/**
 * The plate, and an optional caption under it. Screen readers get
 * `description` (then the caption) as the figure's caption: the chips and
 * lines are a picture of that sentence, hidden from assistive tech so the
 * relationships are heard once, in order.
 */
export function DiagramFrame({
	description,
	caption,
	children,
	className,
	plateClassName
}: {
	description: string;
	/** Shown under the plate, set like a figure caption. */
	caption?: React.ReactNode;
	children: React.ReactNode;
	/** The figure (outer spacing). */
	className?: string;
	/** The plate (its padding). */
	plateClassName?: string;
}) {
	return (
		<figure className={className}>
			<div
				className={cn(
					styles.frame,
					"relative isolate overflow-hidden rounded-[1.75rem] ring-1 ring-slate ring-inset",
					plateClassName
				)}
			>
				<BrandGrid className="-z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,black_20%,transparent_80%)] opacity-50" />
				<div aria-hidden="true">{children}</div>
			</div>
			<figcaption
				className={
					caption
						? "mt-6 flex max-w-[60ch] gap-4 text-[0.9375rem] leading-relaxed text-mist md:mt-8 md:text-base"
						: "sr-only"
				}
			>
				<span className="sr-only">{description} </span>
				{caption && (
					<>
						{/* A short rule leads the caption in, as under a plate in print. */}
						<span
							aria-hidden="true"
							className="mt-[0.8em] h-px w-8 shrink-0 bg-smoke"
						/>
						<span>{caption}</span>
					</>
				)}
			</figcaption>
		</figure>
	);
}

/**
 * Marks the part of a diagram that plays in together: the scroll layer sets
 * data-inview on it when it enters, and its chips, strokes, heads and labels
 * run on their own delays. A tall diagram can have several stages.
 */
export function Stage({
	as: Tag = "div",
	className,
	children,
	style
}: {
	as?: "div" | "li";
	className?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}) {
	return (
		<Tag
			data-reveal=""
			className={cn(styles.stage, className)}
			style={style}
		>
			{children}
		</Tag>
	);
}

const ICONS = {
	folder: FolderSimpleIcon,
	window: AppWindowIcon
} as const;

/**
 * A node: a graphite chip with a small icon, its text (a path in mono, or a
 * name in the display face) and an optional quiet label under it.
 * `emphasis` lifts the one node everything flows into.
 */
export function Chip({
	icon = "folder",
	mono = true,
	label,
	labelClassName,
	emphasis = false,
	delay,
	className,
	children
}: {
	icon?: keyof typeof ICONS;
	/** Set the text in mono (paths) or the display face (names). */
	mono?: boolean;
	label?: React.ReactNode;
	/** For a label that only some layouts need (e.g. "lg:hidden"). */
	labelClassName?: string;
	emphasis?: boolean;
	className?: string;
	children: React.ReactNode;
} & Delay) {
	const Icon = ICONS[icon];
	return (
		<div
			className={cn(
				styles.chip,
				"flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 ring-1 ring-inset",
				emphasis
					? "bg-graphite py-4 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.06)] ring-smoke md:px-5"
					: "bg-graphite ring-slate",
				className
			)}
			style={delayStyle(delay)}
		>
			{/* Phones give its width to the path. */}
			<Icon
				weight="light"
				className={cn(
					"size-4 shrink-0 max-sm:hidden",
					emphasis ? "text-bone" : "text-ash"
				)}
			/>
			<span className="min-w-0">
				<span
					className={cn(
						"block leading-snug",
						mono
							? cn(
									styles.path,
									"font-mono text-[0.78rem] md:text-[0.8125rem] xl:text-[0.875rem]"
								)
							: "font-display text-[0.9375rem] font-medium tracking-[-0.005em]",
						emphasis ? "text-paper" : "text-bone"
					)}
				>
					{mono && typeof children === "string" ? (
						<PathText path={children} />
					) : (
						children
					)}
				</span>
				{label && (
					<span
						className={cn(
							"mt-1 block text-[0.75rem] leading-snug text-ash",
							labelClassName
						)}
					>
						{label}
					</span>
				)}
			</span>
		</div>
	);
}

/**
 * A path that, if it has to wrap, breaks after a slash, never at a hyphen
 * inside a name ("~/.claude-" / "work"). The text copies unchanged.
 */
function PathText({ path }: { path: string }) {
	return path.split(/(?<=\/)/).map((part, index) => (
		<Fragment key={index}>
			{index > 0 && <wbr />}
			<span className="whitespace-nowrap">{part}</span>
		</Fragment>
	));
}

/** A connector's line: drawn from the start of `d` when its stage enters. */
export function Stroke({ d, delay }: { d: string } & Delay) {
	return (
		<path
			d={d}
			pathLength={1}
			className={styles.stroke}
			style={delayStyle(delay)}
		/>
	);
}

/**
 * An open chevron at (x, y), pointing along `angle` (degrees; 0 points
 * right, 90 down). Fades in as its stroke arrives.
 */
export function Arrowhead({
	x,
	y,
	angle = 0,
	delay
}: { x: number; y: number; angle?: number } & Delay) {
	return (
		<path
			d="M-5 -4.5 L0 0 L-5 4.5"
			transform={`translate(${x} ${y}) rotate(${angle})`}
			className={styles.head}
			style={delayStyle(delay)}
		/>
	);
}

/**
 * An SVG for connectors, `width` by `height` rem, with a viewBox of the same
 * box in px, so its drawing scales evenly with the type.
 */
export function Connectors({
	width,
	height,
	className,
	children
}: {
	width: number;
	height: number;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<svg
			viewBox={`0 0 ${width * REM} ${height * REM}`}
			// Display stays a utility, so a layout can hide it per breakpoint.
			className={cn(styles.svg, "block", className)}
			style={{ width: `${width}rem`, height: `${height}rem` }}
			focusable="false"
		>
			{children}
		</svg>
	);
}

/**
 * A straight connector `length` rem long, horizontal or vertical, drawn from
 * its tail to the arrowhead. `arrow="end"` points right (or down);
 * `arrow="start"` points left (or up), and the line draws from the far end.
 */
export function Line({
	length,
	vertical = false,
	arrow = "end",
	delay = 0,
	className
}: {
	length: number;
	vertical?: boolean;
	arrow?: "start" | "end";
	className?: string;
} & Delay) {
	const l = length * REM;
	// 12px across; the line runs down the middle.
	const [from, to] = arrow === "end" ? [1, l - 1.5] : [l - 1, 1.5];
	const d = vertical ? `M6 ${from} V${to}` : `M${from} 6 H${to}`;
	const angle = vertical
		? arrow === "end"
			? 90
			: -90
		: arrow === "end"
			? 0
			: 180;

	return (
		<Connectors
			width={vertical ? 0.75 : length}
			height={vertical ? length : 0.75}
			className={className}
		>
			<Stroke
				d={d}
				delay={delay}
			/>
			<Arrowhead
				x={vertical ? 6 : to}
				y={vertical ? to : 6}
				angle={angle}
				delay={delay + 650}
			/>
		</Connectors>
	);
}

/** A connector's label: small mono on the plate's ground, over the line. */
export function EdgeLabel({
	children,
	delay,
	className
}: {
	children: React.ReactNode;
	className?: string;
} & Delay) {
	return (
		<span
			className={cn(
				styles.label,
				"rounded-md px-1.5 font-mono text-[0.6875rem] leading-5 tracking-[0.02em] text-mist",
				className
			)}
			style={delayStyle(delay)}
		>
			{children}
		</span>
	);
}
