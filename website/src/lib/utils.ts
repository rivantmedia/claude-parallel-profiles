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

/**
 * Joins class names and resolves Tailwind conflicts (a later `text-paper`
 * replaces an earlier `text-mist`), so a caller's className can override a
 * component's defaults. For server components only: in client code it
 * would ship tailwind-merge and its class tables to every page (use cx from
 * ~/lib/cx there).
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
