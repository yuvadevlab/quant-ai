/**
 * @fileoverview High-frequency market tick streaming and caching service.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { CachePrefix, EventTopic, NodeEnvironment } from "@quant-ai/shared-types";
import { createMarketTickEnvelope } from "@quant-ai/events";
import { ConfigService } from "../infrastructure/config.service";
import { EventBusService } from "../infrastructure/event-bus.service";
import { RedisService } from "../infrastructure/redis.service";
import { RealtimeService } from "../realtime/realtime.service";
import type { RealtimeTickPayload } from "../realtime/realtime.types";
import { LiveMarketFeedService } from "./feed";

/**
 * Service managing real-time tick ingestion, Redis low-latency caching, and WebSocket push.
 */
@Injectable()
export class MarketTickService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MarketTickService.name);
  private timer: NodeJS.Timeout | null = null;
  private readonly livePrices = new Map<string, number>();
  private readonly trackedSymbols = new Set<string>([
    "NIFTY 50",
    "BANKNIFTY",
    "NIFTY IT",
    "INDIA VIX",
    "RELIANCE",
    "HDFCBANK",
  ]);

  public constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly eventBusService: EventBusService,
    private readonly realtimeService: RealtimeService,
    private readonly liveMarketFeed: LiveMarketFeedService,
  ) {}

  /**
   * Starts background tick loop.
   */
  public onModuleInit(): void {
    if (this.configService.nodeEnv === NodeEnvironment.TEST) {
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
   * Registers a new instrument to stream in real-time.
   */
  public trackSymbol(symbol: string): void {
    this.trackedSymbols.add(symbol);
  }

  /**
   * Generates and dispatches a single market tick for any instrument dynamically.
   *
   * @param symbol Market index, option, crypto, or equity symbol.
   * @returns Emitted RealtimeTickPayload.
   */
  public async generateAndPublishTick(symbol: string): Promise<RealtimeTickPayload> {
    const live = await this.liveMarketFeed.getLiveQuote(symbol);

    const payload: RealtimeTickPayload = {
      symbol,
      price: live.price,
      change: live.change,
      percentChange: live.percentChange,
      timestamp: new Date().toISOString(),
    };

    this.livePrices.set(symbol, live.price);

    // Cache in Redis with 10s TTL
    await this.redisService.set(`${CachePrefix.TICKER}${symbol}`, payload, 10);

    // Publish to internal event bus
    const envelope = createMarketTickEnvelope({
      symbol,
      name: live.displayName,
      price: live.price,
      change: live.change,
      percentChange: live.percentChange,
      high: live.dayHigh,
      low: live.dayLow,
      volume: live.volume,
      timestamp: payload.timestamp,
    });
    this.eventBusService.publish(EventTopic.MARKET_TICKS, envelope);

    // Broadcast over WebSocket
    this.realtimeService.emitTick(payload);

    return payload;
  }

  /**
   * Broadcasts ticks across all active tracked instruments.
   */
  private async broadcastNextTickBatch(): Promise<void> {
    const symbols = Array.from(this.trackedSymbols);
    for (const symbol of symbols) {
      try {
        await this.generateAndPublishTick(symbol);
      } catch (error) {
        this.logger.error(`Tick emission failed for ${symbol}`, error);
      }
    }
  }
}
