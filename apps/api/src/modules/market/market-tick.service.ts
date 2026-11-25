/**
 * @fileoverview High-frequency market tick streaming and caching service.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleDestroy, OnModuleInit, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { CachePrefix, EventTopic, NodeEnvironment } from "@quant-ai/shared-types";
import { createMarketTickEnvelope } from "@quant-ai/events";
import { ConfigService } from "../infrastructure/config.service";
import { DatabaseService } from "../infrastructure/database.service";
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
  private readonly trackedSymbols = new Set<string>();

  public constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly eventBusService: EventBusService,
    private readonly realtimeService: RealtimeService,
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly databaseService?: DatabaseService,
  ) {}

  /**
   * Starts background tick loop.
   */
  public async onModuleInit(): Promise<void> {
    await this.loadTrackedSymbolsFromDb();

    if (this.configService.nodeEnv === NodeEnvironment.TEST) {
      return;
    }

    this.logger.info("[onModuleInit] Market tick streamer started (cadence: 2000ms)");
    this.timer = setInterval(() => {
      void this.broadcastNextTickBatch();
    }, 2000);
  }

  private async loadTrackedSymbolsFromDb(): Promise<void> {
    if (!this.databaseService) return;
    try {
      const preds = await this.databaseService.client.prediction.findMany({
        where: { status: "ACTIVE" },
        select: { ticker: true },
        take: 50,
      });
      for (const p of preds) {
        this.trackedSymbols.add(p.ticker);
      }

      const indices = await this.databaseService.client.benchmarkIndex.findMany({
        select: { symbol: true },
        take: 20,
      });
      for (const idx of indices) {
        this.trackedSymbols.add(idx.symbol);
      }
    } catch {
      // Clean start if db table empty
    }
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
      timestamp: live.timestamp,
      dataSource: live.source,
      dataStatus: live.dataStatus,
      ...(live.observedAt ? { observedAt: live.observedAt } : {}),
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
      timestamp: live.timestamp,
      dataSource: live.source,
      dataStatus: live.dataStatus,
      ...(live.observedAt ? { observedAt: live.observedAt } : {}),
    });
    await this.eventBusService.publish(EventTopic.MARKET_TICKS, envelope);

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
        this.logger.debug(
          `[broadcastNextTickBatch] Skipping tick for ${symbol}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
}
