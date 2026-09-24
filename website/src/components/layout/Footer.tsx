import { ArrowUpIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import {
	Container,
	Lockup,
	NEW_TAB_HINT,
	Parallax,
	Shape
} from "~/components/primitives";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import styles from "./Footer.module.css";

/** Names a footer column. Styled like an eyebrow, but a real heading for screen readers. */
function ColumnHeading({
	id,
	children
}: {
	id: string;
	children: React.ReactNode;
}) {
	return (
		<h2
			id={id}
			className="font-sans text-eyebrow font-semibold text-ash uppercase"
		>
			{children}
		</h2>
	);
}

// Tall tap targets on touch, tighter rhythm once there's a fine pointer.
const linkClass = cn(
	styles.link,
	"group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] text-bone transition-colors duration-300 ease-spring hover:text-paper lg:min-h-10"
);

type FooterLink = { label: string; href: string; external: boolean };

/** One footer link: internal through next/link, external in a new tab with
    a small arrow (and the same hint in words for screen readers). */
function FooterLink({ link }: { link: FooterLink }) {
	const label = <span className={styles.label}>{link.label}</span>;
	if (!link.external) {
		return (
			<Link
				href={link.href}
				className={linkClass}
			>
				{label}
			</Link>
		);
	}
	return (
		<a
			href={link.href}
			target="_blank"
			rel="noopener noreferrer"
			className={linkClass}
		>
			{label}
			<ArrowUpRightIcon
				weight="light"
				aria-hidden="true"
				className="size-3.5 text-ash transition-[color,translate] duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper"
			/>
			<span className="sr-only">{NEW_TAB_HINT}</span>
		</a>
	);
}

const rivantLinks: FooterLink[] = [
	{
		label: siteConfig.rivant.urlLabel,
		href: siteConfig.rivant.url,
		external: true
	},
	...siteConfig.socials.map((social) => ({
		label: social.label,
		href: social.href,
		external: true
	}))
];

/**
 * Site footer, as on rivant.in: a carbon panel with a rounded top, quiet
 * link columns and a meta row, so the giant RIVANT wordmark at the very
 * bottom is the only large type. The wordmark rises into place as the
 * reader reaches the end of the page, cropped by the bottom edge like an
 * editorial sign-off.
 */
export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer
			id="site-footer"
			className="relative isolate overflow-clip rounded-t-[1.5rem] bg-carbon pt-16 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.07)] md:rounded-t-[2rem] md:pt-24"
		>
			<Container>
				<div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-12 lg:gap-x-10">
					<div className="col-span-2 md:col-span-3 lg:col-span-5">
						<p className="sr-only">{siteConfig.umbrella}</p>
						<Lockup />
						<p className="mt-6 max-w-[40ch] text-[0.9375rem] leading-relaxed text-pretty text-mist">
							{siteConfig.footerLine}
						</p>
						<p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-pretty text-ash">
							A fork of{" "}
							<a
								href={siteConfig.links.original}
								target="_blank"
								rel="noopener noreferrer"
								className="text-bone underline decoration-smoke underline-offset-[0.25em] transition-[text-decoration-color,color] duration-300 ease-out-expo hover:text-paper hover:decoration-paper"
							>
								DercasDrol’s Claude Parallel Accounts
								<span className="sr-only"> {NEW_TAB_HINT}</span>
							</a>
							. All credit for the original design goes to its
							author.
						</p>
					</div>

					<nav
						aria-labelledby="footer-project"
						className="lg:col-span-2 lg:col-start-7"
					>
						<ColumnHeading id="footer-project">
							Project
						</ColumnHeading>
						<ul className="mt-4">
							{siteConfig.footer.project.map((link) => (
								<li key={link.href}>
									<FooterLink link={link} />
								</li>
							))}
						</ul>
					</nav>

					<nav
						aria-labelledby="footer-rivant"
						className="lg:col-span-2"
					>
						<ColumnHeading id="footer-rivant">
							{siteConfig.rivant.name}
						</ColumnHeading>
						<ul className="mt-4">
							{rivantLinks.map((link) => (
								<li key={link.href}>
									<FooterLink link={link} />
								</li>
							))}
						</ul>
					</nav>

					<div className="col-span-2 md:col-span-1 lg:col-span-2">
						<ColumnHeading id="footer-release">
							Release
						</ColumnHeading>
						<dl
							aria-labelledby="footer-release"
							className="mt-4 grid gap-3 text-[0.9375rem]"
						>
							<div className="flex items-baseline justify-between gap-4 border-b border-slate pb-3">
								<dt className="text-ash">Version</dt>
								<dd className="text-paper tabular-nums">
									{siteConfig.version}
								</dd>
							</div>
							<div className="flex items-baseline justify-between gap-4 border-b border-slate pb-3">
								<dt className="text-ash">Licence</dt>
								<dd className="text-paper">MIT</dd>
							</div>
						</dl>
					</div>
				</div>

				<div className="mt-14 flex flex-col items-start gap-6 border-t border-slate pt-6 md:mt-16 md:flex-row md:items-end md:justify-between">
					<div className="flex flex-col gap-1.5 text-sm text-ash">
						<p className="flex flex-col gap-x-10 gap-y-1.5 lg:flex-row">
							<span>
								&copy; {year} {siteConfig.rivant.legalName}
								<span
									aria-hidden="true"
									className="hidden sm:inline"
								>
									{" · "}
								</span>
								<span className="sr-only">. </span>
								<span className="block sm:inline">
									{siteConfig.legal.license}
								</span>
							</span>
							<span>
								Designed and developed by{" "}
								<a
									href={siteConfig.rivant.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-bone underline decoration-smoke underline-offset-[0.25em] transition-[text-decoration-color,color] duration-300 ease-out-expo hover:text-paper hover:decoration-paper"
								>
									{siteConfig.rivant.name}
									<span className="sr-only">
										{" "}
										{NEW_TAB_HINT}
									</span>
								</a>
							</span>
						</p>
						<p className="max-w-[72ch] text-[0.8125rem] leading-relaxed">
							{siteConfig.legal.disclaimer}
						</p>
					</div>

					<Link
						href="/#top"
						className="group inline-flex min-h-12 shrink-0 items-center gap-3 text-sm font-semibold text-mist transition-colors duration-300 ease-spring hover:text-paper"
					>
						Back to top
						<span
							aria-hidden="true"
							className="grid size-12 place-items-center rounded-full ring-1 ring-smoke/70 transition-[background-color,color,box-shadow] duration-500 ease-spring ring-inset group-hover:bg-paper group-hover:text-void group-hover:ring-paper"
						>
							<ArrowUpIcon
								weight="light"
								className="size-[18px] transition-transform duration-500 ease-spring group-hover:-translate-y-0.5"
							/>
						</span>
					</Link>
				</div>

				{/*
				 * The sign-off. Progress runs from the moment the wordmark's top
				 * enters the viewport to the moment its bottom meets the viewport
				 * bottom; as the last thing on the page, that is the end of the
				 * scroll, so the letters settle exactly as the reader arrives.
				 * The gap above is padding, not margin, so it counts toward that
				 * range and gives the brand shape a band to sit in.
				 */}
				<div
					data-progress=""
					data-progress-start="top bottom"
					data-progress-end="bottom bottom"
					aria-hidden="true"
					className={cn(styles.wordmark, "mt-2 pt-24 md:pt-28")}
				>
					{/*
					 * Inside the clip on purpose: the shape is cropped by the same
					 * bottom edge as the letters and can never drift up into the
					 * meta row. It rises a little faster than the page, so it
					 * settles behind the letters as they land.
					 */}
					<Parallax
						depth={-90}
						rotate={-8}
						className="absolute right-[4%] bottom-[22%] -z-10 w-[46%] md:right-[7%] md:bottom-[20%] md:w-[30%]"
					>
						<Shape
							name="pill"
							className="w-full -rotate-[14deg] opacity-45"
						/>
					</Parallax>

					<span className={styles.word}>
						{[...siteConfig.rivant.shortName].map(
							(letter, index) => (
								<span
									key={index}
									className={styles.letter}
									style={
										{ "--i": index } as React.CSSProperties
									}
								>
									<span className={styles.glyph}>
										{letter}
									</span>
								</span>
							)
						)}
					</span>
				</div>
			</Container>
		</footer>
	);
}
