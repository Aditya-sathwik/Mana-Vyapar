import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Cleanly merges Tailwind CSS classes using clsx and tailwind-merge.
 * Resolves conflicts and conditionally applies classes for premium UI development.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
