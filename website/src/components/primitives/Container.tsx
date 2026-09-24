import { cn } from "~/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLElement> & {
	as?: "div" | "header" | "footer" | "nav" | "article";
};

/** Max-width content wrapper with the site's side gutters. */
export function Container({
	as: Tag = "div",
	className,
	...props
}: ContainerProps) {
	return (
		<Tag
			className={cn(
				"mx-auto w-full max-w-[1440px] px-5 md:px-10",
				className
			)}
			{...props}
		/>
	);
}
