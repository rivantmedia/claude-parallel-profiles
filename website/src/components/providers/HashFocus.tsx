"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * After a client-side navigation to another page's section ("/#install"
 * followed from /changelog/), moves keyboard focus to that section, as a
 * browser does for a plain anchor on the same page. Without it next/link
 * scrolls to the section but focus stays at the top, so the next Tab jumps
 * back up. A target that isn't focusable gets tabindex="-1" (no outline:
 * see globals.css). The first load is left to the browser, which already
 * starts from the URL's fragment. Renders nothing.
 */
export function HashFocus() {
	const pathname = usePathname();
	const previous = useRef(pathname);

	useEffect(() => {
		if (previous.current === pathname) return;
		previous.current = pathname;
		let id: string;
		try {
			id = decodeURIComponent(window.location.hash.slice(1));
		} catch {
			return; // a malformed fragment names no section
		}
		if (!id) return;
		const target = document.getElementById(id);
		if (!target) return;
		if (target.tabIndex < 0 && !target.hasAttribute("tabindex"))
			target.setAttribute("tabindex", "-1");
		target.focus({ preventScroll: true });
	}, [pathname]);

	return null;
}
