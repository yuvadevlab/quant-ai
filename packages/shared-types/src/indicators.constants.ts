/**
 * @fileoverview Canonical default configurations for quantitative indicators.
 * Used as fallback options when consumers do not provide custom parameters.
 */

import {
  AtrConfig,
  BollingerConfig,
  KeltnerConfig,
  RsiConfig,
  VwapConfig,
} from "./indicators.types";

/**
 * Default parameters for standard 14-period RSI calculation.
 */
export const DEFAULT_RSI_CONFIG: Readonly<RsiConfig> = {
  period: 14,
  overboughtThreshold: 70,
  oversoldThreshold: 30,
} as const;

/**
 * Default parameters for standard 14-period ATR calculation.
 */
export const DEFAULT_ATR_CONFIG: Readonly<AtrConfig> = {
  period: 14,
} as const;

/**
 * Default parameters for 20-period, 2-sigma Bollinger Bands.
 */
export const DEFAULT_BOLLINGER_CONFIG: Readonly<BollingerConfig> = {
  period: 20,
  stdDevMultiplier: 2.0,
} as const;

/**
 * Default parameters for 20-period EMA, 1.5 ATR multiplier Keltner Channels.
 */
export const DEFAULT_KELTNER_CONFIG: Readonly<KeltnerConfig> = {
  emaPeriod: 20,
  atrPeriod: 14,
  multiplier: 1.5,
} as const;

/**
 * Default parameters for VWAP with 1st, 2nd, and 3rd standard deviation bands.
 */
export const DEFAULT_VWAP_CONFIG: Readonly<VwapConfig> = {
  stdDevMultipliers: [1.0, 2.0, 3.0],
} as const;

/**
 * Standard institutional Exponential Moving Average (EMA) horizon periods.
 */
export const DEFAULT_EMA_PERIODS = {
  FAST: 9,
  MEDIUM: 21,
  SLOW: 50,
  TREND: 200,
} as const;
