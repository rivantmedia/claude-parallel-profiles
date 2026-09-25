import { ArrowDownIcon, GithubLogoIcon } from "@phosphor-icons/react/ssr";
import {
	Container,
	InternalLink,
	Lockup,
	NEW_TAB_HINT,
	PillButton
} from "~/components/primitives";
import { links, site } from "~/content";
import { cn } from "~/lib/utils";
import { NavShell } from "./NavShell";

/** The glass every pill takes on once the page has scrolled (see NavShell). */
const glass =
	"group-data-scrolled/nav:bg-void/55 group-data-scrolled/nav:ring-white/10 group-data-scrolled/nav:backdrop-blur-xl";

const pill = cn(
	"nav-pill rounded-full ring-1 ring-transparent transition-[background-color,box-shadow,color] duration-500 ease-spring ring-inset",
	glass
);

/**
 * Floating header, as on rivant.in: separate pills that are transparent over
 * the hero and turn to glass once the page scrolls. Left, the "Rivant for
 * the Community" lockup; right, the in-page links (from lg), GitHub and
 * Install. Rendered on the server; NavShell (the one client part) slides it
 * away and back and tells the pills when the page has scrolled.
 */
export function Navbar() {
	return (
		<NavShell>
			<Container className="flex items-center justify-between gap-3 pt-4 md:pt-6">
				<InternalLink
					href="/"
					aria-label={`${site.umbrella}: ${site.name}, home`}
					className={cn(
						pill,
						"flex min-h-12 min-w-0 items-center py-2.5 pr-5 pl-3.5"
					)}
				>
					<Lockup compact />
				</InternalLink>

				<nav
					aria-label="Main"
					className="flex items-center gap-2 md:gap-3"
				>
					<ul
						className={cn(pill, "hidden items-center px-2 lg:flex")}
					>
						{site.nav.items.map((link) => (
							<li key={link.href}>
								<InternalLink
									href={link.href}
									className="inline-flex min-h-12 items-center rounded-full px-4 text-sm font-medium text-mist transition-colors duration-300 ease-spring hover:text-paper aria-[current=page]:text-paper"
								>
									{link.label}
								</InternalLink>
							</li>
						))}
					</ul>

					<a
						href={links.github}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${site.nav.github} ${NEW_TAB_HINT}`}
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
						href={site.nav.cta.href}
						external={site.nav.cta.external}
						variant="ghost"
						// It goes to a section further down, not off the site.
						icon={
							<ArrowDownIcon
								weight="light"
								className="size-4"
							/>
						}
						className={cn(
							"nav-pill hidden transition-[opacity,visibility,background-color,color,scale,box-shadow] sm:inline-flex",
							// Keeps its smoke ring; only the ground turns to glass.
							"group-data-scrolled/nav:bg-void/55 group-data-scrolled/nav:backdrop-blur-xl",
							// The hero has its own; this one appears once it scrolls away.
							"group-data-cta-hidden/nav:invisible group-data-cta-hidden/nav:opacity-0"
						)}
					>
						{site.nav.cta.label}
					</PillButton>
				</nav>
			</Container>
		</NavShell>
	);
}
