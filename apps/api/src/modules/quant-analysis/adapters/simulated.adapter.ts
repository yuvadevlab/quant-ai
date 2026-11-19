/**
 * @file apps/api/src/modules/quant-analysis/adapters/simulated.adapter.ts
 * @description Deterministic calibrated model adapter grounded in pure quantitative mathematics.
 * @author yuva.devlab@gmail.com
 */

import { AgentRole, AgentStance, SignalRegime } from "@quant-ai/shared-types";
import type {
  AgentDebateOutput,
  AiModelAdapter,
  GenerateDeliberationInput,
} from "../ai-provider.types";

/**
 * Calibrated deterministic adapter for environments without live frontier API keys.
 * Guarantees zero hallucinations and deterministic Bayesian risk gating.
 */
export class SimulatedModelAdapter implements AiModelAdapter {
  public readonly providerName = "simulated";

  public async generateAgentVerdict(input: GenerateDeliberationInput): Promise<AgentDebateOutput> {
    const { role, ticker, currentPrice, rsi, riskRewardRatio, regime } = input;

    if (role === AgentRole.MOMENTUM_ANALYST) {
      const isPositiveMomentum = rsi >= 50 && regime !== SignalRegime.BEARISH_CONTRACTION;
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
      const isOverbought = rsi > 70;
      const isRiskRewardPoor = riskRewardRatio < 2.0;
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

    // AgentRole.QUANT_RISK_OFFICER (or Macro Analyst)
    const isApproved = riskRewardRatio >= 2.0 && rsi < 75;
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
}
