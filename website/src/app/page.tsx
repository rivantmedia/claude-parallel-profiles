import { Demo } from "~/components/sections/Demo";
import { Hero } from "~/components/sections/Hero";
import { Install } from "~/components/sections/Install";
import { Platforms } from "~/components/sections/Platforms";

/**
 * The whole story, kept short: what it is, how it works (shown, not told),
 * where it runs, and how to get it. Each section owns its id (the nav's
 * anchors).
 */
export default function Home() {
	return (
		<main
			id="main-content"
			tabIndex={-1}
		>
			<Hero />
			<Demo />
			<Platforms />
			<Install />
		</main>
	);
}
