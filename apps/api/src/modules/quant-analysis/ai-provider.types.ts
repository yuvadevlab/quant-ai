/**
 * @file apps/api/src/modules/quant-analysis/ai-provider.types.ts
 * @description Type contracts and payload schemas for multi-provider AI model routing.
 * @author yuva.devlab@gmail.com
 */

import { AgentRole, AgentStance, SignalRegime } from "@quant-ai/shared-types";

/**
 * Standard input context for an individual agent's deliberation turn.
 */
export interface GenerateDeliberationInput {
  readonly ticker: string;
  readonly role: AgentRole;
  readonly currentPrice: number;
  readonly rsi: number;
  readonly atr: number;
  readonly regime: SignalRegime;
  readonly targetPrice: number;
  readonly stopLossPrice: number;
  readonly riskRewardRatio: number;
  readonly volumeSurgeRatio?: number;
}

/**
 * Validated output returned by an AI model for an agent deliberation persona.
 */
export interface AgentDebateOutput {
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
 * Generic contract for AI provider model adapters.
 */
export interface AiModelAdapter {
  readonly providerName: string;
  generateAgentVerdict(input: GenerateDeliberationInput): Promise<AgentDebateOutput>;
}
