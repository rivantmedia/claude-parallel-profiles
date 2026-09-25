import { demo } from "~/content";
import { cx } from "~/lib/cx";
import { Codicons } from "./codicons";
import { Cursor } from "./Cursor";
import styles from "./Demo.module.css";

/**
 * "Switch Account for This Window": VS Code's quick pick, drawn at the top of
 * the window it belongs to, as the extension fills it. The account the
 * window runs is ticked and says "current"; the other one is highlighted,
 * as the extension highlights it, so Enter would switch straight away.
 * A picture: the tour around it (DemoTour) says what it shows.
 */
export function QuickPick({
	current,
	opening,
	pointer,
	restart
}: {
	current: string;
	/** Drops in after the pointer's click, rather than already being open. */
	opening: boolean;
	/** The pointer comes to the highlighted account and clicks it. */
	pointer: boolean;
	/** Changes when a step (re)starts, so the pointer plays again. */
	restart: number;
}) {
	const { accounts, quickPick } = demo;
	const active = accounts.find((email) => email !== current);

	return (
		<div
			className={cx(
				styles.quickPick,
				opening && styles.opening,
				"absolute inset-x-3 top-11 z-30 mx-auto max-w-[26rem] rounded-xl bg-carbon p-1.5 ring-1 ring-smoke/70"
			)}
		>
			<p className="px-2 pt-1 pb-2 text-center text-[0.6875rem] leading-snug text-mist">
				{quickPick.title}
			</p>
			<div className="flex h-8 items-center rounded-md bg-void px-2.5 text-[0.71875rem] text-ash ring-1 ring-slate ring-inset">
				<span className={cx(styles.caret, "mr-1 h-3.5 w-px bg-bone")} />
				<span className="truncate">{quickPick.placeholder}</span>
			</div>
			<ul className="mt-1.5">
				{accounts.map((email) => {
					const isCurrent = email === current;
					const isActive = email === active;
					return (
						<li
							key={email}
							className={cx(
								"relative flex min-h-10 items-center gap-3 rounded-md px-2.5 text-[0.75rem]",
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
							{isActive && pointer && (
								<Cursor
									key={restart}
									from="below"
									className="top-1/2 left-[38%]"
								/>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
