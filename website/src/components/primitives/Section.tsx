import { cn } from "~/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
	/** id of the heading that names this section */
	labelledBy?: string;
};

/**
 * Section wrapper: generous vertical rhythm (py-24, py-36 from md), and
 * `overflow-clip` so parallax layers can bleed past the edges without causing
 * horizontal scroll. `isolate` gives shapes at -z-10 a local stacking
 * context, so they sit behind the section's content but above the page.
 */
export function Section({ labelledBy, className, ...props }: SectionProps) {
	return (
		<section
			aria-labelledby={labelledBy}
			className={cn(
				"relative isolate overflow-clip py-24 md:py-36",
				className
			)}
			{...props}
		/>
	);
}
