"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MotionToggle, useMotionPaused } from "~/components/primitives";
import { demo } from "~/content";
import { cx } from "~/lib/cx";
import styles from "./Demo.module.css";
import { EditorWindow, type ChatMode } from "./EditorWindow";

/** One step of the tour: what each window shows while it plays. */
type Scene = {
	/** How long the step plays, in ms. */
	duration: number;
	/** The account window B runs. Window A stays on the first account. */
	b: 0 | 1;
	chatA: ChatMode;
	chatB: ChatMode;
	pointer: boolean;
	pick: "opening" | "choosing" | null;
	reloading: boolean;
};

/*
 * The story, one scene per step in content/demo.ts. Both windows start on
 * the same account; window A keeps working the whole time. In window B the
 * pointer clicks the account in the status bar, picks the other account,
 * the window reloads onto it, and then both windows run at once, each on
 * its own account (B starts a new conversation: a reload doesn't reopen
 * the old one).
 */
const SCENES: readonly [Scene, Scene, Scene, Scene] = [
	{
		duration: 2900,
		b: 0,
		chatA: "thinking",
		chatB: "empty",
		pointer: true,
		pick: "opening",
		reloading: false
	},
	{
		duration: 2100,
		b: 0,
		chatA: "thinking",
		chatB: "empty",
		pointer: false,
		pick: "choosing",
		reloading: false
	},
	{
		duration: 1600,
		b: 0,
		chatA: "thinking",
		chatB: "empty",
		pointer: false,
		pick: null,
		reloading: true
	},
	{
		duration: 6200,
		b: 1,
		chatA: "answers",
		chatB: "plays",
		pointer: false,
		pick: null,
		reloading: false
	}
];

type Run = {
	step: number;
	/** Counts every (re)start of a step, so its animations play again. */
	restart: number;
};

/**
 * How far a run of a step got before it was paused. A run that starts
 * afresh has a new `restart`, so a clock left by an earlier run never
 * matches it.
 */
type Clock = { restart: number; elapsed: number };

/** A state update that starts `step` afresh. */
const startStep =
	(step: number) =>
	(current: Run): Run => ({ step, restart: current.restart + 1 });

const REDUCED = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
	return useSyncExternalStore(
		(notify) => {
			const query = window.matchMedia(REDUCED);
			query.addEventListener("change", notify);
			return () => query.removeEventListener("change", notify);
		},
		() => window.matchMedia(REDUCED).matches,
		() => false
	);
}

function useVisiblePage() {
	return useSyncExternalStore(
		(notify) => {
			document.addEventListener("visibilitychange", notify);
			return () =>
				document.removeEventListener("visibilitychange", notify);
		},
		() => document.visibilityState === "visible",
		() => true
	);
}

/**
 * "How it works", shown rather than told: two VS Code windows, and a tour
 * that plays the switch in the second one, step by step, with the step
 * named underneath. It plays only while it's on screen, the tab is visible
 * and motion isn't paused; pausing freezes it mid-step (the timings inside a
 * step are CSS delays, held with the timer). Any step can be picked to see
 * it again. With reduced motion nothing plays by itself: each step shows its
 * end state, and the steps are how you move through it.
 *
 * The windows are a picture. A screen reader hears the whole story once
 * (demo.description) and the list of steps.
 */
export function DemoTour() {
	const [first, second] = demo.windows;
	const root = useRef<HTMLDivElement>(null);
	const [run, setRun] = useState<Run>({ step: 0, restart: 0 });
	const [inView, setInView] = useState(false);
	const paused = useMotionPaused();
	const reduced = useReducedMotion();
	const visible = useVisiblePage();
	const playing = inView && visible && !paused && !reduced;

	const clock = useRef<Clock>({ restart: 0, elapsed: 0 });

	useEffect(() => {
		const element = root.current;
		if (!element) return;
		// On screen means reaching into the middle half of the viewport. Not a
		// share of the tour itself: on a phone it is taller than the screen,
		// and scrolled down to its controls it would count as gone.
		const observer = new IntersectionObserver(
			([entry]) => setInView(entry?.isIntersecting ?? false),
			{ rootMargin: "-25% 0px -25% 0px" }
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!playing) return;
		const scene = SCENES[run.step] ?? SCENES[0];
		const own = run.restart;
		const spent = clock.current.restart === own ? clock.current.elapsed : 0;
		const started = performance.now();
		const timer = window.setTimeout(
			() => setRun(startStep((run.step + 1) % SCENES.length)),
			Math.max(0, scene.duration - spent)
		);
		return () => {
			window.clearTimeout(timer);
			// Paused mid-step: remember how far this run got.
			clock.current = {
				restart: own,
				elapsed: spent + performance.now() - started
			};
		};
	}, [playing, run]);

	const scene = SCENES[run.step] ?? SCENES[0];
	const accountB = demo.accounts[scene.b];

	return (
		<div
			ref={root}
			data-tour=""
			data-held={playing ? undefined : ""}
			className={styles.tour}
		>
			<figure>
				<p className="sr-only">{demo.description}</p>

				<div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:items-start">
					<EditorWindow
						win={first}
						account={demo.accounts[0]}
						chat={scene.chatA}
						pointer={false}
						pick={null}
						reloading={false}
						restart={run.restart}
					/>
					<EditorWindow
						win={second}
						account={accountB}
						chat={scene.chatB}
						pointer={scene.pointer}
						pick={scene.pick}
						reloading={scene.reloading}
						restart={run.restart}
						className="lg:mt-14"
					/>
				</div>

				<figcaption className="mt-10 md:mt-14">
					<ol className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
						{demo.steps.map((label, index) => {
							const active = index === run.step;
							return (
								<li key={label}>
									<button
										type="button"
										onClick={() => setRun(startStep(index))}
										aria-current={
											active ? "step" : undefined
										}
										data-active={active || undefined}
										className={cx(
											styles.step,
											"group relative flex min-h-14 w-full items-baseline gap-3 pt-4 pb-3 text-left"
										)}
									>
										<span
											aria-hidden="true"
											className="absolute inset-x-0 top-0 h-px bg-slate"
										/>
										{active && (
											<span
												key={run.restart}
												aria-hidden="true"
												className={cx(
													styles.stepLine,
													"absolute inset-x-0 top-0 h-px bg-paper"
												)}
												style={
													{
														"--step-ms": `${scene.duration}ms`
													} as React.CSSProperties
												}
											/>
										)}
										<span
											aria-hidden="true"
											className={cx(
												styles.stepNum,
												"font-display text-lg leading-none font-extralight italic tabular-nums"
											)}
										>
											{String(index + 1).padStart(2, "0")}
										</span>
										<span
											className={cx(
												styles.stepTitle,
												"font-display text-[1.0625rem] leading-snug font-medium"
											)}
										>
											<span className="sr-only">
												{`Step ${index + 1} of ${demo.steps.length}: `}
											</span>
											{label}
										</span>
									</button>
								</li>
							);
						})}
					</ol>
				</figcaption>
			</figure>

			<div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-slate pt-6">
				<p className="text-[0.9375rem] text-mist">{demo.note}</p>
				<MotionToggle />
			</div>
		</div>
	);
}
