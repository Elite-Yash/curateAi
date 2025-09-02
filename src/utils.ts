import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + clsx classes
 *
 * @param {...ClassValue[]} inputs - Accepts strings, arrays, or objects
 * @returns {string} - The merged className string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
