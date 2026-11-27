/**
 * @file src/features/chat/utils/scrollPolicy.ts
 * @description Pure scroll policy helpers for the viewport-locked chat container.
 */

/** Distance (px) from the bottom that counts as "at the bottom". */
export const SCROLL_BOTTOM_THRESHOLD_PX = 80;

/** Distance between the viewport's bottom edge and the content's bottom. */
export function distanceFromBottom(
  scrollHeight: number,
  scrollTop: number,
  clientHeight: number,
): number {
  return scrollHeight - scrollTop - clientHeight;
}

/** True when the user is at or within the threshold of the bottom. */
export function isNearBottom(
  scrollHeight: number,
  scrollTop: number,
  clientHeight: number,
  threshold: number = SCROLL_BOTTOM_THRESHOLD_PX,
): boolean {
  return distanceFromBottom(scrollHeight, scrollTop, clientHeight) <= threshold;
}
