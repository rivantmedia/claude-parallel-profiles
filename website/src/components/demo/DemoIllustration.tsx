"use client";

import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore
} from "react";
import { RichText } from "~/components/primitives/Code";
import { demo } from "~/content";
import { cx } from "~/lib/cx";
import { Codicons, fill } from "./codicons";
import styles from "./Demo.module.css";
import { EditorWindow } from "./EditorWindow";

type Key = "a" | "b";

type State = {
	/** The account each window runs. */
	accounts: Record<Key, string>;
	/** The window whose quick pick is open. */
	open: Key | null;
	reloading: Record<Key, boolean>;
	/** The window switched last, once its reload is done. */
	switched: Key | null;
	/** The status bar item under the pointer or focused. */
	pointing: Key | null;
	toast: { key: Key; text: string } | null;
};

const [first, second] = demo.windows;

const initial: State = {
	accounts: { a: first.account, b: second.account },
	open: null,
	reloading: { a: false, b: false },
	switched: null,
	pointing: null,
	toast: null
};

/** How long the mock's reload takes, in ms. Instant with reduced motion. */
const RELOAD_MS = 1300;
const TOAST_MS = 4000;

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

const windowOf = (key: Key) => (key === "a" ? first : second);
const otherOf = (key: Key): Key => (key === "a" ? "b" : "a");

/**
 * The interactive half of "See it": two windows, each with its own account
 * in the status bar. Clicking an item opens that window's quick pick;
 * choosing another account plays a short reload, after which that window
 * runs the new account and still shows its conversation, while the other
 * window is unchanged. The steps below light up as the visitor goes, a
 * polite live region says what happened, and Reset puts both windows back.
 */
export function DemoIllustration() {
	const { steps, controls, narration, statusBar, illustration } = demo;
	const reduced = useReducedMotion();
	const [state, setState] = useState<State>(initial);
	const [message, setMessage] = useState("");
	const timers = useRef<Record<string, number | undefined>>({});

	useEffect(() => {
		const pending = timers.current;
		return () =>
			Object.values(pending).forEach((id) => window.clearTimeout(id));
	}, []);

	/** Says it through the live region, even when it's the same words again. */
	const say = useCallback((text: string) => {
		setMessage((previous) => (previous === text ? `${text} ` : text));
	}, []);

	const later = (name: string, ms: number, run: () => void) => {
		window.clearTimeout(timers.current[name]);
		timers.current[name] = window.setTimeout(run, ms);
	};

	const words = (key: Key, accounts: Record<Key, string>, extra = {}) => ({
		window: windowOf(key).label,
		other: windowOf(otherOf(key)).label,
		email: accounts[key],
		otherEmail: accounts[otherOf(key)],
		...extra
	});

	function open(key: Key) {
		setState((s) => ({ ...s, open: key, toast: null }));
		say(fill(narration.opened, words(key, state.accounts)));
	}

	/** The visitor dismissed the list (Escape, a click elsewhere, the item again). */
	function close(key: Key) {
		if (state.open !== key) return;
		setState((s) => (s.open === key ? { ...s, open: null } : s));
		say(fill(narration.closed, words(key, state.accounts)));
	}

	function choose(key: Key, email: string) {
		const accounts = state.accounts;
		if (email === accounts[key]) {
			const text = fill(demo.alreadyCurrent, { email });
			setState((s) => ({ ...s, open: null, toast: { key, text } }));
			say(text);
			later("toast", TOAST_MS, () =>
				setState((s) => ({ ...s, toast: null }))
			);
			return;
		}

		const next = { ...accounts, [key]: email };
		const done = () => {
			setState((s) => ({
				...s,
				accounts: { ...s.accounts, [key]: email },
				reloading: { ...s.reloading, [key]: false },
				switched: key
			}));
			say(fill(narration.switched, words(key, next)));
		};

		if (reduced) {
			setState((s) => ({ ...s, open: null, toast: null }));
			done();
			return;
		}
		setState((s) => ({
			...s,
			open: null,
			toast: null,
			reloading: { ...s.reloading, [key]: true }
		}));
		say(fill(narration.reloading, words(key, next)));
		later(`reload-${key}`, RELOAD_MS, done);
	}

	function reset() {
		// Cleared in place: the unmount cleanup holds this same object.
		for (const name of Object.keys(timers.current)) {
			window.clearTimeout(timers.current[name]);
			delete timers.current[name];
		}
		setState(initial);
		say(fill(narration.reset, words("a", initial.accounts)));
	}

	const reloading = state.reloading.a || state.reloading.b;
	const step = reloading
		? 3
		: state.open
			? 2
			: state.switched
				? 4
				: state.pointing
					? 1
					: 0;

	return (
		<div>
			<figure>
				<div className="flex items-center justify-between gap-x-6 gap-y-4 pb-6 max-md:flex-wrap md:pb-8">
					<span className="inline-flex items-center rounded-full px-3.5 py-2 text-eyebrow font-semibold text-ash uppercase ring-1 ring-smoke/70 ring-inset">
						{illustration.label}
					</span>
					{/* Its own line on phones, beside the label from md. The
					    hint and Reset need the page's scripts (see .needs-js);
					    without them the mock is a picture, and says so. */}
					<p className="needs-js order-last w-full text-[0.9375rem] text-mist md:order-none md:mr-auto md:w-auto">
						{controls.hint}
					</p>
					<noscript>
						<p className="order-last w-full text-[0.9375rem] text-mist md:order-none md:mr-auto md:w-auto">
							{controls.noScript}
						</p>
					</noscript>
					<button
						type="button"
						onClick={reset}
						className="needs-js group inline-flex min-h-11 items-center gap-2 rounded-full pr-5 pl-4 text-sm font-semibold text-mist ring-1 ring-smoke/70 transition-[color,background-color,box-shadow,scale] duration-500 ease-spring ring-inset hover:bg-paper hover:text-void hover:ring-paper active:scale-95"
					>
						<ArrowCounterClockwiseIcon
							weight="light"
							aria-hidden="true"
							className="size-4 transition-transform duration-500 ease-spring group-hover:-rotate-45"
						/>
						{controls.reset}
					</button>
				</div>

				<div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:items-start">
					{demo.windows.map((win, index) => (
						<EditorWindow
							key={win.key}
							win={win}
							account={state.accounts[win.key]}
							open={state.open === win.key}
							reloading={state.reloading[win.key]}
							toast={
								state.toast?.key === win.key
									? state.toast.text
									: null
							}
							reduced={reduced}
							onOpen={() => open(win.key)}
							onClose={() => close(win.key)}
							onChoose={(email) => choose(win.key, email)}
							onPoint={(pointing) =>
								setState((s) => ({
									...s,
									pointing: pointing
										? win.key
										: s.pointing === win.key
											? null
											: s.pointing
								}))
							}
							className={cx(index === 1 && "lg:mt-14")}
						/>
					))}
				</div>

				<figcaption className="mt-6 max-w-[62ch] text-[0.8125rem] leading-relaxed text-ash">
					{illustration.note}
				</figcaption>
			</figure>

			<p
				role="status"
				className="sr-only"
			>
				{message}
			</p>

			<div className="mt-16 md:mt-24">
				<h3
					id="demo-steps-title"
					className="font-sans text-eyebrow font-semibold text-ash uppercase"
				>
					{demo.stepsTitle}
				</h3>
				<ol
					aria-labelledby="demo-steps-title"
					className="mt-6 grid gap-y-8 md:mt-8 md:grid-cols-2 md:gap-x-8 lg:grid-cols-5 lg:grid-rows-[auto_auto] lg:gap-y-0"
				>
					{steps.map((item, index) => {
						const active = index === step;
						return (
							<li
								key={item.title}
								aria-current={active ? "step" : undefined}
								data-active={active || undefined}
								// A subgrid on lg, so every caption starts on one line
								// however the titles above them wrap.
								className={cx(
									styles.step,
									"relative pt-5 lg:row-span-2 lg:grid lg:grid-rows-subgrid"
								)}
							>
								<span
									aria-hidden="true"
									className="absolute inset-x-0 top-0 h-px bg-slate"
								/>
								<span
									aria-hidden="true"
									className={cx(
										styles.stepLine,
										"absolute inset-x-0 top-0 h-px bg-paper"
									)}
								/>
								<p className="flex items-baseline gap-3">
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
											"font-display text-[1.0625rem] leading-snug font-semibold"
										)}
									>
										{item.title}
									</span>
								</p>
								<p
									className={cx(
										styles.stepText,
										"mt-2.5 max-w-[46ch] text-sm leading-relaxed"
									)}
								>
									<RichText text={item.caption} />
								</p>
							</li>
						);
					})}
				</ol>
			</div>

			<div className="mt-16 md:mt-24">
				<h3
					id="demo-legend-title"
					className="font-sans text-eyebrow font-semibold text-ash uppercase"
				>
					{statusBar.legendTitle}
				</h3>
				<dl
					aria-labelledby="demo-legend-title"
					className="mt-6 grid gap-y-8 md:mt-8 md:grid-cols-3 md:gap-x-8"
				>
					{statusBar.legend.map((item) => (
						<div key={item.text}>
							<dt>
								<span className="inline-flex h-8 items-center rounded-md bg-graphite px-3 text-[0.75rem] text-bone ring-1 ring-slate ring-inset">
									<Codicons
										text={item.text}
										spoken
									/>
								</span>
							</dt>
							<dd className="mt-4 max-w-[40ch] text-sm leading-relaxed text-mist">
								<RichText text={item.meaning} />
							</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
