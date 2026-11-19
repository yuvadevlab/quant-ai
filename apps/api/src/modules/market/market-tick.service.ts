/**
 * @fileoverview High-frequency market tick streaming and caching service.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { CachePrefix, EventTopic, MarketIndex } from "@quant-ai/shared-types";
import { createMarketTickEnvelope } from "@quant-ai/events";
import { ConfigService } from "../infrastructure/config.service";
import { EventBusService } from "../infrastructure/event-bus.service";
import { RedisService } from "../infrastructure/redis.service";
import { RealtimeService } from "../realtime/realtime.service";
import type { RealtimeTickPayload } from "../realtime/realtime.types";

const INITIAL_INDEX_PRICES: Readonly<Record<string, number>> = {
  [MarketIndex.NIFTY_50]: 24350.25,
  [MarketIndex.BANKNIFTY]: 52180.4,
  [MarketIndex.NIFTY_IT]: 41890.3,

  [MarketIndex.NIFTY_NEXT_50]: 71200.8,
  [MarketIndex.NIFTY_MIDCAP_100]: 58450.6,
  [MarketIndex.INDIA_VIX]: 13.85,
  RELIANCE: 2992.5,
  TCS: 4210.0,
  HDFCBANK: 1680.5,
};

/**
 * Service managing real-time tick ingestion, Redis low-latency caching, and WebSocket push.
 */
@Injectable()
export class MarketTickService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MarketTickService.name);
  private timer: NodeJS.Timeout | null = null;
  private readonly livePrices = new Map<string, number>();

  public constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly eventBusService: EventBusService,
    private readonly realtimeService: RealtimeService,
  ) {
    for (const [symbol, price] of Object.entries(INITIAL_INDEX_PRICES)) {
      this.livePrices.set(symbol, price);
    }
  }

  /**
   * Starts background tick simulation loop.
   */
  public onModuleInit(): void {
    if (this.configService.nodeEnv === "test") {
      return;
    }

    this.logger.log("Market tick streamer started (cadence: 1000ms)");
    this.timer = setInterval(() => {
      void this.broadcastNextTickBatch();
    }, 1000);
  }

  /**
   * Cleans up background timer on shutdown.
   */
  public onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Generates and dispatches a single market tick for an instrument.
   *
   * @param symbol Market index or equity symbol
   * @returns Emitted RealtimeTickPayload
   */
  public async generateAndPublishTick(symbol: string): Promise<RealtimeTickPayload> {
    const currentPrice = this.livePrices.get(symbol) ?? INITIAL_INDEX_PRICES[symbol] ?? 10000;
    const basePrice = INITIAL_INDEX_PRICES[symbol] ?? currentPrice;

    // Stochastic delta (-0.08% to +0.08%)
    const pctDelta = (Math.random() - 0.495) * 0.0016;
    const nextPrice = Number((currentPrice * (1 + pctDelta)).toFixed(2));
    this.livePrices.set(symbol, nextPrice);

    const change = Number((nextPrice - basePrice).toFixed(2));
    const percentChange = Number(((change / basePrice) * 100).toFixed(2));

    const payload: RealtimeTickPayload = {
      symbol,
      price: nextPrice,
      change,
      percentChange,
      timestamp: new Date().toISOString(),
    };

    // Cache in Redis (10-minute TTL)
    await this.redisService.set(`${CachePrefix.TICKER}${symbol}`, payload, 600);

    // Publish canonical envelope to ecosystem event bus
    const envelope = createMarketTickEnvelope({
      symbol: (MarketIndex as Record<string, MarketIndex>)[symbol] ?? MarketIndex.NIFTY_50,
      name: symbol,
      price: nextPrice,
      change,
      percentChange,
      high: Number((nextPrice * 1.004).toFixed(2)),
      low: Number((nextPrice * 0.996).toFixed(2)),
      volume: 100000,
      timestamp: payload.timestamp,
    });
    await this.eventBusService.publish(EventTopic.MARKET_TICKS, envelope);

    // Push via WebSocket
    this.realtimeService.emitTick(payload);

    return payload;
  }

  /**
   * Broadcasts ticks across all tracked benchmarks.
   */
  private async broadcastNextTickBatch(): Promise<void> {
    const symbols = Object.keys(INITIAL_INDEX_PRICES);
    // Pick 3 random symbols to tick each second for realistic live flow
    const shuffled = symbols.sort(() => 0.5 - Math.random()).slice(0, 3);
    for (const symbol of shuffled) {
      await this.generateAndPublishTick(symbol);
    }
  }
}
