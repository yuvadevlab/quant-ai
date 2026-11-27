/**
 * @file apps/api/src/modules/quant-analysis/adapters/simulated.adapter.ts
 * @description Calibrated deterministic model adapter backed by canonical @quant-ai/quant-core formulas.
 */

import { generateDeterministicAgentVerdict } from "@quant-ai/quant-core";
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
    const verdict = generateDeterministicAgentVerdict({
      role: input.role,
      ticker: input.ticker,
      currentPrice: input.currentPrice,
      targetPrice: input.targetPrice,
      stopLossPrice: input.stopLossPrice,
      rsi: input.rsi,
      atr: input.atr,
      riskRewardRatio: input.riskRewardRatio,
      regime: input.regime,
    });

    return {
      role: verdict.role,
      stance: verdict.stance,
      confidence: verdict.confidence,
      summary: verdict.summary,
      rationale: verdict.rationale,
      isVeto: verdict.isVeto,
      keyCatalyst: verdict.keyCatalyst,
      keyRisk: verdict.keyRisk,
    };
  }
}
