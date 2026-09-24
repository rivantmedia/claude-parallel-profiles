import { cn } from "~/lib/utils";

/** Inline code: a quiet graphite chip in the system mono. */
export function Code({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<code
			className={cn(
				"rounded-md bg-graphite px-[0.4em] py-[0.12em] font-mono text-[0.86em] [overflow-wrap:anywhere] text-bone ring-1 ring-slate ring-inset",
				className
			)}
		>
			{children}
		</code>
	);
}

/** A key or shortcut: a raised keycap. <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>P</Kbd> */
export function Kbd({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<kbd
			className={cn(
				"inline-block min-w-[1.8em] rounded-md bg-graphite px-[0.45em] py-[0.1em] text-center font-mono text-[0.82em] text-bone shadow-[inset_0_-2px_0_0_var(--color-slate)] ring-1 ring-slate ring-inset",
				className
			)}
		>
			{children}
		</kbd>
	);
}

/**
 * Copy with `backtick spans` (the content modules' Rich strings) rendered
 * as inline code. Nothing else is parsed.
 */
export function RichText({ text }: { text: string }) {
	return (
		<>
			{text
				.split("`")
				.map((part, index) =>
					index % 2 === 1 ? (
						<Code key={index}>{part}</Code>
					) : (
						part && <span key={index}>{part}</span>
					)
				)}
		</>
	);
}
