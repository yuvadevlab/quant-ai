import { Injectable } from "@nestjs/common";
import {
  AgentDeliberationItem,
  AgentRole,
  AgentStance,
  DEFAULT_RISK_GATE_CONFIG,
  evaluateTradeExpectancy,
  RiskGateConfig,
  synthesizeAgentConsensus,
  TradeExpectancyInput,
  TradeExpectancyResult,
} from "@quant-ai/shared-types";

/**
 * High-level price parameter inputs for expectancy calculation.
 */
export interface TradePriceSetup {
  readonly entryPrice: number;
  readonly targetPrice: number;
  readonly stopLossPrice: number;
  readonly winProbability: number;
  readonly estimatedFriction?: number;
}

/**
 * Service orchestrating the 3-agent adversarial deliberation and institutional risk gate.
 */
@Injectable()
export class MultiAgentDeliberationService {
  /**
   * Evaluates mathematical trade expectancy and enforces the risk-to-reward ratio threshold.
   *
   * @param setup Trade setup parameters.
   * @param config Optional risk threshold overrides.
   * @returns TradeExpectancyResult detailing expectancy, ratio, and approval status.
   */
  evaluateExpectancy(
    setup: TradePriceSetup | TradeExpectancyInput,
    config?: Partial<RiskGateConfig>,
  ): TradeExpectancyResult {
    let input: TradeExpectancyInput;
    if ("entryPrice" in setup) {
      input = {
        winProbability: setup.winProbability,
        targetGain: Math.abs(setup.targetPrice - setup.entryPrice),
        stopLossLoss: Math.abs(setup.entryPrice - setup.stopLossPrice),
        estimatedFriction: setup.estimatedFriction,
      };
    } else {
      input = setup;
    }

    return evaluateTradeExpectancy(input, config ?? DEFAULT_RISK_GATE_CONFIG);
  }

  /**
   * Synthesizes individual agent stances into an institutional consensus.
   * Enforces hard skeptic red-team veto protection.
   *
   * @param deliberations Array of agent evaluations.
   * @returns Aggregated stance, composite confidence, and veto status.
   */
  synthesizeConsensus(deliberations: readonly AgentDeliberationItem[]): {
    readonly consensusStance: AgentStance;
    readonly compositeConfidence: number;
    readonly isVetoedBySkeptic: boolean;
  } {
    return synthesizeAgentConsensus(deliberations);
  }

  /**
   * Factory producing standard default multi-agent deliberation for a technical breakout.
   *
   * @param ticker Asset ticker symbol.
   * @param rsi Current RSI indicator value.
   * @param riskReward Computed trade risk to reward ratio.
   * @returns Array of standard 3-agent deliberations.
   */
  generateBreakoutDebate(
    ticker: string,
    rsi: number,
    riskReward: number,
  ): readonly AgentDeliberationItem[] {
    const isOverbought = rsi > 70;
    const isRiskAcceptable = riskReward >= 2.0;

    return [
      {
        role: AgentRole.MOMENTUM_ANALYST,
        stance: rsi > 50 ? AgentStance.BULLISH : AgentStance.NEUTRAL,
        confidence: 88,
        summary: `${ticker} momentum expansion: RSI at ${rsi.toFixed(1)} with positive velocity.`,
      },
      {
        role: AgentRole.RED_TEAM_SKEPTIC,
        stance: isOverbought ? AgentStance.BEARISH : AgentStance.NEUTRAL,
        confidence: isOverbought ? 82 : 65,
        summary: isOverbought
          ? "RSI approaching extreme overbought territory; high risk of exhaustion pullback."
          : "Base structure intact; watch for overhead supply clusters.",
      },
      {
        role: AgentRole.QUANT_RISK_OFFICER,
        stance: isRiskAcceptable ? AgentStance.BULLISH : AgentStance.BEARISH,
        confidence: 90,
        summary: isRiskAcceptable
          ? `Risk/Reward of ${riskReward.toFixed(1)} satisfies institutional >= 2.0 threshold.`
          : `Risk/Reward of ${riskReward.toFixed(1)} is below institutional 2.0 threshold. VETO.`,
      },
    ];
  }
}
