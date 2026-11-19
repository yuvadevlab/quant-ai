/**
 * @file packages/events/src/events.test.ts
 * @description Unit tests for @quant-ai/events envelopes and schema validations.
 * @author yuva.devlab@gmail.com
 */

import { describe, expect, it } from "vitest";
import {
  AgentRole,
  AgentStance,
  MarketIndex,
  SignalDirection,
  SignalRegime,
  SignalStatus,
} from "@quant-ai/shared-types";
import {
  createMarketTickEnvelope,
  createPredictionEnvelope,
  createDeliberationEnvelope,
} from "./index";

describe("@quant-ai/events Domain Envelopes", () => {
  it("creates valid MarketTick DomainEventEnvelope conforming to @yuva-devlab/events", () => {
    const envelope = createMarketTickEnvelope({
      symbol: MarketIndex.NIFTY_50,
      name: "NIFTY 50",
      price: 24350.25,
      change: 120.5,
      percentChange: 0.5,
      high: 24400,
      low: 24300,
      volume: 1500000,
      timestamp: new Date().toISOString(),
    });

    expect(envelope.eventId).toBeDefined();
    expect(envelope.eventType).toBe("quantai.market.ticks");
    expect(envelope.payload.symbol).toBe(MarketIndex.NIFTY_50);
    expect(envelope.payload.price).toBe(24350.25);
  });

  it("creates valid Prediction DomainEventEnvelope", () => {
    const envelope = createPredictionEnvelope({
      predictionId: "PRED-8942",
      symbol: MarketIndex.NIFTY_50,
      direction: SignalDirection.LONG,
      confidenceScore: 84.5,
      expectedValue: 1.42,
      targetPrice: 24580,
      stopLossPrice: 24210,
      regime: SignalRegime.BULLISH_EXPANSION,
      status: SignalStatus.ACTIVE,
      createdAt: new Date().toISOString(),
    });

    expect(envelope.eventId).toBeDefined();
    expect(envelope.eventType).toBe("quantai.predictions.generated");
    expect(envelope.payload.predictionId).toBe("PRED-8942");
    expect(envelope.payload.direction).toBe(SignalDirection.LONG);
  });

  it("creates valid Deliberation DomainEventEnvelope", () => {
    const envelope = createDeliberationEnvelope({
      predictionId: "PRED-8942",
      consensusVeto: false,
      netScore: 88,
      verdicts: [
        {
          agentRole: AgentRole.MOMENTUM_ANALYST,
          stance: AgentStance.BULLISH,
          score: 85,
          rationale: "Strong order flow momentum",
          isVeto: false,
        },
      ],
      timestamp: new Date().toISOString(),
    });

    expect(envelope.eventId).toBeDefined();
    expect(envelope.eventType).toBe("quantai.deliberation.completed");
    expect(envelope.payload.consensusVeto).toBe(false);
    expect(envelope.payload.verdicts).toHaveLength(1);
  });
});
