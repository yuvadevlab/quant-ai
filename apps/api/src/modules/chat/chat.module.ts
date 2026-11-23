/**
 * @file apps/api/src/modules/chat/chat.module.ts
 * @description NestJS module for AI Quant Copilot services and endpoints.
 * @author yuva.devlab@gmail.com
 */

import { Module } from "@nestjs/common";
import { MarketModule } from "../market/market.module";
import { QuantAnalysisModule } from "../quant-analysis/quant-analysis.module";
import { PredictionsModule } from "../predictions/predictions.module";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

/**
 * Module providing interactive AI Copilot and quantitative synthesis.
 */
@Module({
  imports: [MarketModule, QuantAnalysisModule, PredictionsModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
