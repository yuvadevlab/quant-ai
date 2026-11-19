/**
 * @fileoverview Module responsible for market benchmarks and high-frequency streams.
 * @author yuva.devlab@gmail.com
 */

import { Module } from "@nestjs/common";
import { MarketController } from "./market.controller";
import { MarketService } from "./market.service";
import { MarketTickService } from "./market-tick.service";

/**
 * Module responsible for market benchmarks and high-frequency streams.
 */
@Module({
  controllers: [MarketController],
  providers: [MarketService, MarketTickService],
  exports: [MarketService, MarketTickService],
})
export class MarketModule {}
