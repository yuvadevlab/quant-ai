/**
 * @file src/lib/utils.ts
 * @description Universal class names and layout utility helpers.
 * @author yuva.devlab@gmail.com
 */

import { clsx, type ClassValue } from "clsx";

/**
 * Combines conditional class names into a single clean string.
 *
 * @param inputs - List of class values, objects, or arrays
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
