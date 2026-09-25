"use client";

import { useEffect, useRef } from "react";
import type { Run } from "~/content";
import { cx } from "~/lib/cx";

/** Every letter's resting weight, as on rivant.in. */
const BASE_WEIGHT = 300;
const PEAK_WEIGHT = 900;

/**
 * The hero headline, ported from rivant.in. Every letter is its own span;
 * moving the pointer across the heading swells nearby letters toward the
 * heaviest weight with a smooth falloff (Montserrat widens as it gets
 * heavier, so neighbours are pushed apart like an accordion) and tilts them
 * into italic about their baseline, so the italic morphs in with the weight
 * instead of snapping to another face. As on rivant.in, every letter rests at
 * 300 and the lines differ by colour: the `light` run in mist, the `heavy`
 * run in paper; the accordion is what brings the weight.
 *
 * Letters rise in on load (`.hero-char` in globals.css). Only a fine pointer
 * drives the accordion, and never with reduced motion. Screen readers hear
 * the name once, from the visually hidden copy.
 */
export function HeroHeadline({
	runs,
	plain,
	id,
	className
}: {
	runs: readonly Run[];
	/** The whole name as one string, for assistive tech. */
	plain: string;
	id?: string;
	className?: string;
}) {
	const ref = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const heading = ref.current;
		if (!heading) return;
		const canHover = window.matchMedia(
			"(hover: hover) and (pointer: fine)"
		).matches;
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;
		if (!canHover || reduceMotion) return;

		const letters = Array.from(
			heading.querySelectorAll<HTMLElement>(".hero-char")
		);
		let centres: { x: number; y: number }[] = [];
		let fontSize = 0;
		let pointer: { x: number; y: number } | null = null;
		let frame = 0;

		// Resting centres relative to the heading, measured only while nothing
		// is swollen, so the effect never chases its own reflow.
		const measure = () => {
			if (pointer) return;
			const box = heading.getBoundingClientRect();
			fontSize = parseFloat(getComputedStyle(heading).fontSize);
			centres = letters.map((letter) => {
				const rect = letter.getBoundingClientRect();
				return {
					x: rect.left - box.left + rect.width / 2,
					y: rect.top - box.top + rect.height / 2
				};
			});
		};

		const render = () => {
			frame = 0;
			if (!pointer) return;
			const box = heading.getBoundingClientRect();
			const x = pointer.x - box.left;
			const y = pointer.y - box.top;
			const radius = fontSize * 1.35;
			// Slant falls off faster than weight: the letter under the pointer
			// reaches the full italic angle while its neighbours only lean.
			const slantRadius = radius * 0.7;

			letters.forEach((letter, index) => {
				const centre = centres[index];
				if (!centre) return;
				// Vertical distance counts extra, so the other line barely reacts.
				const distance = Math.hypot(x - centre.x, (y - centre.y) * 2.2);
				const t = Math.max(0, 1 - distance / radius);
				const eased = t * t * (3 - 2 * t);
				letter.style.setProperty(
					"--w",
					String(
						Math.round(
							BASE_WEIGHT + (PEAK_WEIGHT - BASE_WEIGHT) * eased
						)
					)
				);
				const s = Math.max(0, 1 - distance / slantRadius);
				letter.style.setProperty(
					"--s",
					(s * s * (3 - 2 * s)).toFixed(3)
				);
			});
		};

		const onMove = (event: PointerEvent) => {
			pointer = { x: event.clientX, y: event.clientY };
			frame ||= requestAnimationFrame(render);
		};
		const onEnter = (event: PointerEvent) => {
			measure();
			onMove(event);
		};
		// Letters fall back to the resting weight (inherited --w).
		const onLeave = () => {
			pointer = null;
			cancelAnimationFrame(frame);
			frame = 0;
			letters.forEach((letter) => {
				letter.style.removeProperty("--w");
				letter.style.removeProperty("--s");
			});
		};

		void document.fonts.ready.then(measure);
		window.addEventListener("resize", measure);
		heading.addEventListener("pointerenter", onEnter);
		heading.addEventListener("pointermove", onMove);
		heading.addEventListener("pointerleave", onLeave);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("resize", measure);
			heading.removeEventListener("pointerenter", onEnter);
			heading.removeEventListener("pointermove", onMove);
			heading.removeEventListener("pointerleave", onLeave);
		};
	}, []);

	let letterIndex = 0;

	return (
		<h1
			ref={ref}
			id={id}
			className={cx("font-display text-hero text-paper", className)}
		>
			<span className="sr-only select-none">{plain}</span>
			{runs.map((run) => (
				<span
					key={run.text}
					aria-hidden="true"
					className={cx(
						"block",
						run.weight === "light" ? "text-mist" : "text-paper"
					)}
					// The resting weight; a letter's own --w (set while the
					// pointer is near) overrides it.
					style={{ "--w": BASE_WEIGHT } as React.CSSProperties}
				>
					{run.text.split(" ").map((word, wordIndex) => (
						<span key={wordIndex}>
							{wordIndex > 0 && " "}
							{/* Words never break inside; lines wrap between words. */}
							<span className="inline-block whitespace-nowrap">
								{[...word].map((letter) => {
									const index = letterIndex++;
									return (
										<span
											key={index}
											className="hero-char"
											style={
												{
													"--i": index
												} as React.CSSProperties
											}
										>
											{letter}
										</span>
									);
								})}
							</span>
						</span>
					))}
				</span>
			))}
		</h1>
	);
}
