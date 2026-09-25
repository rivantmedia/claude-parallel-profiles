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
				// A label that wraps (narrow phones) gets a real line gap; the
				// padding gives back what the taller line takes, so a one-line
				// pill keeps its height. Tracking tightens on the narrowest
				// phones so the longest labels stay on one line.
				"inline-flex items-center gap-2.5 rounded-full px-3.5 py-[calc(0.5rem_-_0.175em)] text-eyebrow leading-[1.35] font-semibold text-mist uppercase ring-1 ring-smoke/70 ring-inset max-[22.5rem]:tracking-[0.14em]",
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
