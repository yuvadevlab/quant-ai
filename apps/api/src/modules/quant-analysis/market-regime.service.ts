import { Injectable } from "@nestjs/common";
import {
  classifyMarketRegime,
  DEFAULT_REGIME_CONFIG,
  MarketMetrics,
  RegimeClassificationResult,
  RegimeConfig,
} from "@quant-ai/contracts";

/**
 * Service identifying active market regimes and volatility states.
 */
@Injectable()
export class MarketRegimeService {
  /**
   * Evaluates current market metrics and classifies the market regime.
   *
   * @param metrics Calculated volatility, trend, and oscillator metrics.
   * @param config Optional parameter overrides for sensitivity thresholds.
   * @returns RegimeClassificationResult with regime enum, confidence, and rationale.
   */
  classify(metrics: MarketMetrics, config?: Partial<RegimeConfig>): RegimeClassificationResult {
    return classifyMarketRegime(metrics, config ?? DEFAULT_REGIME_CONFIG);
  }
}
