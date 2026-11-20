/**
 * @file apps/api/src/modules/quant-analysis/ai-provider.factory.ts
 * @description Centralized model router and provider factory leveraging canonical @yuva-devlab/ai-client.
 * @author yuva.devlab@gmail.com
 */

import { Injectable } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import {
  AI_DEFAULT_MODELS,
  AnthropicAdapter,
  GoogleAdapter,
  GroqAdapter,
  OllamaAdapter,
} from "@yuva-devlab/ai-client";
import { AiProviderType } from "@quant-ai/shared-types";
import { ConfigService } from "../infrastructure/config.service";
import type { AiModelAdapter } from "./ai-provider.types";
import { DevLabProviderAdapter } from "./adapters/devlab-provider.adapter";
import { SimulatedModelAdapter } from "./adapters/simulated.adapter";

/**
 * Service managing model routing, provider selection, and fallback resolution.
 */
@Injectable()
export class AiProviderFactory {
  private readonly logger = new Logger(AiProviderFactory.name);
  private readonly simulatedAdapter = new SimulatedModelAdapter();

  public constructor(private readonly configService: ConfigService) {}

  /**
   * Resolves the active AI model adapter based on configuration, database registry, or explicit request override.
   *
   * @param override - Optional per-request provider override.
   * @param modelOverride - Optional per-request model identifier override.
   * @returns Active AiModelAdapter instance.
   */
  public getAdapter(override?: AiProviderType, modelOverride?: string): AiModelAdapter {
    const targetProvider = override ?? this.configService.aiProvider;

    switch (targetProvider) {
      case AiProviderType.GEMINI: {
        const model = modelOverride || AI_DEFAULT_MODELS.GOOGLE;
        const client = new GoogleAdapter({
          apiKey: this.configService.geminiApiKey,
          defaultModel: model,
        });
        return new DevLabProviderAdapter(AiProviderType.GEMINI, model, client);
      }

      case AiProviderType.ANTHROPIC: {
        const model = modelOverride || AI_DEFAULT_MODELS.ANTHROPIC;
        const client = new AnthropicAdapter({
          apiKey: this.configService.anthropicApiKey,
          defaultModel: model,
        });
        return new DevLabProviderAdapter(AiProviderType.ANTHROPIC, model, client);
      }

      case AiProviderType.GROQ: {
        const model = modelOverride || AI_DEFAULT_MODELS.GROQ;
        const client = new GroqAdapter({
          apiKey: this.configService.groqApiKey,
          defaultModel: model,
        });
        return new DevLabProviderAdapter(AiProviderType.GROQ, model, client);
      }

      case AiProviderType.OLLAMA: {
        const model = modelOverride || AI_DEFAULT_MODELS.OLLAMA;
        const client = new OllamaAdapter({
          baseUrl: this.configService.ollamaBaseUrl,
          defaultModel: model,
        });
        return new DevLabProviderAdapter(AiProviderType.OLLAMA, model, client);
      }

      case AiProviderType.SIMULATED:
      default:
        this.logger.debug(`[getAdapter] Using ${targetProvider} model adapter`);
        return this.simulatedAdapter;
    }
  }
}
