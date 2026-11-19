/**
 * @file apps/api/src/modules/predictions/predictions.module.ts
 * @description Module responsible for Prediction Lab ledger operations and performance scoring.
 * @author yuva.devlab@gmail.com
 */

import { Module } from "@nestjs/common";
import { MarketModule } from "../market/market.module";
import { PredictionsController } from "./predictions.controller";
import { PredictionsService } from "./predictions.service";

/**
 * Module responsible for Prediction Lab ledger operations and performance scoring.
 */
@Module({
  imports: [MarketModule],
  controllers: [PredictionsController],
  providers: [PredictionsService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
