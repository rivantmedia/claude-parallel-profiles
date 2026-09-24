import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import localFont from "next/font/local";

import { Footer } from "~/components/layout/Footer";
import { Navbar } from "~/components/layout/Navbar";
import { Grain, ProgressiveBlur } from "~/components/primitives";
import { Motion, motionBootScript } from "~/components/providers/Motion";
import { siteConfig } from "~/config/site";

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

// Brand "style" font, for faint background type only. SIL OFL 1.1; the
// licence travels beside the file (src/fonts/OFL.txt).
const blackout = localFont({
	src: "../fonts/blackout.sunrise.ttf",
	variable: "--font-blackout",
	display: "swap",
	preload: false
});

export const metadata: Metadata = {
	// Relative metadata URLs are joined onto this, base path included.
	metadataBase: new URL(`${siteConfig.url}/`),
	title: {
		default: `${siteConfig.name} | A Claude account per VS Code window`,
		template: `%s | ${siteConfig.name}`
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	authors: [{ name: siteConfig.rivant.name, url: siteConfig.rivant.url }],
	creator: siteConfig.rivant.name,
	publisher: siteConfig.rivant.name,
	alternates: { canonical: "./" },
	openGraph: {
		type: "website",
		siteName: `${siteConfig.name} · ${siteConfig.umbrella}`,
		title: siteConfig.name,
		description: siteConfig.description,
		url: "./",
		locale: "en_GB",
		images: [
			{
				url: "og.png",
				width: 1200,
				height: 630,
				alt: `${siteConfig.name}, by Rivant Media`
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		site: "@rivantmedia",
		title: siteConfig.name,
		description: siteConfig.description,
		images: ["og.png"]
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
					Skip to content
				</a>
				<Navbar />
				{children}
				<Footer />
				<ProgressiveBlur side="top" />
				<ProgressiveBlur side="bottom" />
				<Grain />
				<Motion />
			</body>
		</html>
	);
}
