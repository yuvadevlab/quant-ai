/**
 * @fileoverview Type definitions and configuration interfaces for market regime detection.
 */

import { SignalRegime } from "./enums";

/**
 * Technical metrics required to classify market regime.
 */
export interface MarketMetrics {
  readonly currentPrice: number;
  readonly emaFast: number;
  readonly emaSlow: number;
  readonly adx: number;
  readonly rsi: number;
  readonly isSqueezing: boolean;
  readonly atrRatio: number;
}

/**
 * Configurable thresholds for regime classification.
 * Completely parameters-driven to avoid hardcoded magic numbers.
 */
export interface RegimeConfig {
  readonly adxTrendThreshold: number;
  readonly rsiBullishCutoff: number;
  readonly rsiBearishCutoff: number;
  readonly atrHighVolatilityRatio: number;
}

/**
 * Result bundle for regime classification.
 */
export interface RegimeClassificationResult {
  readonly regime: SignalRegime;
  readonly confidence: number;
  readonly rationale: string;
}
