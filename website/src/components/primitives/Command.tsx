import { cn } from "~/lib/utils";
import { CopyButton } from "./CopyButton";

/**
 * A terminal command on a graphite plate, with a copy button. The prompt is
 * decoration (not copied, not read out); long commands wrap at any character
 * rather than scroll, so the whole line is always visible on a phone.
 */
export function Command({
	command,
	label = "Copy command",
	prompt = "$",
	className
}: {
	command: string;
	/** Accessible name for the copy button. */
	label?: string;
	prompt?: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-2xl bg-graphite py-2 pr-2 pl-5 ring-1 ring-slate ring-inset",
				className
			)}
		>
			<code className="min-w-0 flex-1 py-2 font-mono text-[0.875rem] leading-relaxed [overflow-wrap:anywhere] text-bone md:text-[0.9375rem]">
				<span
					aria-hidden="true"
					className="mr-3 text-ash select-none"
				>
					{prompt}
				</span>
				{command}
			</code>
			<CopyButton
				value={command}
				label={label}
			/>
		</div>
	);
}
