/**
 * Utility function to merge Tailwind CSS classes with clsx and tailwind-merge
 * Ensures proper class precedence when combining conditional classes
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
