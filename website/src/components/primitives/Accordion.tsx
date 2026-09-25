import { PlusIcon } from "@phosphor-icons/react/ssr";
import type { Rich } from "~/content";
import { cn } from "~/lib/utils";
import styles from "./Accordion.module.css";
import { RichText } from "./Code";
import { IndexNumeral } from "./IndexNumeral";

type AccordionItem = {
	readonly title: string;
	/** An optional one-line summary under the title, shown while closed too. */
	readonly summary?: Rich;
	/** One paragraph, or several in order. */
	readonly body: Rich | readonly Rich[];
};

/**
 * The site's expandable list, one look wherever it is used (How it works,
 * Limitations): native <details>/<summary>, so it works without JavaScript,
 * every row is a real button for keyboards and screen readers, and a search
 * in the page opens the row that holds the match. Rows sharing `name` are
 * exclusive: opening one closes the one before.
 *
 * Each row: a slate hairline on top (and one under the last), a numeral
 * (extralight italic, ash) on the title's baseline, the title (Montserrat
 * 400, paper) with an optional summary (mist), and a plus in a smoke-ringed
 * circle that turns into a cross when open. As the list arrives its
 * hairlines draw in one after the next and the rows rise; a body opens with
 * a short height and opacity transition. Under reduced motion it is all
 * simply there.
 *
 * The summary is plain text rather than a heading: some screen readers drop
 * a heading's role inside a summary, which already reads as a button.
 */
export function Accordion({
	items,
	name,
	className
}: {
	items: readonly AccordionItem[];
	/** Groups the rows so only one is open at a time. */
	name?: string;
	className?: string;
}) {
	return (
		// role="list": Safari drops list semantics from a list without markers.
		<ol
			role="list"
			data-reveal=""
			className={cn(styles.list, className)}
		>
			{items.map((item, index) => {
				const paragraphs: readonly Rich[] =
					typeof item.body === "string" ? [item.body] : item.body;

				return (
					<li
						key={item.title}
						className={styles.row}
						style={{ "--i": index } as React.CSSProperties}
					>
						<details
							name={name}
							className={styles.item}
						>
							<summary
								className={cn(
									styles.summary,
									// -mx-3 px-3: the focus ring stands clear of the
									// numeral and the circle; the content stays on
									// the hairline's edges.
									"-mx-3 grid cursor-pointer grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-4 rounded-2xl px-3 py-6 md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:gap-x-6 md:py-8"
								)}
							>
								{/* The <ol> already gives the order to assistive tech.
								    Numeral and title share a baseline; the circle centres. */}
								<IndexNumeral
									value={index + 1}
									size="small"
								/>
								<span className="min-w-0">
									<span
										className={cn(
											styles.title,
											"block font-display text-xl leading-snug font-normal text-paper md:text-2xl"
										)}
									>
										{item.title}
									</span>
									{item.summary && (
										<span className="mt-2 block max-w-[62ch] text-sm leading-relaxed text-mist md:text-base">
											<RichText text={item.summary} />
										</span>
									)}
								</span>
								<span
									aria-hidden="true"
									className={cn(
										styles.well,
										"grid size-11 shrink-0 place-items-center self-center rounded-full text-paper ring-1 ring-smoke ring-inset"
									)}
								>
									<PlusIcon
										weight="light"
										className={cn(styles.plus, "size-5")}
									/>
								</span>
							</summary>

							{/* Indented to the title's column. */}
							<div
								className={cn(
									styles.body,
									"grid gap-4 pb-8 pl-13 text-base leading-relaxed text-bone md:pl-20 md:text-[1.0625rem]"
								)}
							>
								{paragraphs.map((paragraph) => (
									<p
										key={paragraph}
										className="max-w-[62ch]"
									>
										<RichText text={paragraph} />
									</p>
								))}
							</div>
						</details>
					</li>
				);
			})}
		</ol>
	);
}
