/**
 * @fileoverview Pure, deterministic, configurable quantitative indicator algorithms.
 * Every algorithm accepts dynamic configuration overrides, adhering to zero hardcoding rules.
 */

import { DEFAULT_ATR_CONFIG, DEFAULT_RSI_CONFIG } from "./indicators.constants";
import { AtrConfig, RsiConfig } from "./indicators.types";

export * from "./volatility";

/**
 * Calculates Simple Moving Average (SMA) series for arbitrary period.
 */
export function calculateSma(values: readonly number[], period: number): readonly number[] {
  if (period <= 0 || values.length < period) return [];
  const result: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i]!;
    if (i >= period) sum -= values[i - period]!;
    if (i >= period - 1) result.push(Number((sum / period).toFixed(4)));
  }
  return result;
}

/**
 * Calculates Exponential Moving Average (EMA) series with configurable multiplier.
 */
export function calculateEma(values: readonly number[], period: number): readonly number[] {
  if (period <= 0 || values.length < period) return [];
  const k = 2 / (period + 1);
  const result: number[] = [];
  const initialSma = values.slice(0, period).reduce((acc, v) => acc + v, 0) / period;
  result.push(Number(initialSma.toFixed(4)));
  let prevEma = initialSma;

  for (let i = period; i < values.length; i++) {
    const currentEma = values[i]! * k + prevEma * (1 - k);
    result.push(Number(currentEma.toFixed(4)));
    prevEma = currentEma;
  }
  return result;
}

/**
 * Calculates Relative Strength Index (RSI) using Wilder's smoothing technique.
 */
export function calculateRsi(
  closes: readonly number[],
  configOverrides?: Partial<RsiConfig>,
): readonly number[] {
  const config: RsiConfig = { ...DEFAULT_RSI_CONFIG, ...configOverrides };
  const { period } = config;
  if (period <= 0 || closes.length <= period) return [];

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i]! - closes[i - 1]!;
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const computeRsiValue = (gain: number, loss: number): number => {
    if (loss === 0) return 100;
    const rs = gain / loss;
    return Number((100 - 100 / (1 + rs)).toFixed(2));
  };

  const result: number[] = [computeRsiValue(avgGain, avgLoss)];

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]!) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]!) / period;
    result.push(computeRsiValue(avgGain, avgLoss));
  }
  return result;
}

/**
 * Calculates Average True Range (ATR) representing normalized price volatility.
 */
export function calculateAtr(
  highs: readonly number[],
  lows: readonly number[],
  closes: readonly number[],
  configOverrides?: Partial<AtrConfig>,
): readonly number[] {
  const config: AtrConfig = { ...DEFAULT_ATR_CONFIG, ...configOverrides };
  const { period } = config;
  const n = Math.min(highs.length, lows.length, closes.length);
  if (period <= 0 || n <= period) return [];

  const tr: number[] = [highs[0]! - lows[0]!];
  for (let i = 1; i < n; i++) {
    const currentHigh = highs[i]!;
    const currentLow = lows[i]!;
    const prevClose = closes[i - 1]!;
    const trueRange = Math.max(
      currentHigh - currentLow,
      Math.abs(currentHigh - prevClose),
      Math.abs(currentLow - prevClose),
    );
    tr.push(trueRange);
  }

  let atr = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const result: number[] = [Number(atr.toFixed(4))];
  for (let i = period; i < tr.length; i++) {
    atr = (atr * (period - 1) + tr[i]!) / period;
    result.push(Number(atr.toFixed(4)));
  }
  return result;
}
