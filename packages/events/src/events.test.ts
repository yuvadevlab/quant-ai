/**
 * @file packages/events/src/events.test.ts
 * @description Unit tests for @quant-ai/events envelopes and schema validations.
 */

import { describe, expect, it } from "vitest";
import {
  AgentRole,
  AgentStance,
  AssetClass,
  MarketDataStatus,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeStrategy,
} from "@quant-ai/shared-types";
import {
  createMarketTickEnvelope,
  createPredictionEnvelope,
  createDeliberationEnvelope,
} from "./index";

describe("@quant-ai/events Domain Envelopes", () => {
  it("creates valid MarketTick DomainEventEnvelope conforming to @yuva-devlab/events", () => {
    const envelope = createMarketTickEnvelope({
      symbol: "NIFTY 50",
      name: "Nifty 50 Benchmark",
      price: 24350.25,
      change: 120.5,
      percentChange: 0.5,
      high: 24400,
      low: 24300,
      volume: 1500000,
      timestamp: new Date().toISOString(),
      dataSource: "Test provider",
      dataStatus: MarketDataStatus.VERIFIED,
      observedAt: new Date().toISOString(),
    });

    expect(envelope.eventId).toBeDefined();
    expect(envelope.eventType).toBe("quantai.market.ticks");
    expect(envelope.payload.symbol).toBe("NIFTY 50");
    expect(envelope.payload.price).toBe(24350.25);
  });

  it("creates valid Prediction DomainEventEnvelope with multi-strategy payload", () => {
    const envelope = createPredictionEnvelope({
      predictionId: "PRED-8942",
      symbol: "BANKNIFTY 52000 CE",
      direction: SignalDirection.LONG,
      strategy: TradeStrategy.OPTIONS_EXPIRY,
      assetClass: AssetClass.OPTION,
      confidenceScore: 84.5,
      expectedValue: 1.42,
      targetPrice: 380,
      stopLossPrice: 210,
      regime: SignalRegime.BULLISH_EXPANSION,
      status: SignalStatus.ACTIVE,
      createdAt: new Date().toISOString(),
    });

    expect(envelope.eventId).toBeDefined();
    expect(envelope.eventType).toBe("quantai.predictions.generated");
    expect(envelope.payload.predictionId).toBe("PRED-8942");
    expect(envelope.payload.direction).toBe(SignalDirection.LONG);
    expect(envelope.payload.strategy).toBe(TradeStrategy.OPTIONS_EXPIRY);
    expect(envelope.payload.assetClass).toBe(AssetClass.OPTION);
  });

  it("creates valid DeliberationCompleted DomainEventEnvelope", () => {
    const envelope = createDeliberationEnvelope({
      predictionId: "PRED-8942",
      consensusVeto: false,
      netScore: 88,
      verdicts: [
        {
          agentRole: AgentRole.MOMENTUM_ANALYST,
          stance: AgentStance.BULLISH,
          score: 90,
          rationale: "Breakout above multi-week resistance.",
          isVeto: false,
        },
      ],
      timestamp: new Date().toISOString(),
    });

    expect(envelope.eventId).toBeDefined();
    expect(envelope.eventType).toBe("quantai.deliberation.completed");
    expect(envelope.payload.predictionId).toBe("PRED-8942");
    expect(envelope.payload.netScore).toBe(88);
  });
});
