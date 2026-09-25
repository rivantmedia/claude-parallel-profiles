import {
	AppleLogoIcon,
	CheckIcon,
	CloudIcon,
	CubeIcon,
	LinuxLogoIcon,
	TerminalWindowIcon,
	WindowsLogoIcon,
	XIcon
} from "@phosphor-icons/react/ssr";
import {
	Container,
	Parallax,
	Reveal,
	Section,
	SectionIntro,
	Shape
} from "~/components/primitives";
import { platforms, type PlatformIcon } from "~/content";
import { cn } from "~/lib/utils";

const ICONS: Record<PlatformIcon, typeof LinuxLogoIcon> = {
	linux: LinuxLogoIcon,
	apple: AppleLogoIcon,
	wsl: TerminalWindowIcon,
	ssh: CloudIcon,
	container: CubeIcon,
	windows: WindowsLogoIcon
};

/**
 * Where it runs, at a glance: one tile per platform, its icon large, its
 * name, and a tick or a cross. Status reads by weight and mark, never by
 * hue: supported tiles are carbon with paper type; Windows sits back on the
 * void with a quiet ring and says what to use instead. The orbs drift off
 * the left edge behind the tiles.
 */
export function Platforms() {
	return (
		<Section
			id={platforms.id}
			labelledBy="platforms-heading"
		>
			<Parallax
				depth={180}
				rotate={-14}
				blur={4}
				aria-hidden="true"
				className="absolute bottom-[4%] -left-[34vw] -z-10 w-[80vw] max-w-[640px] md:-left-[16vw] md:w-[40vw]"
			>
				<Shape
					name="orbs"
					className="w-full opacity-20"
				/>
			</Parallax>

			<Container>
				<SectionIntro
					id="platforms-heading"
					eyebrow={platforms.eyebrow}
					heading={platforms.heading}
				/>

				<Reveal
					as="ul"
					className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-3 lg:grid-cols-6"
				>
					{platforms.items.map((item) => {
						const Icon = ICONS[item.icon];
						const Mark = item.supported ? CheckIcon : XIcon;
						return (
							<li
								key={item.name}
								className={cn(
									"flex min-h-44 flex-col rounded-3xl p-5 ring-1 ring-inset sm:p-6",
									item.supported
										? "bg-graphite ring-slate"
										: "ring-smoke/70"
								)}
							>
								<div className="flex items-start justify-between">
									<Icon
										weight="light"
										aria-hidden="true"
										className={cn(
											"size-10 md:size-11",
											item.supported
												? "text-paper"
												: "text-ash"
										)}
									/>
									<span
										className={cn(
											"grid size-7 place-items-center rounded-full ring-1 ring-inset",
											item.supported
												? "bg-paper text-void ring-paper"
												: "text-ash ring-ash/60"
										)}
									>
										<Mark
											weight="bold"
											aria-hidden="true"
											className="size-3.5"
										/>
										<span className="sr-only">
											{item.supported
												? platforms.status.supported
												: platforms.status.unsupported}
										</span>
									</span>
								</div>
								<p
									className={cn(
										"mt-auto pt-8 font-display text-lg leading-snug",
										item.supported
											? "text-paper"
											: "text-mist"
									)}
								>
									{item.name}
								</p>
								{item.note && (
									<p className="mt-1 text-[0.8125rem] leading-snug text-ash">
										{item.note}
									</p>
								)}
							</li>
						);
					})}
				</Reveal>
			</Container>
		</Section>
	);
}
