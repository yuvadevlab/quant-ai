import { describe, expect, it } from "vitest";
import {
  AiProviderType,
  CachePrefix,
  Candle,
  EventTopic,
  HealthStatus,
  IndexCategory,
  NetworkPort,
  RealtimeRoom,
  RealtimeSubscriptionStatus,
  SignalRegime,
} from "@quant-ai/shared-types";
import { LiveMarketFeedService, StochasticMarketSimulator } from "../src/modules/market/feed";
import { MarketService } from "../src/modules/market/market.service";
import { PredictionsService } from "../src/modules/predictions/predictions.service";
import { MarketRegimeService } from "../src/modules/quant-analysis/market-regime.service";
import { MultiAgentDeliberationService } from "../src/modules/quant-analysis/multi-agent-deliberation.service";
import { AiProviderFactory } from "../src/modules/quant-analysis/ai-provider.factory";
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
  const simulator = new StochasticMarketSimulator();
  const feed = new LiveMarketFeedService(simulator);

  it("MarketService provides benchmark indices with category filtering", async () => {
    const service = new MarketService(feed);
    await service.onModuleInit();
    const indices = service.getBenchmarkIndices();
    expect(indices.length).toBeGreaterThanOrEqual(15);
    expect(indices.some((i) => i.symbol === "NIFTY NEXT 50")).toBe(true);
    expect(indices.some((i) => i.symbol === "NIFTY MIDCAP 100")).toBe(true);
    expect(indices.some((i) => i.symbol === "NIFTY IT")).toBe(true);

    const sectoral = service.getIndicesByCategory(IndexCategory.SECTORAL);
    expect(sectoral.length).toBeGreaterThanOrEqual(5);
    expect(sectoral.every((s) => s.category === IndexCategory.SECTORAL)).toBe(true);
  });

  it("PredictionsService returns active prediction PRED-8942 and trajectory cone", async () => {
    const service = new PredictionsService(feed);
    await service.onModuleInit();
    const prediction = service.findById("PRED-8942");
    expect(prediction.ticker).toBe("RELIANCE");
    expect(prediction.entry).toBeGreaterThan(0);

    const trajectory = service.getTrajectory("PRED-8942");
    expect(trajectory.length).toBeGreaterThan(0);
    expect(trajectory[0]!.expected).toBe(prediction.entry);
  });

  it("ScreenerService filters volume surges and breakout candidates", async () => {
    const service = new ScreenerService(feed);
    await service.onModuleInit();
    const all = service.findAll();
    expect(all.length).toBeGreaterThanOrEqual(5);
    expect(all.some((b) => b.symbol === "RELIANCE")).toBe(true);
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

    const tickService = new MarketTickService(config, redis, bus, realtimeService, feed);

    let receivedTickSymbol = "";
    const unsub = bus.subscribe<{ payload: { symbol: string } }>(
      EventTopic.MARKET_TICKS,
      (event) => {
        receivedTickSymbol = event.payload.symbol;
      },
    );

    const tick = await tickService.generateAndPublishTick("NIFTY 50");
    expect(tick.symbol).toBe("NIFTY 50");
    expect(tick.price).toBeGreaterThan(0);
    expect(receivedTickSymbol).toBe("NIFTY 50");

    const cachedTick = await redis.get<{ symbol: string; price: number }>(
      `${CachePrefix.TICKER}NIFTY 50`,
    );
    expect(cachedTick?.symbol).toBe("NIFTY 50");
    expect(cachedTick?.price).toBe(tick.price);
    unsub();
  });

  it("conducts multi-agent adversarial deliberation and publishes domain envelope", async () => {
    const config = new ConfigService();
    const bus = new EventBusService(config);
    const gateway = new RealtimeGateway();
    const realtime = new RealtimeService(gateway);
    const factory = new AiProviderFactory(config);
    const deliberationService = new MultiAgentDeliberationService(factory, bus, realtime);

    let deliberationEventReceived = false;
    const unsub = bus.subscribe(EventTopic.DELIBERATION_COMPLETED, () => {
      deliberationEventReceived = true;
    });

    const outcome = await deliberationService.conductAdversarialDeliberation(
      {
        predictionId: "PRED-8942",
        ticker: "NIFTY 50",
        currentPrice: 24350,
        targetPrice: 24580,
        stopLossPrice: 24210,
        rsi: 62.4,
        atr: 110.5,
        regime: SignalRegime.BULLISH_EXPANSION,
      },
      AiProviderType.SIMULATED,
    );

    expect(outcome.predictionId).toBe("PRED-8942");
    expect(outcome.verdicts).toHaveLength(3);
    expect(outcome.compositeConfidence).toBeGreaterThan(50);
    expect(deliberationEventReceived).toBe(true);
    unsub();
  });
});
