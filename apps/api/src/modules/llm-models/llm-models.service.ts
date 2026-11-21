/**
 * @file apps/api/src/modules/llm-models/llm-models.service.ts
 * @description Service managing platform-wide database-backed AI provider and model catalogs.
 * Preserves audit history by deprecating models rather than mutating or deleting past records.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, NotFoundException } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import type { LlmModel, LlmProvider } from "@quant-ai/database";
import { DatabaseService } from "../infrastructure/database.service";
import type {
  CreateLlmModelDto,
  CreateLlmProviderDto,
  DeprecateLlmModelDto,
} from "./llm-models.types";

@Injectable()
export class LlmModelsService {
  private readonly logger = new Logger(LlmModelsService.name);

  public constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Returns all registered providers with their models count.
   */
  public async listProviders(): Promise<LlmProvider[]> {
    return this.databaseService.client.llmProvider.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        models: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
    });
  }

  /**
   * Returns registered models, optionally filtering by provider and deprecation status.
   */
  public async listModels(options?: {
    providerId?: string;
    includeDeprecated?: boolean;
  }): Promise<LlmModel[]> {
    const where: Record<string, unknown> = {};

    if (options?.providerId) {
      where.providerId = options.providerId;
    }

    if (!options?.includeDeprecated) {
      where.isDeprecated = false;
      where.isEnabled = true;
    }

    return this.databaseService.client.llmModel.findMany({
      where,
      include: { provider: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  /**
   * Returns the globally configured default active model from the database.
   */
  public async getDefaultModel(): Promise<LlmModel | null> {
    const defaultModel = await this.databaseService.client.llmModel.findFirst({
      where: { isDefault: true, isEnabled: true, isDeprecated: false },
      include: { provider: true },
    });

    if (defaultModel) {
      return defaultModel;
    }

    return this.databaseService.client.llmModel.findFirst({
      where: { isEnabled: true, isDeprecated: false },
      include: { provider: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  /**
   * Registers a new model in the database under an active provider.
   */
  public async createModel(dto: CreateLlmModelDto): Promise<LlmModel> {
    const provider = await this.databaseService.client.llmProvider.findUnique({
      where: { id: dto.providerId },
    });

    if (!provider) {
      throw new NotFoundException(`Provider ${dto.providerId} does not exist`);
    }

    return this.databaseService.client.llmModel.create({
      data: {
        providerId: dto.providerId,
        name: dto.name,
        modelIdentifier: dto.modelIdentifier,
        description: dto.description ?? null,
        capabilities: (dto.capabilities ?? {}) as never,
        defaultConfig: (dto.defaultConfig ?? {}) as never,
        contextWindow: dto.contextWindow ?? 8192,
        isDefault: dto.isDefault ?? false,
        isEnabled: dto.isEnabled ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { provider: true },
    });
  }

  /**
   * Deprecates an existing model in the database without deletion.
   * Keeps past historical execution and deliberation records intact.
   */
  public async deprecateModel(id: string, dto: DeprecateLlmModelDto): Promise<LlmModel> {
    const existing = await this.databaseService.client.llmModel.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`LLM Model ${id} not found`);
    }

    this.logger.info(
      `[deprecateModel] Deprecating LLM model [${existing.modelIdentifier}]: ${dto.deprecationNote}`,
    );

    return this.databaseService.client.llmModel.update({
      where: { id },
      data: {
        isDeprecated: true,
        isEnabled: false,
        isDefault: false,
        deprecatedAt: new Date(),
        deprecationNote: dto.deprecationNote ?? "Deprecated administratively in database registry",
      },
      include: { provider: true },
    });
  }

  /**
   * Registers a new provider in the database.
   */
  public async registerProvider(dto: CreateLlmProviderDto): Promise<LlmProvider> {
    return this.databaseService.client.llmProvider.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        providerType: dto.providerType,
        description: dto.description ?? null,
        baseUrl: dto.baseUrl ?? null,
        config: (dto.config ?? {}) as never,
        isEnabled: dto.isEnabled ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }
}
