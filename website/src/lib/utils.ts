import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge only knows Tailwind's default scale. Without this it reads
// our custom `text-display`, `text-eyebrow` etc. as colours, so combining one
// with a colour class (`text-eyebrow text-mist`) silently dropped the size.
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{ text: ["hero", "display", "title", "lead", "eyebrow"] }
			],
			// Custom families, so they are never mistaken for font weights.
			"font-family": [{ font: ["display", "style", "mono"] }]
		}
	}
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
