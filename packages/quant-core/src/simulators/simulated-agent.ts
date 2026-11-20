/**
 * @file packages/finance-engine/src/simulators/simulated-agent.ts
 * @description Calibrated deterministic deliberation formulas for adversarial agents.
 * @author yuva.devlab@gmail.com
 */

import { AgentRole, AgentStance, SignalRegime } from "@quant-ai/shared-types";
import { RSI_NEUTRAL_MIDPOINT, RSI_OVERBOUGHT_THRESHOLD } from "../constants/technical.constants";
import { INSTITUTIONAL_MIN_RISK_REWARD_RATIO } from "../constants/risk.constants";

export interface AgentDeliberationInputParams {
  readonly role: AgentRole;
  readonly ticker: string;
  readonly currentPrice: number;
  readonly targetPrice: number;
  readonly stopLossPrice: number;
  readonly rsi: number;
  readonly atr?: number;
  readonly riskRewardRatio: number;
  readonly regime: SignalRegime;
}

export interface AgentDeliberationVerdictResult {
  readonly role: AgentRole;
  readonly stance: AgentStance;
  readonly confidence: number;
  readonly summary: string;
  readonly rationale: string;
  readonly isVeto: boolean;
  readonly keyCatalyst?: string;
  readonly keyRisk?: string;
}

/**
 * Generates deterministic mathematical consensus verdict for simulated multi-agent tests.
 */
export function generateDeterministicAgentVerdict(
  input: AgentDeliberationInputParams,
): AgentDeliberationVerdictResult {
  const { role, ticker, currentPrice, rsi, riskRewardRatio, regime } = input;

  if (role === AgentRole.MOMENTUM_ANALYST) {
    const isPositiveMomentum =
      rsi >= RSI_NEUTRAL_MIDPOINT && regime !== SignalRegime.BEARISH_CONTRACTION;
    const confidence = Math.min(95, Math.max(50, Math.round(50 + (rsi - 50) * 0.8)));

    return {
      role,
      stance: isPositiveMomentum ? AgentStance.BULLISH : AgentStance.NEUTRAL,
      confidence,
      summary: `${ticker} momentum expansion: RSI at ${rsi.toFixed(1)} with positive order velocity in ${regime}.`,
      rationale: `Target price at ${input.targetPrice} offers a ${riskRewardRatio.toFixed(2)}x risk-reward ratio above ATR volatility threshold.`,
      isVeto: false,
      keyCatalyst: "Volume surge and institutional block absorption above 20 EMA",
    };
  }

  if (role === AgentRole.RED_TEAM_SKEPTIC) {
    const isOverbought = rsi > RSI_OVERBOUGHT_THRESHOLD;
    const isRiskRewardPoor = riskRewardRatio < INSTITUTIONAL_MIN_RISK_REWARD_RATIO;
    const isVeto = isOverbought && isRiskRewardPoor;

    return {
      role,
      stance: isOverbought ? AgentStance.BEARISH : AgentStance.NEUTRAL,
      confidence: isOverbought ? 84 : 62,
      summary: isOverbought
        ? `RSI at ${rsi.toFixed(1)} signals extreme overbought exhaustion; high probability of bull trap.`
        : `Base structure intact at ${currentPrice}; monitor overhead liquidity clusters.`,
      rationale: isRiskRewardPoor
        ? "Asymmetric downside tail risk: trade setup does not meet institutional 2.0 R:R hurdle."
        : "Acceptable adverse excursion limits, but watch trailing stops strictly.",
      isVeto,
      keyRisk: isOverbought
        ? "Exhaustion gap fill and mean reversion"
        : "Breakdown below stop loss",
    };
  }

  // AgentRole.QUANT_RISK_OFFICER
  const isApproved = riskRewardRatio >= INSTITUTIONAL_MIN_RISK_REWARD_RATIO && rsi < 75;
  return {
    role: AgentRole.QUANT_RISK_OFFICER,
    stance: isApproved ? AgentStance.BULLISH : AgentStance.NEUTRAL,
    confidence: Math.round(Math.min(92, Math.max(60, 55 + riskRewardRatio * 10))),
    summary: isApproved
      ? `Trade expectancy validated: ${riskRewardRatio.toFixed(2)}:1 R:R with invalidation locked at ${input.stopLossPrice}.`
      : `Expectancy gating failed: insufficient margin of safety for ${ticker}.`,
    rationale: `Kelly-optimal allocation cleared with stop loss positioned at ${input.stopLossPrice}.`,
    isVeto: !isApproved,
  };
}
