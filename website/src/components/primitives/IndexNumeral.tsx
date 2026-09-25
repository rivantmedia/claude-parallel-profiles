import { cn } from "~/lib/utils";

const SIZE = {
	/* The big index beside a list's rows, as rivant.in's service index sets
	   it: one step down on phones and tablets, where it sits in a narrow
	   column. */
	large: "text-[2.25rem] leading-[0.9] tracking-[-0.035em] md:text-[3rem] lg:text-[clamp(3rem,4.4vw,4.5rem)]",
	/* Dense lists: the accordion, the uninstall steps, the policy points. */
	small: "text-lg leading-snug md:text-xl"
} as const;

/**
 * A list's index numeral ("01"): Montserrat ExtraLight Italic in ash, the one
 * style every numbered list on the site uses. Decorative, and hidden from
 * assistive tech: the list itself gives the order.
 */
export function IndexNumeral({
	value,
	size = "large",
	className
}: {
	/** 1-based; shown as two digits. */
	value: number;
	size?: keyof typeof SIZE;
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"font-display font-extralight text-ash italic tabular-nums",
				SIZE[size],
				className
			)}
		>
			{String(value).padStart(2, "0")}
		</span>
	);
}
