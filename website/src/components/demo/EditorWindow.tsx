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
	MagnifyingGlassIcon,
	SquaresFourIcon,
	UserCircleIcon,
	WarningIcon,
	XCircleIcon,
	XIcon
} from "@phosphor-icons/react";
import { RichText } from "~/components/primitives/Code";
import { demo, type DemoMessage, type DemoWindow } from "~/content";
import { cx } from "~/lib/cx";
import { CodeLines } from "./CodeLines";
import { Codicons, fill } from "./codicons";
import { Cursor } from "./Cursor";
import styles from "./Demo.module.css";
import { QuickPick } from "./QuickPick";

/**
 * What the window's Claude Code panel shows in a step:
 * - `empty`: no conversation yet.
 * - `thinking`: the question, and Claude working on it.
 * - `answers`: the same, and the answer arrives.
 * - `plays`: the whole exchange plays out, from the question on.
 */
export type ChatMode = "empty" | "thinking" | "answers" | "plays";

/** When things happen within a step, in ms (see Demo.module.css). */
const AT = {
	/** The pointer's click on the status bar item; the quick pick drops in. */
	click: 1100,
	/** `answers`: the answer replaces the working dots. */
	answer: 1300,
	/** `plays`: the question, the working dots, then the answer. */
	ask: 500,
	working: 1100,
	reply: 2900
} as const;

const ms = (value: number) => `${value}ms`;

/**
 * One VS Code window, drawn in the brand's greys: title bar, activity bar,
 * explorer, editor, a Claude Code panel, and the status bar with the
 * extension's account item. A picture, hidden from assistive tech: the tour
 * around it (DemoTour) says what it shows. What changes from step to step
 * comes in as props; the timings within a step are CSS delays, so a paused
 * tour pauses them too.
 */
export function EditorWindow({
	win,
	account,
	chat,
	pointer,
	pick,
	reloading,
	restart,
	className
}: {
	win: DemoWindow;
	/** The account the window runs. */
	account: string;
	chat: ChatMode;
	/** The pointer comes to the status bar item and clicks it. */
	pointer: boolean;
	/** The account quick pick: dropping in, open with the pointer on the other account, or closed. */
	pick: "opening" | "choosing" | null;
	reloading: boolean;
	/** Changes when a step (re)starts, so its animations play again. */
	restart: number;
	className?: string;
}) {
	const cursorLine = Number(/Ln (\d+)/.exec(win.cursor)?.[1] ?? 0);

	return (
		<div
			aria-hidden="true"
			className={cx(
				styles.window,
				"relative flex flex-col overflow-hidden rounded-2xl bg-graphite",
				className
			)}
		>
			{/* Title bar */}
			<div className="relative flex h-9 shrink-0 items-center border-b border-slate px-3.5">
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
				className={cx(
					styles.boot,
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
				<div className="flex min-h-[11rem] min-w-0 flex-col border-t border-slate md:min-h-0 md:border-t-0 md:border-l">
					<div className="flex h-8 shrink-0 items-center justify-between px-3 text-[0.625rem] font-medium tracking-[0.08em] text-ash uppercase">
						{demo.panelTitle}
						<DotsThreeIcon
							weight="light"
							className="size-3.5"
						/>
					</div>
					<Chat
						key={restart}
						messages={win.chat}
						mode={chat}
					/>
				</div>
			</div>

			{/* Status bar */}
			<div className="relative flex h-7 shrink-0 items-stretch justify-between border-t border-slate bg-graphite pl-2 text-[0.6875rem] text-ash">
				<span className="flex items-center gap-3">
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
					<span className="hidden items-center gap-3 pr-3 md:flex lg:hidden xl:flex">
						<span>{win.cursor}</span>
						<span className="hidden 2xl:inline">UTF-8</span>
						<span>{win.language}</span>
					</span>
					{/* The extension's account item. It lights as the pointer
					    clicks it, and stays lit while its quick pick is open. */}
					<span
						key={pointer ? restart : "item"}
						className={cx(
							pointer && styles.clicked,
							"relative flex min-w-0 items-center gap-2 px-2.5",
							pick ? "bg-white/[0.08] text-paper" : "text-bone"
						)}
					>
						<span className={cx("live-dot shrink-0", styles.dot)} />
						<Codicons
							text={fill(demo.statusBar, { email: account })}
							className="min-w-0"
						/>
						{pointer && (
							<Cursor
								key={restart}
								from="above"
								className="top-[22%] left-[58%]"
							/>
						)}
					</span>
					<span className="flex items-center px-2.5">
						<BellIcon
							weight="light"
							className="size-3.5"
						/>
					</span>
				</span>
			</div>

			{pick && (
				<QuickPick
					key={pick === "opening" ? restart : "open"}
					current={account}
					opening={pick === "opening"}
					pointer={pick === "choosing"}
					restart={restart}
				/>
			)}

			{reloading && (
				<div
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
						{demo.reloading}
					</span>
				</div>
			)}
		</div>
	);
}

/** The panel's conversation for one step, per `mode` (see ChatMode). */
function Chat({
	messages,
	mode
}: {
	messages: readonly [DemoMessage, DemoMessage];
	mode: ChatMode;
}) {
	const [ask, reply] = messages;
	const plays = mode === "plays";

	return (
		<div className="flex flex-1 flex-col gap-3 px-3 pt-1 pb-3 text-[0.71875rem] leading-[1.55]">
			{mode !== "empty" && (
				<p
					className={cx(
						plays && styles.enter,
						"ml-4 rounded-lg bg-white/[0.05] px-2.5 py-2 text-bone ring-1 ring-slate ring-inset"
					)}
					style={plays ? { animationDelay: ms(AT.ask) } : undefined}
				>
					{ask.text}
				</p>
			)}
			{mode !== "empty" && (
				<p
					className={cx(
						plays && styles.enter,
						"grid text-mist [&>*]:[grid-area:1/1]"
					)}
					style={
						plays ? { animationDelay: ms(AT.working) } : undefined
					}
				>
					{/* Claude at work, then its answer in the same place (the
					    answer's height is kept from the start, so nothing
					    jumps). `thinking` never gets past the dots. */}
					<span
						className={cx(
							styles.working,
							mode !== "thinking" && styles.done
						)}
						style={
							mode === "thinking"
								? undefined
								: {
										animationDelay: ms(
											plays ? AT.reply : AT.answer
										)
									}
						}
					>
						<span />
						<span />
						<span />
					</span>
					<span
						className={cx(
							"flex gap-2",
							mode === "thinking" ? "invisible" : styles.answer
						)}
						style={
							mode === "thinking"
								? undefined
								: {
										animationDelay: ms(
											plays ? AT.reply : AT.answer
										)
									}
						}
					>
						<span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-ash" />
						<span>
							<RichText text={reply.text} />
						</span>
					</span>
				</p>
			)}
			<div className="mt-auto flex h-9 items-center justify-between rounded-lg bg-carbon pr-1 pl-2.5 ring-1 ring-slate ring-inset">
				<span className={cx(styles.caret, "h-3.5 w-px bg-mist")} />
				<span className="grid size-7 place-items-center rounded-md bg-white/[0.06] text-ash">
					<ArrowUpIcon
						weight="light"
						className="size-3.5"
					/>
				</span>
			</div>
		</div>
	);
}
