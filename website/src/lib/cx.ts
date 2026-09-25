import { clsx } from "clsx";

/**
 * Joins class names without resolving conflicts, for client components (and
 * anything they render), so tailwind-merge stays out of the browser bundle;
 * server components use cn from ~/lib/utils. Write the classes so none
 * conflict: pick one side of a condition (`open ? "text-paper" :
 * "text-bone"`) rather than overriding one class with another.
 */
export const cx = clsx;
