import { cx } from "~/lib/cx";
import styles from "./Demo.module.css";

/**
 * The demo's mouse pointer. It glides in to where it's placed (its tip on
 * the spot), then clicks: it dips, and a ring spreads from its tip. Place it
 * with `className` (absolute; `top`/`left` set the tip) inside the thing it
 * clicks. With reduced motion it simply rests there.
 */
export function Cursor({
	from,
	className
}: {
	/** Where it glides in from: up the screen, or down from above. */
	from: "above" | "below";
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cx(
				styles.cursor,
				from === "below" && styles.fromBelow,
				"pointer-events-none absolute z-10 size-0",
				className
			)}
		>
			<span className={styles.ripple} />
			<svg
				viewBox="0 0 16 22"
				className={cx(
					styles.arrow,
					"absolute top-0 left-0 h-[1.2rem] w-3.5"
				)}
			>
				<path
					d="M1 1v17.2l4.3-4.1 2.8 6.6 3-1.3-2.8-6.5h6.1z"
					fill="var(--color-paper)"
					stroke="var(--color-void)"
					strokeWidth="1.25"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
}
