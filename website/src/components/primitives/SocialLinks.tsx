import {
	BehanceLogoIcon,
	InstagramLogoIcon,
	LinkedinLogoIcon,
	XLogoIcon
} from "@phosphor-icons/react/ssr";
import { siteConfig, type SocialIcon } from "~/config/site";
import { cn } from "~/lib/utils";
import { NEW_TAB_HINT } from "./PillButton";

const ICONS: Record<SocialIcon, typeof InstagramLogoIcon> = {
	instagram: InstagramLogoIcon,
	linkedin: LinkedinLogoIcon,
	x: XLogoIcon,
	behance: BehanceLogoIcon
};

/** Rivant Media's social links (from siteConfig), as round icon buttons. */
export function SocialLinks({ className }: { className?: string }) {
	return (
		<ul className={cn("flex items-center gap-2", className)}>
			{siteConfig.socials.map((social) => {
				const Icon = ICONS[social.icon];
				return (
					<li key={social.label}>
						<a
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Rivant Media on ${social.label} ${NEW_TAB_HINT}`}
							className="grid size-11 place-items-center rounded-full text-mist ring-1 ring-smoke/70 transition-[color,background-color,scale] duration-500 ease-spring ring-inset hover:bg-paper hover:text-void active:scale-95"
						>
							<Icon
								weight="light"
								className="size-[18px]"
							/>
						</a>
					</li>
				);
			})}
		</ul>
	);
}
