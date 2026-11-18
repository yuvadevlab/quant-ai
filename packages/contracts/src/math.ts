/**
 * @fileoverview Pure deterministic financial calculation formulas. */

import { SignalDirection } from "./enums";

/**
 * Calculates Maximum Favorable Excursion (MFE) points for a trade.
 *
 * @param entry The trade entry price.
 * @param highestHigh The highest price reached during the trade life cycle.
 * @param lowestLow The lowest price reached during the trade life cycle.
 * @param direction The trade direction (LONG or SHORT).
 * @returns MFE in absolute price points.
 */
export function calculateMfe(
  entry: number,
  highestHigh: number,
  lowestLow: number,
  direction: SignalDirection,
): number {
  if (direction === SignalDirection.LONG) {
    return Math.max(0, highestHigh - entry);
  }
  return Math.max(0, entry - lowestLow);
}

/**
 * Calculates Maximum Adverse Excursion (MAE) points for a trade.
 *
 * @param entry The trade entry price.
 * @param highestHigh The highest price reached during the trade life cycle.
 * @param lowestLow The lowest price reached during the trade life cycle.
 * @param direction The trade direction (LONG or SHORT).
 * @returns MAE in absolute price points.
 */
export function calculateMae(
  entry: number,
  highestHigh: number,
  lowestLow: number,
  direction: SignalDirection,
): number {
  if (direction === SignalDirection.LONG) {
    return Math.max(0, entry - lowestLow);
  }
  return Math.max(0, highestHigh - entry);
}

/**
 * Calculates the Brier score to measure probabilistic calibration.
 * Lower scores represent superior calibration (0 is perfect).
 *
 * @param forecasts Array of forecasted probabilities between 0 and 1.
 * @param outcomes Array of binary actual outcomes (1 for success, 0 for failure).
 * @returns Mean squared error Brier score.
 */
export function calculateBrierScore(
  forecasts: readonly number[],
  outcomes: readonly (0 | 1)[],
): number {
  if (forecasts.length === 0 || forecasts.length !== outcomes.length) {
    return 0;
  }
  const sumSquaredDiff = forecasts.reduce((acc, f, i) => {
    const diff = f - outcomes[i]!;
    return acc + diff * diff;
  }, 0);
  return Number((sumSquaredDiff / forecasts.length).toFixed(4));
}
