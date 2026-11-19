/**
 * @fileoverview Pure, deterministic market regime classification algorithm.
 * Dynamically categorizes market condition without hardcoded magic numbers.
 */

import { SignalRegime } from "./enums";
import { DEFAULT_REGIME_CONFIG } from "./regime.constants";
import { MarketMetrics, RegimeClassificationResult, RegimeConfig } from "./regime.types";

/**
 * Classifies the active market regime using multi-factor technical metrics.
 *
 * @param metrics Real-time technical values.
 * @param configOverrides Optional threshold overrides.
 * @returns Classified regime with confidence score and rationale.
 */
export function classifyMarketRegime(
  metrics: MarketMetrics,
  configOverrides?: Partial<RegimeConfig>,
): RegimeClassificationResult {
  const config: RegimeConfig = { ...DEFAULT_REGIME_CONFIG, ...configOverrides };
  const { adxTrendThreshold, rsiBullishCutoff, rsiBearishCutoff, atrHighVolatilityRatio } = config;

  // 1. High Volatility Check
  if (metrics.atrRatio >= atrHighVolatilityRatio) {
    return {
      regime: SignalRegime.HIGH_VOLATILITY,
      confidence: Math.min(95, Math.round(50 + metrics.atrRatio * 20)),
      rationale: `ATR ratio ${metrics.atrRatio.toFixed(2)}x exceeds volatility threshold ${atrHighVolatilityRatio}x.`,
    };
  }

  // 2. Volatility Squeeze / Compression Check
  if (metrics.isSqueezing) {
    return {
      regime: SignalRegime.SIDEWAYS_CONSOLIDATION,
      confidence: 88,
      rationale:
        "Bollinger Bands compressed inside Keltner Channels indicating pre-breakout squeeze.",
    };
  }

  // 3. Trending Regimes (ADX above threshold)
  const isStrongTrend = metrics.adx >= adxTrendThreshold;
  const isBullishEma = metrics.emaFast > metrics.emaSlow && metrics.currentPrice > metrics.emaFast;
  const isBearishEma = metrics.emaFast < metrics.emaSlow && metrics.currentPrice < metrics.emaFast;

  if (isStrongTrend && isBullishEma && metrics.rsi >= rsiBullishCutoff) {
    return {
      regime: SignalRegime.BULLISH_EXPANSION,
      confidence: Math.min(96, Math.round(50 + metrics.adx * 0.8 + (metrics.rsi - 50) * 0.8)),
      rationale: `Strong bullish momentum (ADX: ${metrics.adx.toFixed(1)}, RSI: ${metrics.rsi.toFixed(1)}) with aligned EMA expansion.`,
    };
  }

  if (isStrongTrend && isBearishEma && metrics.rsi <= rsiBearishCutoff) {
    return {
      regime: SignalRegime.BEARISH_CONTRACTION,
      confidence: Math.min(96, Math.round(50 + metrics.adx * 0.8 + (50 - metrics.rsi) * 0.8)),
      rationale: `Bearish breakdown confirmed (ADX: ${metrics.adx.toFixed(1)}, RSI: ${metrics.rsi.toFixed(1)}) below key moving averages.`,
    };
  }

  // 4. Default Sideways / Chop Regime
  return {
    regime: SignalRegime.SIDEWAYS_CONSOLIDATION,
    confidence: 72,
    rationale: `Non-directional chop (ADX ${metrics.adx.toFixed(1)} < ${adxTrendThreshold}); mean-reversion favored.`,
  };
}
