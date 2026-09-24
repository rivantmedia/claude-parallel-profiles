"use client";

import { GithubLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	Container,
	Lockup,
	NEW_TAB_HINT,
	PillButton
} from "~/components/primitives";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

/** The glass every pill takes on once the page has scrolled. */
const glassClass = "bg-void/55 ring-white/10 backdrop-blur-xl";

/**
 * Floating header, as on rivant.in: separate pills that are transparent over
 * the hero and turn to glass once the page scrolls. It slides away while
 * scrolling down and comes back on the way up. Left, the "Rivant for the
 * Community" lockup; right, the in-page links (from lg), GitHub and Install.
 *
 * It also sets html[data-scrolled] once the hero is half gone, which brings
 * in the bottom edge blur, and html[data-at-end] at the foot of the page,
 * which takes it away again (see .progressive-blur).
 */
export function Navbar() {
	const [hidden, setHidden] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		let last = window.scrollY;
		let frame = 0;
		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				const y = window.scrollY;
				setScrolled(y > 24);
				const html = document.documentElement;
				html.toggleAttribute(
					"data-scrolled",
					y > window.innerHeight * 0.5
				);
				html.toggleAttribute(
					"data-at-end",
					y + window.innerHeight >= html.scrollHeight - 48
				);
				// A small dead zone, so trackpad jitter doesn't flicker it.
				if (Math.abs(y - last) > 6) {
					setHidden(y > last && y > 240);
					last = y;
				}
			});
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(frame);
		};
	}, []);

	const pill = cn(
		"nav-pill rounded-full ring-1 transition-[background-color,box-shadow,color] duration-500 ring-inset",
		scrolled ? glassClass : "ring-transparent"
	);

	return (
		// Focus arriving in the header (Tab from the page) brings it back, or
		// its links would be focused off-screen.
		<header
			onFocus={() => setHidden(false)}
			className={cn(
				"fixed inset-x-0 top-0 z-40 transition-transform duration-700 ease-spring",
				hidden && "-translate-y-[140%]"
			)}
		>
			<Container className="flex items-center justify-between gap-3 pt-4 md:pt-6">
				<Link
					href="/"
					aria-label={`${siteConfig.umbrella}: ${siteConfig.name}, home`}
					className={cn(
						pill,
						"flex min-h-12 items-center py-2.5 pr-5 pl-3.5"
					)}
				>
					<Lockup compact />
				</Link>

				<nav
					aria-label="Main"
					className="flex items-center gap-2 md:gap-3"
				>
					<ul
						className={cn(pill, "hidden items-center px-2 lg:flex")}
					>
						{siteConfig.nav.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="inline-flex min-h-12 items-center rounded-full px-4 text-sm font-medium text-mist transition-colors duration-300 ease-spring hover:text-paper"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>

					<a
						href={siteConfig.links.github}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${siteConfig.name} on GitHub ${NEW_TAB_HINT}`}
						className={cn(
							pill,
							"grid size-12 place-items-center text-paper hover:bg-paper hover:text-void hover:ring-paper md:size-14"
						)}
					>
						<GithubLogoIcon
							weight="light"
							aria-hidden="true"
							className="size-5"
						/>
					</a>

					<PillButton
						href="/#install"
						variant="ghost"
						className={cn(
							"nav-pill hidden sm:inline-flex",
							// Keeps its smoke ring; only the ground turns to glass.
							scrolled && "bg-void/55 backdrop-blur-xl"
						)}
					>
						Install
					</PillButton>
				</nav>
			</Container>
		</header>
	);
}
