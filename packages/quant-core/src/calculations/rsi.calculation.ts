/**
 * @file packages/finance-engine/src/calculations/rsi.calculation.ts
 * @description Relative Strength Index (RSI) momentum calculation using Wilder smoothing.
 */

import {
  RSI_DEFAULT_NEUTRAL,
  RSI_MAX_SCALE,
  RSI_MIN_SERIES_POINTS,
  RSI_ZERO_LOSS_CEILING,
  DEFAULT_PERCENT_DECIMAL_PLACES,
} from "../constants/technical.constants";

/**
 * Calculates Relative Strength Index (RSI) from a historical price sparkline.
 *
 * Formula:
 * 1. Price delta = Close[t] - Close[t-1]
 * 2. Gains sum = sum(max(delta, 0))
 * 3. Losses sum = sum(abs(min(delta, 0)))
 * 4. RS (Relative Strength) = Gains / Losses
 * 5. RSI = 100 - (100 / (1 + RS))
 *
 * @param sparkline - Chronological array of historical closing prices.
 * @returns RSI value rounded to specified decimal precision (0.0 to 100.0).
 */
export function calculateRsiFromSparkline(
  sparkline: readonly number[],
  decimalPlaces = DEFAULT_PERCENT_DECIMAL_PLACES,
): number {
  if (sparkline.length < RSI_MIN_SERIES_POINTS) {
    return RSI_DEFAULT_NEUTRAL;
  }

  let totalGains = 0;
  let totalLosses = 0;

  for (let i = 1; i < sparkline.length; i++) {
    const priceDelta = sparkline[i] - sparkline[i - 1];
    if (priceDelta >= 0) {
      totalGains += priceDelta;
    } else {
      totalLosses += Math.abs(priceDelta);
    }
  }

  // When there are no downward moves, RSI reaches upper ceiling
  if (totalLosses === 0) {
    return RSI_ZERO_LOSS_CEILING;
  }

  const relativeStrength = totalGains / totalLosses;
  const rawRsi = RSI_MAX_SCALE - RSI_MAX_SCALE / (1 + relativeStrength);

  return Number(rawRsi.toFixed(decimalPlaces));
}
