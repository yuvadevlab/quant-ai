/**
 * @fileoverview Pure, deterministic multi-agent consensus and trade expectancy evaluator.
 */

import { DEFAULT_FRICTION_PERCENT, DEFAULT_RISK_GATE_CONFIG } from "./deliberation.constants";
import {
  AgentDeliberationItem,
  AgentStance,
  RiskGateConfig,
  TradeExpectancyInput,
  TradeExpectancyResult,
} from "./deliberation.types";

/**
 * Calculates mathematical expectancy and determines whether a signal meets institutional risk criteria.
 *
 * @param input Trade setup parameters (win probability, target, stop loss, friction).
 * @param configOverrides Optional threshold overrides.
 * @returns Complete expectancy assessment with approval flag.
 */
export function evaluateTradeExpectancy(
  input: TradeExpectancyInput,
  configOverrides?: Partial<RiskGateConfig>,
): TradeExpectancyResult {
  const config: RiskGateConfig = { ...DEFAULT_RISK_GATE_CONFIG, ...configOverrides };
  const friction = input.estimatedFriction ?? DEFAULT_FRICTION_PERCENT;
  const pWin = Math.max(0, Math.min(1, input.winProbability));
  const pLoss = 1 - pWin;

  if (input.stopLossLoss <= 0) {
    return {
      mathematicalExpectancy: 0,
      riskRewardRatio: 0,
      isApproved: false,
      vetoReason: "Stop loss distance must be strictly greater than zero.",
    };
  }

  const riskRewardRatio = Number((input.targetGain / input.stopLossLoss).toFixed(2));
  // Mathematical Expectancy = (P(Win) * Gain) - (P(Loss) * Loss) - Friction
  const mathematicalExpectancy = Number(
    (pWin * input.targetGain - pLoss * input.stopLossLoss - friction).toFixed(4),
  );

  if (riskRewardRatio < config.minimumRiskReward) {
    return {
      mathematicalExpectancy,
      riskRewardRatio,
      isApproved: false,
      vetoReason: `Risk/Reward ratio ${riskRewardRatio} is below minimum requirement ${config.minimumRiskReward}.`,
    };
  }

  if (mathematicalExpectancy <= 0) {
    return {
      mathematicalExpectancy,
      riskRewardRatio,
      isApproved: false,
      vetoReason: `Mathematical expectancy (${mathematicalExpectancy.toFixed(3)}) is non-positive. Trade is negative-EV.`,
    };
  }

  return {
    mathematicalExpectancy,
    riskRewardRatio,
    isApproved: true,
  };
}

/**
 * Calculates synthesized conviction and stance from multi-agent deliberations.
 *
 * @param deliberations Array of individual agent deliberations.
 * @returns Aggregated stance and composite confidence score.
 */
export function synthesizeAgentConsensus(deliberations: readonly AgentDeliberationItem[]): {
  readonly consensusStance: AgentStance;
  readonly compositeConfidence: number;
  readonly isVetoedBySkeptic: boolean;
} {
  if (deliberations.length === 0) {
    return {
      consensusStance: AgentStance.NEUTRAL,
      compositeConfidence: 50,
      isVetoedBySkeptic: false,
    };
  }

  let directionalSum = 0;
  let hasBullishAttempt = false;
  let skepticHardVeto = false;

  for (const item of deliberations) {
    const directionMultiplier =
      item.stance === AgentStance.BULLISH ? 1 : item.stance === AgentStance.BEARISH ? -1 : 0;
    directionalSum += directionMultiplier * item.confidence;

    if (item.stance === AgentStance.BULLISH) {
      hasBullishAttempt = true;
    }
    if (item.stance === AgentStance.BEARISH && item.confidence >= 80) {
      skepticHardVeto = true;
    }
  }

  const activeVotes = deliberations.filter((d) => d.stance !== AgentStance.NEUTRAL);
  const compositeConfidence =
    activeVotes.length > 0
      ? Math.round(activeVotes.reduce((acc, v) => acc + v.confidence, 0) / activeVotes.length)
      : Math.round(deliberations.reduce((acc, v) => acc + v.confidence, 0) / deliberations.length);

  const avgDirectionalScore = directionalSum / deliberations.length;
  const consensusStance =
    avgDirectionalScore > 10
      ? AgentStance.BULLISH
      : avgDirectionalScore < -10
        ? AgentStance.BEARISH
        : AgentStance.NEUTRAL;

  return {
    consensusStance,
    compositeConfidence,
    isVetoedBySkeptic: skepticHardVeto && hasBullishAttempt,
  };
}
