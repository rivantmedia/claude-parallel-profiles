import { cn } from "~/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLElement> & {
	as?: "div" | "li" | "figure" | "article" | "span" | "section" | "ul" | "ol";
	/** Delay before it starts, in ms; stagger siblings with it. */
	delay?: number;
	/**
	 * "view" (the default) rises when it enters the viewport, which needs the
	 * page's scripts; "load", for a page's first screen, rises with the page
	 * (`.fade-up`, pure CSS) and never waits for them.
	 */
	entrance?: "view" | "load";
};

/**
 * A block that rises and sharpens into place the first time it enters the
 * viewport (`.reveal-up` in globals.css). For cards, figures, rows: anything
 * that isn't split text. Visible without JavaScript and with reduced motion.
 */
export function Reveal({
	as: Tag = "div",
	delay = 0,
	entrance = "view",
	className,
	style,
	...props
}: RevealProps) {
	const onLoad = entrance === "load";
	return (
		<Tag
			data-reveal={onLoad ? undefined : ""}
			className={cn(onLoad ? "fade-up" : "reveal-up", className)}
			style={{ "--delay": `${delay}ms`, ...style } as React.CSSProperties}
			{...props}
		/>
	);
}
