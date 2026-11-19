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
   * Resolves the active AI model adapter based on configuration or explicit request override.
   *
   * @param override - Optional per-request provider override.
   * @returns Active AiModelAdapter instance.
   */
  public getAdapter(override?: AiProviderType): AiModelAdapter {
    const targetProvider = override ?? this.configService.aiProvider;

    switch (targetProvider) {
      case AiProviderType.GEMINI: {
        const client = new GoogleAdapter({
          apiKey: this.configService.geminiApiKey,
          defaultModel: AI_DEFAULT_MODELS.GOOGLE,
        });
        return new DevLabProviderAdapter(AiProviderType.GEMINI, AI_DEFAULT_MODELS.GOOGLE, client);
      }

      case AiProviderType.ANTHROPIC: {
        const client = new AnthropicAdapter({
          apiKey: this.configService.anthropicApiKey,
          defaultModel: AI_DEFAULT_MODELS.ANTHROPIC,
        });
        return new DevLabProviderAdapter(
          AiProviderType.ANTHROPIC,
          AI_DEFAULT_MODELS.ANTHROPIC,
          client,
        );
      }

      case AiProviderType.GROQ: {
        const client = new GroqAdapter({
          apiKey: this.configService.groqApiKey,
          defaultModel: AI_DEFAULT_MODELS.GROQ,
        });
        return new DevLabProviderAdapter(AiProviderType.GROQ, AI_DEFAULT_MODELS.GROQ, client);
      }

      case AiProviderType.OLLAMA: {
        const client = new OllamaAdapter({
          baseUrl: this.configService.ollamaBaseUrl,
          defaultModel: AI_DEFAULT_MODELS.OLLAMA,
        });
        return new DevLabProviderAdapter(AiProviderType.OLLAMA, AI_DEFAULT_MODELS.OLLAMA, client);
      }

      case AiProviderType.SIMULATED:
      default:
        this.logger.debug(`Using ${targetProvider} model adapter`);
        return this.simulatedAdapter;
    }
  }
}
