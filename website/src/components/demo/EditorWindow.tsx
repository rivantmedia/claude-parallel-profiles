"use client";

import {
	ArrowUpIcon,
	BellIcon,
	BugIcon,
	CaretDownIcon,
	CircleNotchIcon,
	DotsThreeIcon,
	FilesIcon,
	GearSixIcon,
	GitBranchIcon,
	InfoIcon,
	MagnifyingGlassIcon,
	SquaresFourIcon,
	UserCircleIcon,
	WarningIcon,
	XCircleIcon,
	XIcon
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { RichText } from "~/components/primitives/Code";
import { demo, type DemoWindow } from "~/content";
import { cx } from "~/lib/cx";
import { CodeLines } from "./CodeLines";
import { Codicons, fill } from "./codicons";
import styles from "./Demo.module.css";
import { QuickPick } from "./QuickPick";

/** How long the pointer rests on the item before the hover card shows. */
const CARD_DELAY_MS = 450;
/**
 * How long the card waits after the pointer leaves the item (or the card)
 * before it goes, so the pointer can cross onto the card and stay there.
 */
const CARD_GRACE_MS = 300;

/**
 * One VS Code window, drawn in the brand's greys: title bar, activity bar,
 * explorer, editor, a Claude Code panel with an example exchange, and the
 * status bar with the extension's account item. Everything but that item
 * (and the quick pick it opens) is a picture, hidden from assistive tech;
 * a one-line summary says what the window shows.
 */
export function EditorWindow({
	win,
	account,
	open,
	reloading,
	toast,
	reduced,
	onOpen,
	onClose,
	onChoose,
	onPoint,
	className
}: {
	win: DemoWindow;
	/** The account the window runs right now. */
	account: string;
	/** Its quick pick is open. */
	open: boolean;
	reloading: boolean;
	/** A notification in the corner, if any. */
	toast: string | null;
	reduced: boolean;
	onOpen: () => void;
	onClose: () => void;
	onChoose: (email: string) => void;
	/** The status bar item is under the pointer or has focus. */
	onPoint: (pointing: boolean) => void;
	className?: string;
}) {
	const { statusBar, hoverCard, panel, accounts } = demo;
	const button = useRef<HTMLButtonElement>(null);
	const cardTimer = useRef<number | undefined>(undefined);
	const [card, setCard] = useState(false);
	const listId = `demo-${win.key}-accounts`;
	const cursorLine = Number(/Ln (\d+)/.exec(win.cursor)?.[1] ?? 0);

	useEffect(() => () => window.clearTimeout(cardTimer.current), []);

	// Escape dismisses the hover card without moving the pointer, as VS
	// Code's own hovers do.
	useEffect(() => {
		if (!card) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			window.clearTimeout(cardTimer.current);
			setCard(false);
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [card]);

	function hideCard() {
		window.clearTimeout(cardTimer.current);
		setCard(false);
	}

	/** Hides the card after a short grace, which a pointer on the card cancels. */
	function hideCardSoon() {
		window.clearTimeout(cardTimer.current);
		cardTimer.current = window.setTimeout(
			() => setCard(false),
			CARD_GRACE_MS
		);
	}

	function keepCard() {
		window.clearTimeout(cardTimer.current);
	}

	function close(restore: boolean) {
		onClose();
		if (restore) button.current?.focus({ preventScroll: true });
	}

	function choose(email: string) {
		button.current?.focus({ preventScroll: true });
		onChoose(email);
	}

	function activate() {
		hideCard();
		if (reloading) return;
		if (open) onClose();
		else onOpen();
	}

	function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			if (!open && !reloading) onOpen();
		}
	}

	return (
		<div
			role="group"
			aria-label={`${win.label}, ${win.project}`}
			className={cx(
				styles.window,
				"relative flex flex-col overflow-hidden rounded-2xl bg-graphite",
				className
			)}
		>
			<p className="sr-only">{win.summary}</p>

			{/* Title bar */}
			<div
				aria-hidden="true"
				className="relative flex h-9 shrink-0 items-center border-b border-slate px-3.5"
			>
				<span className="flex gap-2">
					{[0, 1, 2].map((dot) => (
						<span
							key={dot}
							className="size-[0.6875rem] rounded-full bg-smoke/55"
						/>
					))}
				</span>
				<span className="absolute inset-x-20 truncate text-center text-[0.6875rem] text-ash">
					<span className="hidden sm:inline">{win.file} — </span>
					{win.project}
				</span>
			</div>

			{/* Body: remounts on a switch, so it comes back like a reloaded window. */}
			<div
				key={account}
				aria-hidden="true"
				className={cx(
					!reduced && styles.boot,
					"grid min-h-0 grid-cols-[2.5rem_minmax(0,1fr)] md:h-[20rem] md:grid-cols-[2.75rem_9.5rem_minmax(0,1fr)_14rem] lg:h-[21.5rem] lg:grid-cols-[2.75rem_minmax(0,1fr)_12rem] xl:grid-cols-[2.75rem_9.5rem_minmax(0,1fr)_12.5rem]"
				)}
			>
				{/* Activity bar */}
				<div className="row-span-2 flex flex-col items-center justify-between border-r border-slate py-2 md:row-span-1">
					<div className="flex flex-col items-center gap-1">
						{[
							FilesIcon,
							MagnifyingGlassIcon,
							GitBranchIcon,
							BugIcon,
							SquaresFourIcon
						].map((Icon, index) => (
							<span
								key={index}
								className={cx(
									"relative grid size-9 place-items-center",
									index === 0 ? "text-paper" : "text-ash"
								)}
							>
								{index === 0 && (
									<span className="absolute inset-y-1.5 -left-[0.3125rem] w-px bg-paper" />
								)}
								<Icon
									weight="light"
									className="size-[1.125rem]"
								/>
							</span>
						))}
					</div>
					<div className="hidden flex-col items-center gap-1 md:flex">
						{[UserCircleIcon, GearSixIcon].map((Icon, index) => (
							<span
								key={index}
								className="grid size-9 place-items-center text-ash"
							>
								<Icon
									weight="light"
									className="size-[1.125rem]"
								/>
							</span>
						))}
					</div>
				</div>

				{/* Explorer */}
				<div className="hidden min-w-0 border-r border-slate md:block lg:hidden xl:block">
					<div className="flex h-8 items-center justify-between px-3 text-[0.625rem] font-medium tracking-[0.08em] text-ash uppercase">
						Explorer
						<DotsThreeIcon
							weight="light"
							className="size-3.5"
						/>
					</div>
					<div className="flex h-6 items-center gap-1 px-1.5 text-[0.625rem] font-semibold tracking-[0.04em] text-bone uppercase">
						<CaretDownIcon
							weight="light"
							className="size-3 shrink-0"
						/>
						<span className="truncate">{win.project}</span>
					</div>
					<ul className="mt-0.5">
						{win.tree.map((file) => (
							<li
								key={`${file.depth}-${file.name}`}
								className={cx(
									"flex h-[1.375rem] items-center gap-1 truncate pr-2 text-[0.6875rem]",
									file.active
										? "bg-white/[0.06] text-paper"
										: "text-mist"
								)}
								style={{
									paddingLeft: `${0.5 + file.depth * 0.5}rem`
								}}
							>
								{file.kind === "folder" ? (
									<CaretDownIcon
										weight="light"
										className="size-3 shrink-0 text-ash"
									/>
								) : (
									<span className="w-3 shrink-0" />
								)}
								<span className="truncate">{file.name}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Editor */}
				<div className="flex h-[10.5rem] min-w-0 flex-col overflow-hidden bg-carbon md:h-auto">
					<div className="flex h-8 shrink-0 items-stretch border-b border-slate bg-graphite">
						<span className="flex items-center gap-2 border-r border-slate bg-carbon px-3 text-[0.6875rem] text-bone shadow-[inset_0_1px_0_0_var(--color-mist)]">
							{win.file}
							<XIcon
								weight="light"
								className="size-3 text-ash"
							/>
						</span>
					</div>
					<p className="hidden h-6 shrink-0 items-center gap-1 truncate px-3 text-[0.625rem] text-ash md:flex">
						{win.project}
						<span className="text-ash/60">›</span>
						{win.file}
					</p>
					{/* Phones show the first lines only, and the narrow side-by-side
					    windows (lg) the start of the longest ones; either way the
					    code fades out rather than stopping mid-line. */}
					<CodeLines
						lines={win.code}
						cursorLine={cursorLine}
						className="min-h-0 flex-1 overflow-hidden pt-2 max-md:[mask-image:linear-gradient(to_bottom,#000_55%,transparent)] md:pt-0 lg:max-xl:[mask-image:linear-gradient(to_right,#000_78%,transparent)]"
					/>
				</div>

				{/* Claude Code panel */}
				<div className="flex min-w-0 flex-col border-t border-slate md:border-t-0 md:border-l">
					<div className="flex h-8 shrink-0 items-center justify-between px-3 text-[0.625rem] font-medium tracking-[0.08em] text-ash uppercase">
						{panel.title}
						<DotsThreeIcon
							weight="light"
							className="size-3.5"
						/>
					</div>
					<div className="flex flex-1 flex-col gap-3 px-3 pt-1 pb-3 text-[0.71875rem] leading-[1.55]">
						{win.chat.map((message, index) =>
							message.from === "you" ? (
								<p
									key={index}
									className="ml-4 rounded-lg bg-white/[0.05] px-2.5 py-2 text-bone ring-1 ring-slate ring-inset"
								>
									{message.text}
								</p>
							) : (
								<p
									key={index}
									className={cx(
										styles.reply,
										"flex gap-2 text-mist"
									)}
								>
									<span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-ash" />
									<span>
										<RichText text={message.text} />
									</span>
								</p>
							)
						)}
						<div className="mt-auto flex h-9 items-center justify-between rounded-lg bg-carbon pr-1 pl-2.5 ring-1 ring-slate ring-inset">
							<span
								className={cx(
									styles.caret,
									"h-3.5 w-px bg-mist"
								)}
							/>
							<span className="grid size-7 place-items-center rounded-md bg-white/[0.06] text-ash">
								<ArrowUpIcon
									weight="light"
									className="size-3.5"
								/>
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Status bar */}
			<div
				className={cx(
					styles.status,
					"relative flex h-7 shrink-0 items-stretch justify-between border-t border-slate bg-graphite pl-2 text-[0.6875rem] text-ash"
				)}
			>
				<span
					aria-hidden="true"
					className="flex items-center gap-3"
				>
					<span className="flex items-center gap-1">
						<GitBranchIcon
							weight="light"
							className="size-3.5"
						/>
						{win.branch}
					</span>
					<span className="hidden items-center gap-1 sm:flex">
						<XCircleIcon
							weight="light"
							className="size-3.5"
						/>
						0
						<WarningIcon
							weight="light"
							className="ml-1 size-3.5"
						/>
						0
					</span>
				</span>
				<span className="flex min-w-0 items-stretch">
					<span
						aria-hidden="true"
						className="hidden items-center gap-3 pr-3 md:flex lg:hidden xl:flex"
					>
						<span>{win.cursor}</span>
						<span className="hidden 2xl:inline">UTF-8</span>
						<span>{win.language}</span>
					</span>
					<button
						ref={button}
						type="button"
						aria-haspopup="listbox"
						aria-expanded={open}
						aria-controls={open ? listId : undefined}
						aria-disabled={reloading || undefined}
						onClick={activate}
						onKeyDown={onKeyDown}
						onFocus={() => onPoint(true)}
						onBlur={() => onPoint(false)}
						onPointerEnter={(event) => {
							onPoint(true);
							if (event.pointerType !== "mouse" || open) return;
							window.clearTimeout(cardTimer.current);
							// Back from the card: it is already showing.
							if (card) return;
							cardTimer.current = window.setTimeout(
								() => setCard(true),
								CARD_DELAY_MS
							);
						}}
						onPointerLeave={() => {
							// The pointer may be on its way onto the card.
							if (card) hideCardSoon();
							else hideCard();
							if (document.activeElement !== button.current)
								onPoint(false);
						}}
						className={cx(
							styles.item,
							"relative flex min-w-0 items-center gap-2 px-2.5 outline-offset-[-2px] transition-colors duration-300 ease-spring before:absolute before:inset-x-0 before:-top-4 before:bottom-0 before:content-[''] hover:bg-white/[0.08] hover:text-paper",
							open ? "bg-white/[0.08] text-paper" : "text-bone"
						)}
					>
						<span
							aria-hidden="true"
							className={cx("live-dot shrink-0", styles.dot)}
						/>
						<span className="sr-only">
							{win.label}, {statusBar.itemName}:{" "}
						</span>
						<Codicons
							text={fill(statusBar.format, { email: account })}
							className="min-w-0"
						/>
					</button>
					<span
						aria-hidden="true"
						className="flex items-center px-2.5"
					>
						<BellIcon
							weight="light"
							className="size-3.5"
						/>
					</span>
				</span>
			</div>

			{open && (
				<QuickPick
					id={listId}
					current={account}
					anchor={button}
					onChoose={choose}
					onClose={close}
				/>
			)}

			{/* Hoverable: the pointer can move onto it and stay, and Escape
			    dismisses it. */}
			{card && !open && !reloading && (
				<div
					aria-hidden="true"
					onPointerEnter={keepCard}
					onPointerLeave={hideCardSoon}
					className={cx(
						styles.pop,
						"absolute right-2 bottom-9 z-30 w-[min(calc(100%-1rem),19rem)] rounded-lg bg-carbon p-3 text-[0.6875rem] leading-relaxed text-mist ring-1 ring-smoke/70"
					)}
				>
					<Codicons
						text={`$(account) ${hoverCard.title}`}
						className="font-semibold text-paper"
					/>
					<p className="mt-2 font-semibold text-paper">{account}</p>
					<p className="mt-1.5">{hoverCard.runs}</p>
					<p className="mt-1.5">
						{fill(hoverCard.saved, { count: "" })}
						<strong className="font-semibold text-bone">
							{accounts.length}
						</strong>
					</p>
					<p className="mt-2 flex flex-wrap items-center gap-x-2 text-bone">
						<Codicons
							text={`$(arrow-swap) ${hoverCard.actions.switch}`}
						/>
						<span className="text-ash">·</span>
						<Codicons
							text={`$(trash) ${hoverCard.actions.forget}`}
						/>
					</p>
					<span className="my-2.5 block h-px bg-slate" />
					<p className="flex flex-wrap items-center gap-x-2">
						<Codicons
							text={`$(extensions) ${hoverCard.links.extension}`}
						/>
						<span className="text-ash">·</span>
						<Codicons text={`$(output) ${hoverCard.links.log}`} />
					</p>
				</div>
			)}

			{toast && !open && (
				<div
					aria-hidden="true"
					className={cx(
						styles.pop,
						"absolute right-2 bottom-9 z-30 flex w-[min(calc(100%-1rem),19rem)] items-start gap-2 rounded-lg bg-carbon px-3 py-2.5 text-[0.6875rem] leading-snug text-bone ring-1 ring-smoke/70"
					)}
				>
					<InfoIcon
						weight="light"
						className="mt-px size-3.5 shrink-0 text-mist"
					/>
					{toast}
				</div>
			)}

			{reloading && !reduced && (
				<div
					aria-hidden="true"
					className={cx(
						styles.reload,
						"absolute inset-x-0 top-9 bottom-0 z-40 grid place-items-center bg-graphite"
					)}
				>
					<span className="flex items-center gap-2.5 text-[0.75rem] text-mist">
						<CircleNotchIcon
							weight="light"
							className={cx(styles.spin, "size-4 text-ash")}
						/>
						{demo.reload.overlay}
					</span>
				</div>
			)}
		</div>
	);
}
