import { RichText } from "~/components/primitives";
import type { PlatformRow } from "~/content";
import { cn } from "~/lib/utils";

/**
 * A status chip. Status reads by weight and ring, never by hue: supported
 * is bold paper in a paper ring with a solid dot; inert is ash in an ash
 * ring with a hollow one.
 */
function StatusChip({
	status,
	children
}: {
	status: PlatformRow["status"];
	children: React.ReactNode;
}) {
	const supported = status === "supported";

	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-eyebrow uppercase ring-1 ring-inset",
				supported
					? "font-bold text-paper ring-paper/70"
					: "font-medium text-ash ring-ash/60"
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					"size-1.5 rounded-full",
					supported ? "bg-paper" : "ring-1 ring-ash ring-inset"
				)}
			/>
			{children}
		</span>
	);
}

/**
 * One place the extension can run: its status chip, the platform's name
 * (Montserrat) and a short note (mist). The inert tile sits on the void
 * with only a quiet ring, one step down from the carbon tiles; `wide` lays
 * it out across the row, the note beside the name, for the longer reason.
 *
 * The name comes first in the source, so it is read before its status. On
 * phones the chip sits beside it to keep six tiles short; from `sm`, and on
 * the narrowest phones (where the two side by side would widen the tile),
 * the chip is shown above it.
 */
export function PlatformTile({
	platform,
	wide = false,
	className
}: {
	platform: PlatformRow;
	wide?: boolean;
	className?: string;
}) {
	const supported = platform.status === "supported";

	return (
		<li
			className={cn(
				"flex flex-col rounded-3xl p-5 ring-1 ring-inset sm:p-6 md:p-7",
				supported ? "bg-carbon ring-slate" : "ring-smoke/70",
				wide && "md:grid md:grid-cols-12 md:gap-x-10",
				className
			)}
		>
			<div
				className={cn(
					"flex items-start justify-between gap-4 max-[22.5rem]:flex-col-reverse max-[22.5rem]:gap-3 sm:flex-col-reverse sm:justify-end sm:gap-6",
					wide && "md:col-span-5 lg:col-span-4"
				)}
			>
				<h4 className="font-display text-xl leading-snug font-normal text-paper">
					{platform.platform}
				</h4>
				<StatusChip status={platform.status}>
					{platform.statusLabel}
				</StatusChip>
			</div>
			<p
				className={cn(
					"mt-3 text-sm leading-relaxed text-mist md:text-[0.9375rem]",
					wide &&
						"max-w-[62ch] md:col-span-7 md:mt-0 md:self-end lg:col-span-8"
				)}
			>
				<RichText text={platform.note} />
			</p>
		</li>
	);
}
