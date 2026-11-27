/**
 * @file apps/api/src/modules/market/market-config.types.ts
 * @description Dynamic runtime configuration interfaces for the market engine backed by @quant-ai/quant-core.
 */

import {
  type MarketBreadthConfigEnvelope,
  type SectorMomentumConfigEnvelope,
  type MarketBreadthOutput,
  type MomentumClassification,
  SystemConfigKey,
  calculateMarketBreadth as coreCalculateMarketBreadth,
  classifySectorMomentum as coreClassifySectorMomentum,
} from "@quant-ai/quant-core";

export { SystemConfigKey };
export type MarketBreadthConfig = MarketBreadthConfigEnvelope;
export type SectorMomentumConfig = SectorMomentumConfigEnvelope;
export type CalculatedMarketBreadth = MarketBreadthOutput;
export type SectorMomentum = MomentumClassification;

export const DEFAULT_BREADTH_CONFIG: MarketBreadthConfig = {
  totalUniverseCount: 2214,
  fiiNetCr: 2145.0,
  diiNetCr: 1280.0,
  fiiCurrencyPrefix: "₹",
  fiiUnitSuffix: "Cr",
  vixLowThreshold: 15.0,
  vixHighThreshold: 22.0,
  bullishRegime: "Institutional Accumulation",
  cautiousRegime: "Distribution & Profit Taking",
  neutralRegime: "Consolidation & Rangebound",
  lowVolText: "Low Volatility",
  elevatedVolText: "Elevated Volatility",
  highVolText: "Extreme Volatility",
};

export const DEFAULT_SECTOR_CONFIG: SectorMomentumConfig = {
  strongThreshold: 1.5,
  moderateThreshold: 0.5,
  weakThreshold: -1.0,
};

/**
 * Re-exports breadth calculation from canonical quant-core engine.
 */
export const calculateMarketBreadth = (
  changes: readonly number[],
  vix: number,
  config: MarketBreadthConfig,
): CalculatedMarketBreadth => {
  let sampleAdvances = 0;
  let sampleDeclines = 0;
  let sampleUnchanged = 0;

  for (const change of changes) {
    if (change > 0) sampleAdvances++;
    else if (change < 0) sampleDeclines++;
    else sampleUnchanged++;
  }

  return coreCalculateMarketBreadth(
    {
      advances: sampleAdvances,
      declines: sampleDeclines,
      unchanged: sampleUnchanged,
      indiaVix: vix,
    },
    config,
  );
};

/**
 * Re-exports sector momentum classifier from canonical quant-core engine.
 */
export const classifyMomentum = (
  pct: number,
  config: SectorMomentumConfig,
): MomentumClassification => {
  return coreClassifySectorMomentum(pct, config);
};
