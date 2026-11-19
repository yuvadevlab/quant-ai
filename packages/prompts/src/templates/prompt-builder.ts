/**
 * @file packages/prompts/src/templates/prompt-builder.ts
 * @description Dynamic prompt compilation utilities leveraging @yuva-devlab/agent-core.
 * @author yuva.devlab@gmail.com
 */

import { compilePrompt } from "@yuva-devlab/agent-core";
import { AgentRole, SignalRegime } from "@quant-ai/shared-types";
import {
  BULL_RESEARCHER_PERSONA,
  BEAR_SKEPTIC_PERSONA,
  RISK_OFFICER_PERSONA,
  QUANTAI_CONSTITUTION,
} from "../personas";
import { DELIBERATION_SYSTEM_PROMPT_TEMPLATE } from "../system";
import { DELIBERATION_USER_PROMPT_TEMPLATE } from "./deliberation-template";

/**
 * Context input parameters for generating a deliberation prompt.
 */
export interface DeliberationPromptContext {
  readonly ticker: string;
  readonly currentPrice: number;
  readonly targetPrice: number;
  readonly stopLossPrice: number;
  readonly rsi: number;
  readonly atr?: number;
  readonly regime?: SignalRegime | string;
  readonly context?: string;
}

/**
 * Resolves the persona string corresponding to an agent role.
 *
 * @param role Agent role enum.
 * @returns Persona prompt definition.
 */
export function resolveAgentPersona(role: AgentRole): string {
  switch (role) {
    case AgentRole.MOMENTUM_ANALYST:
      return BULL_RESEARCHER_PERSONA;
    case AgentRole.RED_TEAM_SKEPTIC:
      return BEAR_SKEPTIC_PERSONA;
    case AgentRole.QUANT_RISK_OFFICER:
      return RISK_OFFICER_PERSONA;
    default:
      return RISK_OFFICER_PERSONA;
  }
}

/**
 * Compiles a dynamic system prompt for an agent deliberation round.
 *
 * @param role Target agent role in the deliberation committee.
 * @returns Compiled system prompt with embedded constitution and persona.
 */
export function buildDeliberationSystemPrompt(role: AgentRole): string {
  const persona = resolveAgentPersona(role);

  return compilePrompt({
    template: DELIBERATION_SYSTEM_PROMPT_TEMPLATE,
    variables: {
      constitution: QUANTAI_CONSTITUTION,
      persona,
    },
    includeToolCatalog: false,
  });
}

/**
 * Compiles a dynamic user prompt containing the asset technical setup.
 *
 * @param context Asset technical matrix and parameters.
 * @returns Fully interpolated prompt text for model execution.
 */
export function buildDeliberationUserPrompt(context: DeliberationPromptContext): string {
  return compilePrompt({
    template: DELIBERATION_USER_PROMPT_TEMPLATE,
    variables: {
      ticker: context.ticker,
      currentPrice: context.currentPrice,
      targetPrice: context.targetPrice,
      stopLossPrice: context.stopLossPrice,
      rsi: context.rsi.toFixed(2),
      atr: (context.atr ?? 0).toFixed(2),
      regime: context.regime ?? SignalRegime.BULLISH_EXPANSION,
      context: context.context ?? "Standard continuous market session",
    },
    includeToolCatalog: false,
  });
}
