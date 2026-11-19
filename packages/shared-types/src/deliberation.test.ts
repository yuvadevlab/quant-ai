import { describe, expect, it } from "vitest";
import { evaluateTradeExpectancy, synthesizeAgentConsensus } from "./deliberation";
import { AgentRole, AgentStance } from "./deliberation.types";

describe("Multi-Agent Deliberation & Expectancy Gate", () => {
  it("approves trade with positive mathematical expectancy and >= 2.0 R:R", () => {
    const result = evaluateTradeExpectancy({
      winProbability: 0.58, // 58% win rate
      targetGain: 120, // +120 points
      stopLossLoss: 50, // -50 points (2.4 R:R)
      estimatedFriction: 2,
    });
    expect(result.isApproved).toBe(true);
    expect(result.riskRewardRatio).toBe(2.4);
    expect(result.mathematicalExpectancy).toBeGreaterThan(0);
  });

  it("vetoes trade when Risk/Reward ratio is below minimum threshold", () => {
    const result = evaluateTradeExpectancy({
      winProbability: 0.65,
      targetGain: 60,
      stopLossLoss: 50, // 1.2 R:R (< 2.0 minimum)
    });
    expect(result.isApproved).toBe(false);
    expect(result.vetoReason).toContain("Risk/Reward ratio");
  });

  it("vetoes trade when mathematical expectancy is negative", () => {
    const result = evaluateTradeExpectancy({
      winProbability: 0.25, // Low win probability
      targetGain: 100,
      stopLossLoss: 50,
    });
    expect(result.isApproved).toBe(false);
    expect(result.vetoReason).toContain("Mathematical expectancy");
  });

  it("synthesizes multi-agent consensus stances", () => {
    const consensus = synthesizeAgentConsensus([
      {
        role: AgentRole.MOMENTUM_ANALYST,
        stance: AgentStance.BULLISH,
        confidence: 88,
        summary: "Momentum aligned",
      },
      {
        role: AgentRole.QUANT_RISK_OFFICER,
        stance: AgentStance.BULLISH,
        confidence: 82,
        summary: "Positive expectancy",
      },
      {
        role: AgentRole.RED_TEAM_SKEPTIC,
        stance: AgentStance.NEUTRAL,
        confidence: 60,
        summary: "Mild resistance overhead",
      },
    ]);
    expect(consensus.consensusStance).toBe(AgentStance.BULLISH);
    expect(consensus.compositeConfidence).toBeGreaterThan(60);
    expect(consensus.isVetoedBySkeptic).toBe(false);
  });

  it("detects skeptic veto when red-team has high bearish conviction", () => {
    const consensus = synthesizeAgentConsensus([
      {
        role: AgentRole.MOMENTUM_ANALYST,
        stance: AgentStance.BULLISH,
        confidence: 90,
        summary: "Breakout",
      },
      {
        role: AgentRole.RED_TEAM_SKEPTIC,
        stance: AgentStance.BEARISH,
        confidence: 85, // High-confidence objection
        summary: "Massive institutional distribution block at resistance",
      },
    ]);
    expect(consensus.isVetoedBySkeptic).toBe(true);
  });
});
