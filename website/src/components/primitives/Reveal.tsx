import { cn } from "~/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLElement> & {
	as?: "div" | "li" | "figure" | "article" | "span" | "section" | "ul" | "ol";
	/** Delay before it starts, in ms; stagger siblings with it. */
	delay?: number;
};

/**
 * A block that rises and sharpens into place the first time it enters the
 * viewport (`.reveal-up` in globals.css). For cards, figures, rows: anything
 * that isn't split text. Visible without JavaScript and with reduced motion.
 */
export function Reveal({
	as: Tag = "div",
	delay = 0,
	className,
	style,
	...props
}: RevealProps) {
	return (
		<Tag
			data-reveal=""
			className={cn("reveal-up", className)}
			style={{ "--delay": `${delay}ms`, ...style } as React.CSSProperties}
			{...props}
		/>
	);
}
