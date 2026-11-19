/**
 * @fileoverview Type definitions and configuration interfaces for quantitative indicators.
 * Standardizes all input parameters, eliminating hardcoded constants across algorithms.
 */

/**
 * Standard OHLCV (Open, High, Low, Close, Volume) market candle.
 */
export interface Candle {
  readonly time: string;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
}

/**
 * Configurable parameters for Relative Strength Index (RSI).
 */
export interface RsiConfig {
  readonly period: number;
  readonly overboughtThreshold: number;
  readonly oversoldThreshold: number;
}

/**
 * Configurable parameters for Average True Range (ATR).
 */
export interface AtrConfig {
  readonly period: number;
}

/**
 * Configurable parameters for Bollinger Bands.
 */
export interface BollingerConfig {
  readonly period: number;
  readonly stdDevMultiplier: number;
}

/**
 * Result bundle for Bollinger Bands calculation.
 */
export interface BollingerBandsResult {
  readonly middle: readonly number[];
  readonly upper: readonly number[];
  readonly lower: readonly number[];
  readonly bandwidth: readonly number[];
}

/**
 * Configurable parameters for Keltner Channels.
 */
export interface KeltnerConfig {
  readonly emaPeriod: number;
  readonly atrPeriod: number;
  readonly multiplier: number;
}

/**
 * Result bundle for Keltner Channels calculation.
 */
export interface KeltnerChannelsResult {
  readonly middle: readonly number[];
  readonly upper: readonly number[];
  readonly lower: readonly number[];
}

/**
 * Result of volatility squeeze analysis (Bollinger inside Keltner).
 */
export interface SqueezeResult {
  readonly isSqueezing: boolean;
  readonly squeezePeriods: number;
  readonly momentum: number;
}

/**
 * Configurable parameters for Volume Weighted Average Price (VWAP).
 */
export interface VwapConfig {
  readonly stdDevMultipliers: readonly number[];
}

/**
 * Result bundle for VWAP with multiple standard deviation bands.
 */
export interface VwapResult {
  readonly vwap: readonly number[];
  readonly upperBands: readonly (readonly number[])[];
  readonly lowerBands: readonly (readonly number[])[];
}
