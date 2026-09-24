"use client";

import { useEffect } from "react";

/*
 * The site's scroll layer, in place of rivant.in's StringTune. It does three
 * small jobs and renders nothing:
 *
 * 1. Progress. Every [data-progress] element gets --progress, 0 -> 1 as it
 *    crosses the viewport: 0 when its top meets the viewport bottom, 1 when
 *    its bottom meets the viewport top. Override either end with
 *    data-progress-start / data-progress-end="<element edge> <viewport edge>"
 *    (edges: top | center | bottom), e.g. the footer wordmark's
 *    data-progress-end="bottom bottom" finishes as the page ends. Only
 *    elements near the viewport (IntersectionObserver) are measured, all in
 *    one requestAnimationFrame per scroll or resize.
 * 2. Reveals. [data-reveal] elements get data-inview once, when they enter.
 * 3. Magnetic. [data-magnetic] elements (value = strength, default 0.25) lean
 *    toward a fine pointer that comes near, via --magnetic-x/y.
 *
 * Elements added later (route changes, client components) are picked up by a
 * MutationObserver. With prefers-reduced-motion nothing runs: the CSS shows
 * every hidden state as settled and every --progress falls back to its
 * resting value. html.js-ready (added by the inline script in the root
 * layout, before first paint) gates every hidden state; html[data-motion]
 * tells that script's failsafe this layer is alive.
 */

const PROGRESS = "[data-progress]";
const REVEAL = "[data-reveal]";
const MAGNETIC = "[data-magnetic]";

/** Where on the element and the viewport a progress end is measured. */
const EDGE: Record<string, number> = { top: 0, center: 0.5, bottom: 1 };

type Ends = { element: number; viewport: number };

/** Defaults: from "top bottom" (top meets the viewport bottom) to
    "bottom top" (bottom meets the viewport top). */
const ENTER: Ends = { element: 0, viewport: 1 };
const EXIT: Ends = { element: 1, viewport: 0 };

type Tracked = {
	start: Ends;
	end: Ends;
	/** Last value written, to skip no-op style writes. */
	value: number;
};

function parseEnds(value: string | undefined, fallback: Ends): Ends {
	if (!value) return fallback;
	const [element, viewport] = value.trim().split(/\s+/);
	return {
		element: EDGE[element ?? ""] ?? fallback.element,
		viewport: EDGE[viewport ?? ""] ?? fallback.viewport
	};
}

/*
 * The element's top (relative to the viewport) at which progress is 0 and
 * at which it is 1, then where the current top sits between them.
 */
function measure(element: HTMLElement, tracked: Tracked, vh: number) {
	const rect = element.getBoundingClientRect();
	const from =
		tracked.start.viewport * vh - tracked.start.element * rect.height;
	const to = tracked.end.viewport * vh - tracked.end.element * rect.height;
	if (from === to) return rect.top <= to ? 1 : 0;
	return Math.min(1, Math.max(0, (from - rect.top) / (from - to)));
}

export function Motion() {
	useEffect(() => {
		const html = document.documentElement;
		html.classList.add("js-ready");
		html.dataset.motion = "on";

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (reduced.matches) {
			html.dataset.motion = "reduced";
			return;
		}

		const tracked = new Map<HTMLElement, Tracked>();
		/** Progress elements near the viewport: the only ones measured. */
		const active = new Set<HTMLElement>();
		const magnets = new Set<HTMLElement>();
		const revealed = new WeakSet<HTMLElement>();
		let frame = 0;

		const write = (element: HTMLElement, state: Tracked, vh: number) => {
			const value =
				Math.round(measure(element, state, vh) * 10000) / 10000;
			if (value === state.value) return;
			state.value = value;
			element.style.setProperty("--progress", String(value));
		};

		const update = () => {
			frame = 0;
			const vh = window.innerHeight;
			for (const element of active) {
				const state = tracked.get(element);
				if (!state || !element.isConnected) {
					active.delete(element);
					continue;
				}
				write(element, state, vh);
			}
		};

		const schedule = () => {
			frame ||= requestAnimationFrame(update);
		};

		// A generous margin, so progress is already right as an element
		// appears, even on a fast flick.
		const near = new IntersectionObserver(
			(entries) => {
				const vh = window.innerHeight;
				for (const entry of entries) {
					const element = entry.target as HTMLElement;
					const state = tracked.get(element);
					if (!state) continue;
					if (entry.isIntersecting) active.add(element);
					else active.delete(element);
					// One exact write on the way in or out, so an element left
					// behind by a jump settles at 0 or 1 rather than mid-way.
					write(element, state, vh);
				}
			},
			{ rootMargin: "50% 0px 50% 0px" }
		);

		// Reveals fire a little inside the bottom edge, so the motion is seen.
		const entering = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const element = entry.target as HTMLElement;
					element.dataset.inview = "";
					entering.unobserve(element);
				}
			},
			{ rootMargin: "0px 0px -8% 0px" }
		);

		const scan = (root: ParentNode) => {
			root.querySelectorAll<HTMLElement>(PROGRESS).forEach((element) => {
				if (tracked.has(element)) return;
				tracked.set(element, {
					start: parseEnds(element.dataset.progressStart, ENTER),
					end: parseEnds(element.dataset.progressEnd, EXIT),
					value: Number.NaN
				});
				near.observe(element);
			});
			root.querySelectorAll<HTMLElement>(REVEAL).forEach((element) => {
				if (revealed.has(element)) return;
				revealed.add(element);
				entering.observe(element);
			});
			root.querySelectorAll<HTMLElement>(MAGNETIC).forEach((element) =>
				magnets.add(element)
			);
		};

		// Forget elements that left the DOM, so the maps never grow.
		const prune = () => {
			for (const element of tracked.keys()) {
				if (element.isConnected) continue;
				near.unobserve(element);
				tracked.delete(element);
				active.delete(element);
			}
			for (const element of magnets)
				if (!element.isConnected) magnets.delete(element);
		};

		scan(document);
		update();

		let pending = 0;
		const mutations = new MutationObserver(() => {
			pending ||= requestAnimationFrame(() => {
				pending = 0;
				prune();
				scan(document);
				schedule();
			});
		});
		mutations.observe(document.body, { childList: true, subtree: true });

		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule, { passive: true });

		// ---------------------------------------------------------- magnetic

		const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
		/** The pull last written per element, to skip no-op writes. */
		const offsets = new WeakMap<HTMLElement, { x: number; y: number }>();
		let pointer: { x: number; y: number } | null = null;
		let magnetFrame = 0;

		const pull = () => {
			magnetFrame = 0;
			for (const element of magnets) {
				const strength = Number(element.dataset.magnetic) || 0.25;
				const radius = Number(element.dataset.magneticRadius) || 110;
				const offset = offsets.get(element) ?? { x: 0, y: 0 };
				// The rect includes the pull as rendered right now, which is
				// mid-transition more often than not, so the rendered
				// `translate` is taken back out; otherwise the element would
				// chase itself.
				const rect = element.getBoundingClientRect();
				const [tx = 0, ty = 0] = getComputedStyle(element)
					.translate.split(" ")
					.map((part) => parseFloat(part) || 0);
				const cx = rect.left + rect.width / 2 - tx;
				const cy = rect.top + rect.height / 2 - ty;
				let x = 0;
				let y = 0;
				if (pointer) {
					const dx = pointer.x - cx;
					const dy = pointer.y - cy;
					// The field reaches `radius` past the element's own edge.
					const reach =
						radius + Math.max(rect.width, rect.height) / 2;
					if (Math.hypot(dx, dy) < reach) {
						x = Math.round(dx * strength * 100) / 100;
						y = Math.round(dy * strength * 100) / 100;
					}
				}
				if (x === offset.x && y === offset.y) continue;
				offsets.set(element, { x, y });
				element.style.setProperty("--magnetic-x", String(x));
				element.style.setProperty("--magnetic-y", String(y));
			}
		};

		const onPointerMove = (event: PointerEvent) => {
			if (event.pointerType !== "mouse" || !fine.matches) return;
			pointer = { x: event.clientX, y: event.clientY };
			magnetFrame ||= requestAnimationFrame(pull);
		};
		// A pointer leaving the window lets every magnet settle back.
		const onPointerOut = (event: PointerEvent) => {
			if (event.relatedTarget) return;
			pointer = null;
			magnetFrame ||= requestAnimationFrame(pull);
		};

		window.addEventListener("pointermove", onPointerMove, {
			passive: true
		});
		window.addEventListener("pointerout", onPointerOut, { passive: true });

		return () => {
			cancelAnimationFrame(frame);
			cancelAnimationFrame(pending);
			cancelAnimationFrame(magnetFrame);
			near.disconnect();
			entering.disconnect();
			mutations.disconnect();
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerout", onPointerOut);
		};
	}, []);

	return null;
}

/*
 * Runs inline in <head>, before first paint: hidden reveal states apply only
 * under html.js-ready, so adding it this early avoids a flash of settled
 * text that then hides and animates in. If the scroll layer has not started
 * after a few seconds (a script failed to load), the failsafe drops the
 * class again so no content stays hidden.
 */
export const motionBootScript = `(function(){var h=document.documentElement;h.classList.add("js-ready");setTimeout(function(){if(!h.dataset.motion)h.classList.remove("js-ready")},4000)})();`;
