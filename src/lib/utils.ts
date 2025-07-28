import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names, resolving Tailwind CSS class conflicts.
 *
 * Accepts any number of class values, conditionally joins them, and merges Tailwind CSS classes to produce a single optimized class string.
 *
 * @returns The merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
