"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { demo } from "~/content";
import { cx } from "~/lib/cx";
import { Codicons } from "./codicons";
import styles from "./Demo.module.css";

/**
 * "Switch Account for This Window": VS Code's quick pick, drawn at the top of
 * the window it belongs to. The list takes focus when it opens. Arrow keys,
 * Home and End move through the accounts, Enter chooses, Escape closes and
 * hands focus back to the status bar item. Leaving it (Tab, a click
 * elsewhere) closes it too. The account the window runs is ticked and says
 * "current", as in the extension; the first other account starts active,
 * so Enter switches straight away.
 */
export function QuickPick({
	id,
	current,
	anchor,
	onChoose,
	onClose
}: {
	id: string;
	current: string;
	/** The status bar item that opened it; clicking it again toggles. */
	anchor: React.RefObject<HTMLButtonElement | null>;
	onChoose: (email: string) => void;
	/** `restore`: put focus back on the status bar item. */
	onClose: (restore: boolean) => void;
}) {
	const { accounts, quickPick } = demo;
	const [active, setActive] = useState(() =>
		Math.max(
			0,
			accounts.findIndex((email) => email !== current)
		)
	);
	const panel = useRef<HTMLDivElement>(null);
	const list = useRef<HTMLUListElement>(null);
	// A click elsewhere both lands outside and blurs the list; close (and
	// announce it) once.
	const closed = useRef(false);
	const dismiss = useCallback(
		(restore: boolean) => {
			if (closed.current) return;
			closed.current = true;
			onClose(restore);
		},
		[onClose]
	);
	const titleId = `${id}-title`;
	const optionId = (index: number) => `${id}-option-${index}`;

	useEffect(() => {
		list.current?.focus({ preventScroll: true });
	}, []);

	// A tap or click anywhere else closes it (touch doesn't always blur).
	useEffect(() => {
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node;
			if (panel.current?.contains(target)) return;
			if (anchor.current?.contains(target)) return;
			dismiss(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [anchor, dismiss]);

	function onKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
		const last = accounts.length - 1;
		const moves: Record<string, () => number> = {
			ArrowDown: () => (active >= last ? 0 : active + 1),
			ArrowUp: () => (active <= 0 ? last : active - 1),
			Home: () => 0,
			End: () => last
		};
		const move = moves[event.key];
		if (move) {
			event.preventDefault();
			setActive(move());
			return;
		}
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			const email = accounts[active];
			if (email) onChoose(email);
			return;
		}
		if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			dismiss(true);
		}
	}

	function onBlur(event: React.FocusEvent<HTMLUListElement>) {
		const next = event.relatedTarget as Node | null;
		if (next && panel.current?.contains(next)) return;
		// Focus moving to the item is a click on it, which toggles.
		if (next && anchor.current?.contains(next)) return;
		dismiss(false);
	}

	return (
		<div
			ref={panel}
			className={cx(
				styles.quickPick,
				"absolute inset-x-3 top-11 z-30 mx-auto max-w-[26rem] rounded-xl bg-carbon p-1.5 ring-1 ring-smoke/70"
			)}
		>
			<p
				id={titleId}
				className="px-2 pt-1 pb-2 text-center text-[0.6875rem] leading-snug text-mist"
			>
				{quickPick.title}
			</p>
			<div
				aria-hidden="true"
				className="flex h-8 items-center rounded-md bg-void px-2.5 text-[0.71875rem] text-ash ring-1 ring-slate ring-inset"
			>
				<span className={cx(styles.caret, "mr-1 h-3.5 w-px bg-bone")} />
				<span className="truncate">{quickPick.placeholder}</span>
			</div>
			<ul
				ref={list}
				id={id}
				role="listbox"
				tabIndex={-1}
				aria-labelledby={titleId}
				aria-activedescendant={optionId(active)}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
				className="mt-1.5 outline-none"
			>
				{accounts.map((email, index) => {
					const isCurrent = email === current;
					const isActive = index === active;
					return (
						<li
							key={email}
							id={optionId(index)}
							role="option"
							aria-selected={isActive}
							onPointerMove={() => setActive(index)}
							onClick={() => onChoose(email)}
							className={cx(
								styles.option,
								"flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2.5 text-[0.75rem] transition-colors duration-150",
								isActive
									? "bg-white/[0.08] text-paper ring-1 ring-paper/35 ring-inset"
									: "text-bone"
							)}
						>
							<Codicons
								text={`${isCurrent ? quickPick.currentIcon : quickPick.otherIcon} ${email}`}
								className="min-w-0 truncate"
								iconClassName={
									isCurrent ? "text-paper" : "text-ash"
								}
							/>
							{isCurrent && (
								<span className="ml-auto shrink-0 text-[0.6875rem] text-ash">
									{quickPick.currentDescription}
								</span>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
