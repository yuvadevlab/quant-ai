/**
 * @file apps/api/src/modules/quant-analysis/adapters/devlab-provider.adapter.ts
 * @description Universal AI model adapter backed by canonical @yuva-devlab/ai-client provider layer.
 * @author yuva.devlab@gmail.com
 */

import { Logger } from "@yuva-devlab/logger";
import { MessageRole, type ILLMProvider, type AIMessage } from "@yuva-devlab/ai-client";
import { buildDeliberationSystemPrompt, buildDeliberationUserPrompt } from "@quant-ai/prompts";
import { AgentStance } from "@quant-ai/shared-types";
import type {
  AgentDebateOutput,
  AiModelAdapter,
  GenerateDeliberationInput,
} from "../ai-provider.types";
import { SimulatedModelAdapter } from "./simulated.adapter";

interface RawParsedVerdict {
  stance?: string;
  confidence?: number;
  argument?: string;
  veto?: boolean;
}

/**
 * Universal adapter integrating any @yuva-devlab/ai-client provider with QuantAI deliberation.
 */
export class DevLabProviderAdapter implements AiModelAdapter {
  private readonly logger: Logger;
  private readonly fallbackAdapter = new SimulatedModelAdapter();

  public constructor(
    public readonly providerName: string,
    public readonly modelName: string,
    private readonly client: ILLMProvider,
  ) {
    this.logger = new Logger(`DevLabProviderAdapter:${providerName}`);
  }

  /**
   * Generates a structured agent debate verdict using dynamic prompts and safe JSON extraction.
   *
   * @param input Context input parameters for the agent turn.
   * @returns Validated agent deliberation output.
   */
  public async generateAgentVerdict(input: GenerateDeliberationInput): Promise<AgentDebateOutput> {
    const systemPrompt = buildDeliberationSystemPrompt(input.role);
    const userPrompt = buildDeliberationUserPrompt({
      ticker: input.ticker,
      currentPrice: input.currentPrice,
      targetPrice: input.targetPrice,
      stopLossPrice: input.stopLossPrice,
      rsi: input.rsi,
      atr: input.atr,
      regime: input.regime,
      context: `Risk-Reward: ${input.riskRewardRatio.toFixed(2)}x, VolSurge: ${input.volumeSurgeRatio?.toFixed(1) ?? "1.0"}x`,
    });

    const messages: AIMessage[] = [
      { role: MessageRole.SYSTEM, content: systemPrompt },
      { role: MessageRole.USER, content: userPrompt },
    ];

    try {
      const response = await this.client.complete({
        model: this.modelName,
        messages,
        temperature: 0.2,
        responseFormat: "text",
        timeoutMs: 15000,
      });

      const parsed = this.extractJsonVerdict(response.text);
      if (parsed) {
        const stance = this.normalizeStance(parsed.stance);
        const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 70;
        const isVeto = Boolean(parsed.veto);
        const argument = parsed.argument || `${input.role} verified setup for ${input.ticker}`;

        return {
          role: input.role,
          stance,
          confidence: Math.min(100, Math.max(0, Math.round(confidence))),
          summary: argument.slice(0, 160),
          rationale: argument,
          isVeto,
        };
      }
    } catch (error) {
      this.logger.warn(
        `[${this.providerName}] Deliberation request failed; falling back to simulated engine`,
        { error: error instanceof Error ? error.message : String(error) },
      );
    }

    return this.fallbackAdapter.generateAgentVerdict(input);
  }

  /**
   * Extracts JSON payload from raw response strings containing optional Markdown code fences.
   */
  private extractJsonVerdict(rawText: string): RawParsedVerdict | null {
    try {
      const cleaned = rawText
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      return JSON.parse(jsonMatch[0]) as RawParsedVerdict;
    } catch {
      return null;
    }
  }

  /**
   * Normalizes raw stance string to canonical AgentStance enum.
   */
  private normalizeStance(rawStance?: string): AgentStance {
    const upper = (rawStance || "").toUpperCase().trim();
    if (upper === AgentStance.BULLISH) return AgentStance.BULLISH;
    if (upper === AgentStance.BEARISH) return AgentStance.BEARISH;
    return AgentStance.NEUTRAL;
  }
}
