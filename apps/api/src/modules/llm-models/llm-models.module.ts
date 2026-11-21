/**
 * @file apps/api/src/modules/llm-models/llm-models.module.ts
 * @description NestJS module configuring LLM model database registry.
 * @author yuva.devlab@gmail.com
 */

import { Module } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { LlmModelsController } from "./llm-models.controller";
import { LlmModelsService } from "./llm-models.service";

@Module({
  imports: [InfrastructureModule],
  controllers: [LlmModelsController],
  providers: [LlmModelsService],
  exports: [LlmModelsService],
})
export class LlmModelsModule {}
