import { cn } from "~/lib/utils";

/** Tiny pill label placed above section headings. */
export function Eyebrow({
	children,
	index,
	live = false,
	className
}: {
	children: React.ReactNode;
	/** Optional counter shown before the label, e.g. "01". */
	index?: string;
	/** A small spark-coloured live dot before the label (use sparingly). */
	live?: boolean;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 text-eyebrow font-semibold text-mist uppercase ring-1 ring-smoke/70 ring-inset",
				className
			)}
		>
			{live && (
				<span
					aria-hidden="true"
					className="live-dot"
				/>
			)}
			{index && <span className="text-ash tabular-nums">{index}</span>}
			{children}
		</span>
	);
}
