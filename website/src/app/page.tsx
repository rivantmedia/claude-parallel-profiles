import { Band } from "~/components/sections/Band";
import { Demo } from "~/components/sections/Demo";
import { Hero } from "~/components/sections/Hero";
import { History } from "~/components/sections/History";
import { HowItWorks } from "~/components/sections/HowItWorks";
import { Idea } from "~/components/sections/Idea";
import { Install } from "~/components/sections/Install";
import { Privacy } from "~/components/sections/Privacy";
import { QuickStart } from "~/components/sections/QuickStart";
import { Requirements } from "~/components/sections/Requirements";
import { Switching } from "~/components/sections/Switching";
import { Uninstall } from "~/components/sections/Uninstall";

/** The whole story, top to bottom. Each section owns its id (the nav's anchors). */
export default function Home() {
	return (
		<main
			id="main-content"
			tabIndex={-1}
		>
			<Hero />
			<Band />
			<Idea />
			<Demo />
			<QuickStart />
			<History />
			<HowItWorks />
			<Privacy />
			<Uninstall />
			<Requirements />
			<Switching />
			<Install />
		</main>
	);
}
