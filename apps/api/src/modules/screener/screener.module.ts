/**
 * @file apps/api/src/modules/screener/screener.module.ts
 * @description Module responsible for quantitative stock screening and anomaly scans.
 * @author yuva.devlab@gmail.com
 */

import { Module } from "@nestjs/common";
import { MarketModule } from "../market/market.module";
import { ScreenerController } from "./screener.controller";
import { ScreenerService } from "./screener.service";

/**
 * Module responsible for quantitative stock screening and anomaly scans.
 */
@Module({
  imports: [MarketModule],
  controllers: [ScreenerController],
  providers: [ScreenerService],
  exports: [ScreenerService],
})
export class ScreenerModule {}
