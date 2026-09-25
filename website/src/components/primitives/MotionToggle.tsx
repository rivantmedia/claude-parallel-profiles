"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { MOTION_PAUSED_KEY } from "~/components/providers/Motion";
import { site } from "~/content";
import { cx } from "~/lib/cx";

const ATTRIBUTE = "data-motion-paused";

function subscribe(notify: () => void) {
	const observer = new MutationObserver(notify);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: [ATTRIBUTE]
	});
	return () => observer.disconnect();
}

const isPaused = () => document.documentElement.hasAttribute(ATTRIBUTE);

/** Whether the reader has paused the page's motion (see MotionToggle). */
export function useMotionPaused() {
	return useSyncExternalStore(subscribe, isPaused, () => false);
}

/**
 * Pauses and resumes everything on the page that moves by itself: the demo's
 * tour, the sparks' slow turn, the live dots' pulse and the scroll cue
 * (WCAG 2.2.2). It sets html[data-motion-paused], which the CSS and the demo
 * read, and remembers the choice in this browser (the inline boot script
 * restores it before first paint). Scroll-driven motion isn't affected: it
 * only moves when the reader scrolls. Hidden with reduced motion, where
 * nothing loops, and without scripts, where it can't work.
 */
export function MotionToggle({ className }: { className?: string }) {
	const paused = useMotionPaused();
	const Icon = paused ? PlayIcon : PauseIcon;

	function toggle() {
		const next = !paused;
		document.documentElement.toggleAttribute(ATTRIBUTE, next);
		try {
			if (next) localStorage.setItem(MOTION_PAUSED_KEY, "1");
			else localStorage.removeItem(MOTION_PAUSED_KEY);
		} catch {
			// Storage off (a private window, blocked site data): it still
			// pauses, just not across visits.
		}
	}

	return (
		<button
			type="button"
			onClick={toggle}
			className={cx(
				"needs-js group inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-semibold text-mist ring-1 ring-smoke/70 transition-[color,background-color,box-shadow,scale] duration-500 ease-spring ring-inset hover:bg-paper hover:text-void hover:ring-paper active:scale-95 motion-reduce:hidden sm:pr-5 sm:pl-4",
				className
			)}
		>
			<Icon
				weight="light"
				aria-hidden="true"
				className="size-4"
			/>
			{/* Phones show the icon alone; the words stay for screen readers. */}
			<span className="max-sm:sr-only">
				{paused ? site.motionToggle.play : site.motionToggle.pause}
			</span>
		</button>
	);
}
