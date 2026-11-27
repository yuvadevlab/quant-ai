/**
 * @fileoverview Pure, deterministic algorithms for volatility bands, channels, and VWAP.
 */

import {
  DEFAULT_BOLLINGER_CONFIG,
  DEFAULT_KELTNER_CONFIG,
  DEFAULT_VWAP_CONFIG,
} from "./indicators.constants";
import {
  BollingerBandsResult,
  BollingerConfig,
  KeltnerChannelsResult,
  KeltnerConfig,
  SqueezeResult,
  VwapConfig,
  VwapResult,
} from "./indicators.types";
import { calculateAtr, calculateEma, calculateSma } from "./indicators";

/**
 * Calculates Bollinger Bands with dynamic standard deviation bandwidth.
 */
export function calculateBollingerBands(
  closes: readonly number[],
  configOverrides?: Partial<BollingerConfig>,
): BollingerBandsResult {
  const config: BollingerConfig = { ...DEFAULT_BOLLINGER_CONFIG, ...configOverrides };
  const { period, stdDevMultiplier } = config;
  if (period <= 0 || closes.length < period) {
    return { middle: [], upper: [], lower: [], bandwidth: [] };
  }

  const middle = calculateSma(closes, period);
  const upper: number[] = [];
  const lower: number[] = [];
  const bandwidth: number[] = [];

  for (let i = 0; i < middle.length; i++) {
    const window = closes.slice(i, i + period);
    const m = middle[i]!;
    const variance = window.reduce((acc, v) => acc + (v - m) ** 2, 0) / period;
    const stdDev = Math.sqrt(variance);

    const u = Number((m + stdDev * stdDevMultiplier).toFixed(4));
    const l = Number((m - stdDev * stdDevMultiplier).toFixed(4));
    const bw = m > 0 ? Number(((u - l) / m).toFixed(4)) : 0;

    upper.push(u);
    lower.push(l);
    bandwidth.push(bw);
  }

  return { middle, upper, lower, bandwidth };
}

/**
 * Calculates Keltner Channels using EMA centerline and ATR channel envelope.
 */
export function calculateKeltnerChannels(
  highs: readonly number[],
  lows: readonly number[],
  closes: readonly number[],
  configOverrides?: Partial<KeltnerConfig>,
): KeltnerChannelsResult {
  const config: KeltnerConfig = { ...DEFAULT_KELTNER_CONFIG, ...configOverrides };
  const { emaPeriod, atrPeriod, multiplier } = config;
  const ema = calculateEma(closes, emaPeriod);
  const atr = calculateAtr(highs, lows, closes, { period: atrPeriod });
  const offset = Math.max(0, ema.length - atr.length);

  const middle: number[] = [];
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < atr.length; i++) {
    const m = ema[i + offset]!;
    const range = atr[i]! * multiplier;
    middle.push(m);
    upper.push(Number((m + range).toFixed(4)));
    lower.push(Number((m - range).toFixed(4)));
  }

  return { middle, upper, lower };
}

/**
 * Detects Volatility Squeeze (Bollinger Bands fully inside Keltner Channels).
 */
export function detectVolatilitySqueeze(
  highs: readonly number[],
  lows: readonly number[],
  closes: readonly number[],
  bbConfig?: Partial<BollingerConfig>,
  kcConfig?: Partial<KeltnerConfig>,
): SqueezeResult {
  const bb = calculateBollingerBands(closes, bbConfig);
  const kc = calculateKeltnerChannels(highs, lows, closes, kcConfig);
  if (bb.upper.length === 0 || kc.upper.length === 0) {
    return { isSqueezing: false, squeezePeriods: 0, momentum: 0 };
  }

  const latestBbUpper = bb.upper[bb.upper.length - 1]!;
  const latestBbLower = bb.lower[bb.lower.length - 1]!;
  const latestKcUpper = kc.upper[kc.upper.length - 1]!;
  const latestKcLower = kc.lower[kc.lower.length - 1]!;

  const isSqueezing = latestBbUpper < latestKcUpper && latestBbLower > latestKcLower;
  let count = 0;
  const minLen = Math.min(bb.upper.length, kc.upper.length);
  for (let i = 1; i <= minLen; i++) {
    const bU = bb.upper[bb.upper.length - i]!;
    const bL = bb.lower[bb.lower.length - i]!;
    const kU = kc.upper[kc.upper.length - i]!;
    const kL = kc.lower[kc.lower.length - i]!;
    if (bU < kU && bL > kL) count++;
    else break;
  }

  const momentum =
    closes.length >= 2
      ? Number((closes[closes.length - 1]! - closes[closes.length - 2]!).toFixed(2))
      : 0;
  return { isSqueezing, squeezePeriods: count, momentum };
}

/**
 * Calculates Volume Weighted Average Price (VWAP) with configurable sigma bands.
 */
export function calculateVwap(
  highs: readonly number[],
  lows: readonly number[],
  closes: readonly number[],
  volumes: readonly number[],
  configOverrides?: Partial<VwapConfig>,
): VwapResult {
  const config: VwapConfig = { ...DEFAULT_VWAP_CONFIG, ...configOverrides };
  const { stdDevMultipliers } = config;
  const n = Math.min(highs.length, lows.length, closes.length, volumes.length);
  if (n === 0) {
    return { vwap: [], upperBands: [], lowerBands: [] };
  }

  const vwap: number[] = [];
  const upperBands: number[][] = stdDevMultipliers.map(() => []);
  const lowerBands: number[][] = stdDevMultipliers.map(() => []);

  let cumulativePv = 0;
  let cumulativeVol = 0;
  const typicalPrices: number[] = [];

  for (let i = 0; i < n; i++) {
    const tp = (highs[i]! + lows[i]! + closes[i]!) / 3;
    const vol = volumes[i]!;
    typicalPrices.push(tp);

    cumulativePv += tp * vol;
    cumulativeVol += vol;
    const currentVwap = cumulativeVol > 0 ? cumulativePv / cumulativeVol : tp;
    vwap.push(Number(currentVwap.toFixed(4)));

    let weightedVarianceSum = 0;
    for (let j = 0; j <= i; j++) {
      weightedVarianceSum += volumes[j]! * (typicalPrices[j]! - currentVwap) ** 2;
    }
    const stdDev = cumulativeVol > 0 ? Math.sqrt(weightedVarianceSum / cumulativeVol) : 0;

    stdDevMultipliers.forEach((mult, bandIdx) => {
      upperBands[bandIdx]!.push(Number((currentVwap + mult * stdDev).toFixed(4)));
      lowerBands[bandIdx]!.push(Number((currentVwap - mult * stdDev).toFixed(4)));
    });
  }

  return { vwap, upperBands, lowerBands };
}
