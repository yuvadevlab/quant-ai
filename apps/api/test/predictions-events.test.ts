/**
 * @file apps/api/test/predictions-events.test.ts
 * @description Tests verification-gated prediction outcomes.
 */

import { describe, expect, it } from "vitest";
import {
  AssetClass,
  MarketDataStatus,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeHorizon,
  TradeStrategy,
  type Signal,
} from "@quant-ai/shared-types";
import { createMarketTickEnvelope } from "@quant-ai/events";
import { handlePredictionTick } from "../src/modules/predictions/predictions-events";

const signal: Signal = {
  id: "PRED-NIFTY-1",
  ticker: "NIFTY",
  name: "NIFTY 50",
  direction: SignalDirection.LONG,
  strategy: TradeStrategy.SWING,
  assetClass: AssetClass.INDEX,
  entry: 100,
  current: 100,
  target: 110,
  stopLoss: 90,
  horizon: TradeHorizon.SWING_DAYS,
  confidence: 60,
  status: SignalStatus.ACTIVE,
  regime: SignalRegime.BULLISH_EXPANSION,
  pnlPercent: 0,
  pnlAbsolute: 0,
  maxExcursion: 0,
  maxAdverse: 0,
  publishedAt: new Date().toISOString(),
  thesis: "Test prediction",
  riskReward: 1,
  catalysts: [],
  invalidation: "Stop loss",
  trajectory: [],
  agents: [],
};

function tickEnvelope(dataStatus: MarketDataStatus, price: number) {
  const observedAt = new Date().toISOString();
  return createMarketTickEnvelope({
    symbol: signal.ticker,
    name: signal.name,
    price,
    change: price - signal.current,
    percentChange: 0,
    high: price,
    low: price,
    volume: 0,
    timestamp: observedAt,
    dataSource: "test-provider",
    dataStatus,
    observedAt,
  });
}

describe("handlePredictionTick", () => {
  it.each([
    MarketDataStatus.PROVIDER_UNVERIFIED,
    MarketDataStatus.STALE,
    MarketDataStatus.SIMULATED,
    MarketDataStatus.UNAVAILABLE,
  ])("ignores %s data for prediction outcomes", (dataStatus) => {
    const predictions = new Map([[signal.id, signal]]);

    const completed = handlePredictionTick(predictions, tickEnvelope(dataStatus, 111));

    expect(completed).toEqual([]);
    expect(predictions.get(signal.id)).toEqual(signal);
  });

  it("settles an eligible outcome only from a verified observation", () => {
    const predictions = new Map([[signal.id, signal]]);
    const observedAt = new Date().toISOString();

    const completed = handlePredictionTick(
      predictions,
      tickEnvelope(MarketDataStatus.VERIFIED, 111),
    );

    expect(completed).toHaveLength(1);
    expect(completed[0]).toMatchObject({
      status: SignalStatus.TARGET_HIT,
      metricEligible: true,
      outcomePrice: 111,
    });
    expect(completed[0]?.outcomeAt).toBeDefined();
    expect(Date.parse(completed[0]?.outcomeAt ?? observedAt)).not.toBeNaN();
  });
});
