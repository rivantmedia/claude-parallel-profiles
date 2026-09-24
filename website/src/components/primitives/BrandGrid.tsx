import { cn } from "~/lib/utils";

/** The brand's thin square grid, faded out toward the edges. Decorative. */
export function BrandGrid({
	className,
	size = 72
}: {
	className?: string;
	size?: number;
}) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_10%,transparent_75%)] opacity-40",
				className
			)}
			style={{
				backgroundImage:
					"linear-gradient(to right, var(--color-slate) 1px, transparent 1px), linear-gradient(to bottom, var(--color-slate) 1px, transparent 1px)",
				backgroundSize: `${size}px ${size}px`,
				backgroundPosition: "center top"
			}}
		/>
	);
}
