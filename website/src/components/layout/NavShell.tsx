"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "~/lib/cx";

/**
 * The header's moving part, around the server-rendered Navbar. It slides
 * the header away while scrolling down and back on the way up (with reduced
 * motion it simply appears and disappears), and says how things stand on the
 * header itself, for the pills inside to style from (`group/nav`):
 *
 * - data-scrolled: the page has scrolled, so the pills turn to glass.
 * - data-cta-hidden: on the homepage, before it has scrolled, where the
 *   hero has its own call to action (as on rivant.in).
 *
 * It also sets html[data-scrolled] once the hero is half gone, which brings
 * in the bottom edge blur, and html[data-at-end] at the foot of the page,
 * which takes it away again (see .progressive-blur).
 */
export function NavShell({ children }: { children: React.ReactNode }) {
	const [hidden, setHidden] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const home = usePathname() === "/";

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

	return (
		// Focus arriving in the header (Tab from the page) brings it back, or
		// its links would be focused off-screen.
		<header
			onFocus={() => setHidden(false)}
			data-scrolled={scrolled || undefined}
			data-cta-hidden={(home && !scrolled) || undefined}
			className={cx(
				"group/nav fixed inset-x-0 top-0 z-40 transition-transform duration-700 ease-spring motion-reduce:transition-none",
				hidden && "-translate-y-[140%]"
			)}
		>
			{children}
		</header>
	);
}
