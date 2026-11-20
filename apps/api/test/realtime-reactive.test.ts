/**
 * @file apps/api/test/realtime-reactive.test.ts
 * @description Integration tests for dynamic real-time market updates across multi-asset setups.
 * @author yuva.devlab@gmail.com
 */

import { describe, expect, it } from "vitest";
import {
  AssetClass,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeHorizon,
  TradeStrategy,
} from "@quant-ai/shared-types";
import { ConfigService } from "../src/modules/infrastructure/config.service";
import { EventBusService } from "../src/modules/infrastructure/event-bus.service";
import { RedisService } from "../src/modules/infrastructure/redis.service";
import { RealtimeGateway } from "../src/modules/realtime/realtime.gateway";
import { RealtimeService } from "../src/modules/realtime/realtime.service";
import { LiveMarketFeedService, YahooFinanceHttpClient } from "../src/modules/market/feed";
import { MarketTickService } from "../src/modules/market/market-tick.service";
import { MarketService } from "../src/modules/market/market.service";
import { ScreenerService } from "../src/modules/screener/screener.service";
import { PredictionsService } from "../src/modules/predictions/predictions.service";

describe("Real-time Reactive Market Hub", () => {
  it("dynamically updates indices, screener, and predictions on live market ticks", async () => {
    const config = new ConfigService();
    const redis = new RedisService(config);
    const bus = new EventBusService(config);
    const gateway = new RealtimeGateway();
    const realtime = new RealtimeService(gateway);
    const feed = new LiveMarketFeedService(new YahooFinanceHttpClient(), redis);

    const tickService = new MarketTickService(config, redis, bus, realtime, feed);
    const marketService = new MarketService(feed, bus, redis);
    const screenerService = new ScreenerService(feed, bus);
    const predictionsService = new PredictionsService(feed, bus, realtime);

    screenerService.registerSymbol("RELIANCE");
    predictionsService.registerSignal({
      id: "PRED-8942",
      ticker: "RELIANCE",
      name: "Reliance Industries",
      strategy: TradeStrategy.SWING,
      assetClass: AssetClass.EQUITY,
      direction: SignalDirection.LONG,
      entry: 2400.0,
      current: 2420.0,
      target: 2480.0,
      stopLoss: 2360.0,
      horizon: TradeHorizon.SWING_WEEKS,
      confidence: 88,
      status: SignalStatus.ACTIVE,
      regime: SignalRegime.BULLISH_EXPANSION,
      pnlPercent: 0.83,
      pnlAbsolute: 20.0,
      publishedAt: new Date().toISOString(),
      thesis: "Breakout",
      riskReward: 2.0,
      catalysts: [],
      invalidation: "Stop loss",
      trajectory: [],
      agents: [],
    });

    await marketService.onModuleInit();
    await screenerService.onModuleInit();
    await predictionsService.onModuleInit();

    // 1. Publish tick for NIFTY 50
    const niftyTick = await tickService.generateAndPublishTick("NIFTY 50");
    const niftyQuote = marketService.getIndexQuote("NIFTY 50");
    expect(niftyQuote?.price).toBe(niftyTick.price);
    expect(niftyQuote?.sparkline.slice(-1)[0]).toBe(niftyTick.price);

    // 2. Publish tick for RELIANCE (updates screener and prediction PRED-8942)
    const relianceTick = await tickService.generateAndPublishTick("RELIANCE");
    const screenedReliance = screenerService.findAll().find((s) => s.symbol === "RELIANCE");
    expect(screenedReliance?.price).toBe(relianceTick.price);

    const reliancePred = predictionsService.findById("PRED-8942");
    expect(reliancePred.current).toBe(relianceTick.price);
    expect(reliancePred.pnlPercent).toBeDefined();

    marketService.onModuleDestroy();
    screenerService.onModuleDestroy();
    predictionsService.onModuleDestroy();
  });
});
