import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import localFont from "next/font/local";

import { Footer } from "~/components/layout/Footer";
import { Navbar } from "~/components/layout/Navbar";
import { Grain, ProgressiveBlur } from "~/components/primitives";
import { HashFocus } from "~/components/providers/HashFocus";
import { Motion, motionBootScript } from "~/components/providers/Motion";
import { site } from "~/content";
import { absoluteUrl } from "~/lib/asset";
import { baseOpenGraph } from "~/lib/metadata";

// Brand heading font. Variable weight (100-900) plus italic: headings set
// extrabold against extralight italic, and the hero letter accordion
// interpolates weight.
const montserrat = Montserrat({
	subsets: ["latin"],
	style: ["normal", "italic"],
	variable: "--font-montserrat",
	display: "swap"
});

// Brand body font.
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap"
});

// Brand "style" font, for faint background type only: Rivant's file,
// converted losslessly from TTF to WOFF2 (13 KB against 50 KB). SIL OFL 1.1;
// the licence travels beside the file (src/fonts/OFL.txt).
const blackout = localFont({
	src: "../fonts/blackout.sunrise.woff2",
	variable: "--font-blackout",
	display: "swap",
	preload: false
});

export const metadata: Metadata = {
	// Relative metadata URLs are joined onto this, base path included.
	metadataBase: new URL(absoluteUrl("/")),
	title: {
		default: site.title,
		template: `%s | ${site.name}`
	},
	description: site.description,
	applicationName: site.name,
	authors: [{ name: site.rivant.name, url: site.rivant.href }],
	creator: site.rivant.name,
	publisher: site.rivant.name,
	alternates: { canonical: "./" },
	openGraph: { ...baseOpenGraph, url: "./" },
	// Title, description and image are left out on purpose: Next fills them
	// from each page's own Open Graph card, so a page that overrides
	// openGraph (the changelog) gets a matching X card too.
	twitter: {
		card: "summary_large_image",
		site: "@rivantmedia"
	}
	// Icons come from the files beside this layout (icon.png, apple-icon.png).
};

export const viewport: Viewport = {
	themeColor: "#0b0b0b",
	colorScheme: "dark"
};

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			className={`${montserrat.variable} ${inter.variable} ${blackout.variable}`}
			// The boot script adds js-ready before hydration (see Motion.tsx).
			suppressHydrationWarning
		>
			<head>
				{/* A fixed string from Motion.tsx, no user input. */}
				<script
					dangerouslySetInnerHTML={{ __html: motionBootScript }}
				/>
			</head>
			<body>
				<a
					href="#main-content"
					className="skip-link"
				>
					{site.skipLink}
				</a>
				<Navbar />
				{children}
				<Footer />
				<ProgressiveBlur side="top" />
				<ProgressiveBlur side="bottom" />
				<Grain />
				<Motion />
				<HashFocus />
			</body>
		</html>
	);
}
