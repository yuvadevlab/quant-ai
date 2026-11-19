import { describe, expect, it } from "vitest";
import {
  CachePrefix,
  Candle,
  EventTopic,
  HealthStatus,
  IndexCategory,
  MarketIndex,
  NetworkPort,
  RealtimeRoom,
  RealtimeSubscriptionStatus,
  SignalRegime,
} from "@quant-ai/shared-types";
import { MarketService } from "../src/modules/market/market.service";
import { PredictionsService } from "../src/modules/predictions/predictions.service";
import { MarketRegimeService } from "../src/modules/quant-analysis/market-regime.service";
import { MultiAgentDeliberationService } from "../src/modules/quant-analysis/multi-agent-deliberation.service";
import { TechnicalAnalysisService } from "../src/modules/quant-analysis/technical-analysis.service";
import { ScreenerService } from "../src/modules/screener/screener.service";
import { ConfigService } from "../src/modules/infrastructure/config.service";
import { RedisService } from "../src/modules/infrastructure/redis.service";
import { EventBusService } from "../src/modules/infrastructure/event-bus.service";
import { DatabaseService } from "../src/modules/infrastructure/database.service";
import { HealthController } from "../src/modules/health/health.controller";
import { RealtimeGateway } from "../src/modules/realtime/realtime.gateway";
import { RealtimeService } from "../src/modules/realtime/realtime.service";
import { MarketTickService } from "../src/modules/market/market-tick.service";

describe("NestJS Domain Services", () => {
  it("MarketService provides benchmark indices with sparklines and category filtering", () => {
    const service = new MarketService();
    const indices = service.getBenchmarkIndices();
    expect(indices.length).toBeGreaterThanOrEqual(15);
    expect(indices.some((i) => i.symbol === MarketIndex.NIFTY_NEXT_50)).toBe(true);
    expect(indices.some((i) => i.symbol === MarketIndex.NIFTY_MIDCAP_100)).toBe(true);
    expect(indices.some((i) => i.symbol === MarketIndex.NIFTY_IT)).toBe(true);

    const sectoral = service.getIndicesByCategory(IndexCategory.SECTORAL);
    expect(sectoral.length).toBeGreaterThanOrEqual(5);
    expect(sectoral.every((s) => s.category === IndexCategory.SECTORAL)).toBe(true);
  });

  it("PredictionsService returns active prediction PRED-8942 and trajectory cone", () => {
    const service = new PredictionsService();
    const prediction = service.findById("PRED-8942");
    expect(prediction.ticker).toBe("RELIANCE");
    expect(prediction.entry).toBe(2985);

    const trajectory = service.getTrajectory("PRED-8942");
    expect(trajectory.length).toBeGreaterThan(0);
    expect(trajectory[0]!.expected).toBe(2985);
  });

  it("ScreenerService filters volume surges and breakout candidates", () => {
    const service = new ScreenerService();
    const breakouts = service.findBreakouts();
    expect(breakouts.length).toBeGreaterThanOrEqual(2);
    expect(breakouts.some((b) => b.symbol === "RELIANCE")).toBe(true);

    const surges = service.findVolumeSurges();
    expect(surges.length).toBeGreaterThanOrEqual(2);
    expect(surges.every((s) => s.volumeRatio >= 2.0)).toBe(true);
  });

  it("TechnicalAnalysisService computes complete technical matrix over candle series", () => {
    const service = new TechnicalAnalysisService();
    const candles: Candle[] = Array.from({ length: 30 }, (_, i) => ({
      timestamp: 1700000000000 + i * 86400000,
      open: 100 + i,
      high: 105 + i,
      low: 98 + i,
      close: 102 + i,
      volume: 10000 + i * 500,
    }));

    const matrix = service.computeMatrix(candles);
    expect(matrix.latestClose).toBe(131);
    expect(matrix.rsi).toBeGreaterThan(0);
    expect(matrix.atr).toBeGreaterThan(0);
    expect(matrix.ema9).toBeGreaterThan(100);
    expect(matrix.bollingerBandwidth).toBeGreaterThanOrEqual(0);
  });

  it("MarketRegimeService deterministically classifies market conditions", () => {
    const service = new MarketRegimeService();
    const result = service.classify({
      currentPrice: 105,
      emaFast: 100,
      emaSlow: 95,
      adx: 32,
      rsi: 65,
      atrRatio: 1.0,
      isSqueezing: false,
    });
    expect(result.regime).toBe(SignalRegime.BULLISH_EXPANSION);
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("MultiAgentDeliberationService evaluates trade expectancy and consensus veto", () => {
    const service = new MultiAgentDeliberationService();
    const expectancy = service.evaluateExpectancy({
      entryPrice: 100,
      targetPrice: 130,
      stopLossPrice: 90,
      winProbability: 0.6,
    });
    expect(expectancy.isApproved).toBe(true);
    expect(expectancy.riskRewardRatio).toBe(3.0);
    expect(expectancy.mathematicalExpectancy).toBeGreaterThan(0);

    const debate = service.generateBreakoutDebate("RELIANCE", 64, 3.0);
    expect(debate).toHaveLength(3);
    const consensus = service.synthesizeConsensus(debate);
    expect(consensus.isVetoedBySkeptic).toBe(false);
  });

  it("Infrastructure services validate environment, cache, and event bus", async () => {
    const config = new ConfigService();
    expect(config.port).toBe(NetworkPort.API);
    expect(config.wsPort).toBe(NetworkPort.WS);

    const db = new DatabaseService(config);
    db.onModuleInit();
    const health = await db.ping();
    expect(health.status).toBe(HealthStatus.UP);

    const redis = new RedisService(config);
    const testKey = `${CachePrefix.TICKER}RELIANCE`;
    const testPrice = 2985.5;
    await redis.set(testKey, testPrice, 60);
    expect(await redis.get(testKey)).toBe(testPrice);
    await redis.delete(testKey);
    expect(await redis.get(testKey)).toBeNull();

    const bus = new EventBusService(config);
    let receivedPayload = "";
    const unsub = bus.subscribe<string>(EventTopic.MARKET_TICKS, (data) => {
      receivedPayload = data;
    });
    const samplePayload = "NIFTY_SURGE";
    await bus.publish(EventTopic.MARKET_TICKS, samplePayload);
    expect(receivedPayload).toBe(samplePayload);
    unsub();

    const healthCtrl = new HealthController(config, db);
    const status = await healthCtrl.check();
    expect(status.status).toBe(HealthStatus.HEALTHY);
    expect(status.infrastructure.database.status).toBe(HealthStatus.UP);
  });

  it("RealtimeGateway manages subscriptions and broadcasts safely", () => {
    const gateway = new RealtimeGateway();
    const fakeSocket = {
      id: "sock-123",
      join: (room: string) => room,
      leave: (room: string) => room,
      emit: () => {},
    } as unknown as Parameters<RealtimeGateway["handleConnection"]>[0];

    const subRes = gateway.handleSubscribe(fakeSocket, {
      room: RealtimeRoom.TICKERS,
    });
    expect(subRes.status).toBe(RealtimeSubscriptionStatus.SUBSCRIBED);

    const unsubRes = gateway.handleUnsubscribe(fakeSocket, {
      room: RealtimeRoom.TICKERS,
    });
    expect(unsubRes.status).toBe(RealtimeSubscriptionStatus.UNSUBSCRIBED);
  });

  it("MarketTickService generates, caches in Redis, and publishes ticks", async () => {
    const config = new ConfigService();
    const redis = new RedisService(config);
    const bus = new EventBusService(config);
    const gateway = new RealtimeGateway();
    const realtimeService = new RealtimeService(gateway);

    const tickService = new MarketTickService(config, redis, bus, realtimeService);

    let receivedTickSymbol = "";
    const unsub = bus.subscribe<{ payload: { symbol: string } }>(
      EventTopic.MARKET_TICKS,
      (event) => {
        receivedTickSymbol = event.payload.symbol;
      },
    );

    const tick = await tickService.generateAndPublishTick(MarketIndex.NIFTY_50);
    expect(tick.symbol).toBe(MarketIndex.NIFTY_50);
    expect(tick.price).toBeGreaterThan(0);
    expect(receivedTickSymbol).toBe(MarketIndex.NIFTY_50);

    const cachedTick = await redis.get<{ symbol: string; price: number }>(
      `${CachePrefix.TICKER}${MarketIndex.NIFTY_50}`,
    );
    expect(cachedTick?.symbol).toBe(MarketIndex.NIFTY_50);
    expect(cachedTick?.price).toBe(tick.price);
    unsub();
  });
});
