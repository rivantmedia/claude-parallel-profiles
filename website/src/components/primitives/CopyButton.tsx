"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { cx } from "~/lib/cx";

/** How long the confirmation shows before the button resets, in ms. */
const RESET_MS = 2000;

/** Clipboard API first; a hidden textarea where it's missing (plain http). */
async function copyText(value: string) {
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(value);
		return;
	}
	const area = document.createElement("textarea");
	area.value = value;
	area.setAttribute("readonly", "");
	area.style.position = "fixed";
	area.style.opacity = "0";
	document.body.appendChild(area);
	area.select();
	const ok = document.execCommand("copy");
	area.remove();
	if (!ok) throw new Error("Copy failed");
}

/**
 * Copies `value` to the clipboard. The icon turns to a check and a polite
 * live region says "Copied" (or that it failed), so the result is heard as
 * well as seen. 44px square by default; pass `children` for a visible label.
 */
export function CopyButton({
	value,
	label = "Copy to clipboard",
	children,
	className
}: {
	value: string;
	/** Accessible name when there is no visible label. */
	label?: string;
	/** Optional visible label beside the icon. */
	children?: React.ReactNode;
	className?: string;
}) {
	const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	async function onClick() {
		window.clearTimeout(timer.current);
		try {
			await copyText(value);
			setState("copied");
		} catch {
			setState("failed");
		}
		timer.current = window.setTimeout(() => setState("idle"), RESET_MS);
	}

	const Icon = state === "copied" ? CheckIcon : CopyIcon;

	return (
		<>
			<button
				type="button"
				onClick={onClick}
				aria-label={children ? undefined : label}
				className={cx(
					// Hidden until the page's scripts run: it can't copy without them.
					"needs-js inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-semibold ring-1 transition-[color,background-color,box-shadow,scale] duration-500 ease-spring ring-inset hover:bg-paper hover:text-void hover:ring-paper active:scale-95",
					children && "px-4",
					state === "copied"
						? "text-paper ring-paper/50"
						: "text-mist ring-smoke/70",
					className
				)}
			>
				<Icon
					weight="light"
					aria-hidden="true"
					className="size-[18px]"
				/>
				{children}
			</button>
			<span
				role="status"
				aria-live="polite"
				className="sr-only"
			>
				{state === "copied"
					? "Copied"
					: state === "failed"
						? "Couldn’t copy. Select the text and copy it instead."
						: ""}
			</span>
		</>
	);
}
