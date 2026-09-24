import { cn } from "~/lib/utils";

/**
 * A slate hairline that draws itself in from the left as it arrives: once on
 * entry (default), or scrubbed with the scroll (`scrub`). Decorative; use a
 * border instead where the line separates content that must read as
 * separate without motion.
 */
export function Rule({
	scrub = false,
	delay = 0,
	className
}: {
	scrub?: boolean;
	delay?: number;
	className?: string;
}) {
	return (
		<div
			aria-hidden="true"
			data-reveal={scrub ? undefined : ""}
			data-progress={scrub ? "" : undefined}
			className={cn(
				"h-px w-full bg-slate",
				scrub ? "rule-scrub" : "rule-draw",
				className
			)}
			style={{ "--delay": `${delay}ms` } as React.CSSProperties}
		/>
	);
}
