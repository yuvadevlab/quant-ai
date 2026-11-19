/**
 * @fileoverview Centralized default configurations for market regime classification.
 */

import { RegimeConfig } from "./regime.types";

/**
 * Standard baseline regime classification thresholds.
 */
export const DEFAULT_REGIME_CONFIG: Readonly<RegimeConfig> = {
  adxTrendThreshold: 25.0,
  rsiBullishCutoff: 55.0,
  rsiBearishCutoff: 45.0,
  atrHighVolatilityRatio: 1.8,
} as const;
