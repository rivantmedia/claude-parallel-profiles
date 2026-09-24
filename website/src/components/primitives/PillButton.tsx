import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { cn } from "~/lib/utils";

type Variant = "solid" | "ghost";

type CommonProps = {
	children: React.ReactNode;
	variant?: Variant;
	className?: string;
	/** Leans toward a nearby fine pointer (the scroll layer's data-magnetic). */
	magnetic?: boolean;
	/** Replaces the arrow in the well (an icon at size-4, weight "light"). */
	icon?: React.ReactNode;
};

type LinkProps = CommonProps & {
	href: string;
	/**
	 * Opens in a new tab, with rel="noopener noreferrer" and a screen-reader
	 * hint. Defaults to true for http(s) addresses.
	 */
	external?: boolean;
};

type ButtonProps = CommonProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
		href?: undefined;
		external?: undefined;
	};

const shell: Record<Variant, string> = {
	solid: "bg-paper text-void hover:bg-bone",
	ghost: "text-paper ring-1 ring-inset ring-smoke hover:bg-white/[0.04] hover:ring-paper/50"
};

const well: Record<Variant, string> = {
	solid: "bg-void/[0.07]",
	ghost: "bg-white/10"
};

/** Said after the label of every link that opens a new tab. */
export const NEW_TAB_HINT = "(opens in a new tab)";

/**
 * Primary call to action. The arrow sits in its own circular well
 * ("button-in-button") and nudges up-right on hover; the whole pill presses
 * down slightly when clicked. Internal hrefs go through next/link (which adds
 * the base path); external ones open in a new tab.
 */
export function PillButton(props: LinkProps | ButtonProps) {
	const { children, variant = "solid", className, magnetic, icon } = props;

	const classes = cn(
		"group inline-flex min-h-12 items-center gap-3 rounded-full py-1.5 pr-1.5 pl-6 text-sm font-semibold tracking-[0.01em] whitespace-nowrap transition-[background-color,color,scale,box-shadow] duration-500 ease-spring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
		shell[variant],
		className
	);

	const content = (external: boolean) => (
		<>
			<span>
				{children}
				{external && <span className="sr-only"> {NEW_TAB_HINT}</span>}
			</span>
			<span
				aria-hidden="true"
				className={cn(
					"grid size-9 place-items-center rounded-full transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105",
					well[variant]
				)}
			>
				{icon ?? (
					<ArrowUpRightIcon
						weight="light"
						className="size-4"
					/>
				)}
			</span>
		</>
	);

	const magneticProps = magnetic
		? { "data-magnetic": "0.25", "data-magnetic-radius": "110" }
		: {};

	if (props.href !== undefined) {
		const external = props.external ?? /^https?:\/\//.test(props.href);
		if (external) {
			return (
				<a
					href={props.href}
					target="_blank"
					rel="noopener noreferrer"
					className={classes}
					{...magneticProps}
				>
					{content(true)}
				</a>
			);
		}
		return (
			<Link
				href={props.href}
				className={classes}
				{...magneticProps}
			>
				{content(false)}
			</Link>
		);
	}

	// Everything left over is a native <button> attribute.
	const {
		children: _children,
		variant: _variant,
		className: _className,
		magnetic: _magnetic,
		icon: _icon,
		href: _href,
		external: _external,
		type = "button",
		...buttonProps
	} = props;

	return (
		<button
			type={type}
			className={classes}
			{...magneticProps}
			{...buttonProps}
		>
			{content(false)}
		</button>
	);
}
