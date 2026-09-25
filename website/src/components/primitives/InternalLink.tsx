"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** "/changelog/" and "/changelog" are the same page. */
const normalise = (path: string) => path.replace(/\/+$/, "") || "/";

type InternalLinkProps = Omit<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	"href"
> & {
	/** A site path ("/changelog/"), a path and a hash ("/#install") or a hash. */
	href: string;
};

/**
 * Every link to somewhere on this site. It picks the element that behaves
 * best for where the link goes:
 *
 * - A section of the page already on screen ("#install", or "/#install"
 *   while on the homepage) is a plain anchor. The browser then moves its
 *   focus starting point to the section, so the next Tab continues from
 *   there; next/link would scroll but leave keyboard focus behind.
 * - Another page goes through next/link, which adds the base path. Links to
 *   the homepage aren't prefetched: from the homepage that would download the
 *   page already on screen, and from elsewhere it can wait for the click.
 *   (HashFocus moves focus to the section when such a link carries a hash.)
 * - A link to the page being viewed says so with aria-current="page".
 */
export function InternalLink({ href, ...props }: InternalLinkProps) {
	const pathname = normalise(usePathname() ?? "/");
	const hashAt = href.indexOf("#");
	const path = hashAt === -1 ? href : href.slice(0, hashAt);
	const hash = hashAt === -1 ? "" : href.slice(hashAt);

	if (hash && (path === "" || normalise(path) === pathname)) {
		return (
			<a
				href={hash}
				{...props}
			/>
		);
	}

	const home = normalise(path) === "/";
	return (
		<Link
			href={href}
			prefetch={home ? false : undefined}
			aria-current={
				!hash && normalise(path) === pathname ? "page" : undefined
			}
			{...props}
		/>
	);
}
