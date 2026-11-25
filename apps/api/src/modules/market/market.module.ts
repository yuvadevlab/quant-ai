/**
 * @fileoverview Module responsible for market benchmarks and high-frequency streams.
 * @author yuva.devlab@gmail.com
 */

import { Module } from "@nestjs/common";
import {
  GoogleFinanceHttpClient,
  LiveMarketFeedService,
  StochasticMarketSimulator,
  YahooFinanceHttpClient,
} from "./feed";
import { MarketController } from "./market.controller";
import { MarketService } from "./market.service";
import { MarketTickService } from "./market-tick.service";

/**
 * Module responsible for market benchmarks, universal live feeds, and high-frequency streams.
 */
@Module({
  controllers: [MarketController],
  providers: [
    MarketService,
    MarketTickService,
    GoogleFinanceHttpClient,
    LiveMarketFeedService,
    StochasticMarketSimulator,
    YahooFinanceHttpClient,
  ],
  exports: [
    MarketService,
    MarketTickService,
    GoogleFinanceHttpClient,
    LiveMarketFeedService,
    StochasticMarketSimulator,
    YahooFinanceHttpClient,
  ],
})
export class MarketModule {}
