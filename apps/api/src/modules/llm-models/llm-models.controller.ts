/**
 * @file apps/api/src/modules/llm-models/llm-models.controller.ts
 * @description REST controller exposing database-driven LLM model provider endpoints.
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import type { LlmModel, LlmProvider } from "@quant-ai/database";
import { LlmModelsService } from "./llm-models.service";
import type {
  CreateLlmModelDto,
  CreateLlmProviderDto,
  DeprecateLlmModelDto,
} from "./llm-models.types";

@Controller("models")
export class LlmModelsController {
  private readonly logger = new Logger(LlmModelsController.name);

  public constructor(private readonly modelsService: LlmModelsService) {}

  /**
   * Lists all models with optional filtering by provider and deprecation status.
   */
  @Get()
  public async listModels(
    @Query("providerId") providerId?: string,
    @Query("includeDeprecated") includeDeprecated?: string,
  ): Promise<LlmModel[]> {
    this.logger.info("[listModels] Querying registered LLM models catalog");
    return this.modelsService.listModels({
      providerId,
      includeDeprecated: includeDeprecated === "true",
    });
  }

  /**
   * Lists only active, non-deprecated models ready for live deliberation.
   */
  @Get("active")
  public async listActiveModels(): Promise<LlmModel[]> {
    this.logger.info("[listActiveModels] Querying active LLM models");
    return this.modelsService.listModels({ includeDeprecated: false });
  }

  /**
   * Returns the default active reasoning model.
   */
  @Get("default")
  public async getDefaultModel(): Promise<LlmModel | null> {
    this.logger.info("[getDefaultModel] Querying default active LLM model");
    return this.modelsService.getDefaultModel();
  }

  /**
   * Lists all registered AI providers.
   */
  @Get("providers")
  public async listProviders(): Promise<LlmProvider[]> {
    this.logger.info("[listProviders] Querying registered AI providers");
    return this.modelsService.listProviders();
  }

  /**
   * Dynamically registers a new model under a provider in the database.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createModel(@Body() dto: CreateLlmModelDto): Promise<LlmModel> {
    this.logger.info(`[createModel] Registering new LLM model: ${dto.modelIdentifier}`);
    return this.modelsService.createModel(dto);
  }

  /**
   * Dynamically registers a new AI provider in the database.
   */
  @Post("providers")
  @HttpCode(HttpStatus.CREATED)
  public async registerProvider(@Body() dto: CreateLlmProviderDto): Promise<LlmProvider> {
    this.logger.info(`[registerProvider] Registering new AI provider: ${dto.name}`);
    return this.modelsService.registerProvider(dto);
  }

  /**
   * Deprecates an existing model without deletion, preserving historical logs.
   */
  @Patch(":id/deprecate")
  public async deprecateModel(
    @Param("id") id: string,
    @Body() dto: DeprecateLlmModelDto,
  ): Promise<LlmModel> {
    this.logger.info(`[deprecateModel] Request to deprecate LLM model ${id}`);
    return this.modelsService.deprecateModel(id, dto);
  }
}
