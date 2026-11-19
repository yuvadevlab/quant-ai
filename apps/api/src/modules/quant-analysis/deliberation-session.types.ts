/**
 * @file apps/api/src/modules/quant-analysis/deliberation-session.types.ts
 * @description Type definitions for multi-agent deliberation sessions and expectancy setups.
 * @author yuva.devlab@gmail.com
 */

import { AgentDeliberationItem, AgentStance, SignalRegime } from "@quant-ai/shared-types";

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
 * Context input for conducting a live multi-agent deliberation session.
 */
export interface DeliberationSessionInput {
  readonly predictionId: string;
  readonly ticker: string;
  readonly currentPrice: number;
  readonly targetPrice: number;
  readonly stopLossPrice: number;
  readonly rsi: number;
  readonly atr: number;
  readonly regime: SignalRegime;
}

/**
 * Outcome resulting from multi-agent adversarial consensus.
 */
export interface DeliberationOutcome {
  readonly predictionId: string;
  readonly consensusStance: AgentStance;
  readonly compositeConfidence: number;
  readonly isVetoedBySkeptic: boolean;
  readonly verdicts: readonly AgentDeliberationItem[];
  readonly timestamp: string;
}
