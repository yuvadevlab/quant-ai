/**
 * @file apps/api/src/modules/market/market.service.ts
 * @description Dynamic reactive market service maintaining real-time benchmark states via live feed.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import {
  CachePrefix,
  EventTopic,
  IndexCategory,
  IndexQuote,
  MARKET_INDEX_REGISTRY,
} from "@quant-ai/shared-types";
import { type DomainEventEnvelope } from "@yuva-devlab/events";
import { EventBusService } from "../infrastructure/event-bus.service";
import { RedisService } from "../infrastructure/redis.service";
import { LiveMarketFeedService } from "./feed";

interface MarketTickPayload extends Record<string, unknown> {
  symbol?: string;
  name?: string;
  price?: number;
  change?: number;
  percentChange?: number;
}

/**
 * Service managing live, dynamic, and cached market benchmark data feeds across categories.
 */
@Injectable()
export class MarketService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MarketService.name);
  private readonly liveIndices = new Map<string, IndexQuote>();
  private unsubscribeFromBus?: () => void;

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly eventBusService?: EventBusService,
    @Optional() private readonly redisService?: RedisService,
  ) {
    // Initialize base index structure from registry metadata without hardcoded static prices
    for (const [symbol, meta] of Object.entries(MARKET_INDEX_REGISTRY)) {
      this.liveIndices.set(symbol, {
        symbol,
        category: meta.category,
        price: 0,
        change: 0,
        changePercent: 0,
        sparkline: [],
      });
    }
  }

  /**
   * Subscribes to real-time events and hydrates live benchmark quotes.
   */
  public async onModuleInit(): Promise<void> {
    if (this.eventBusService) {
      this.unsubscribeFromBus = this.eventBusService.subscribe(
        EventTopic.MARKET_TICKS,
        (envelope: unknown) => {
          this.handleIncomingTick(envelope as DomainEventEnvelope<MarketTickPayload>);
        },
      );
      this.logger.info("MarketService subscribed to real-time MARKET_TICKS stream");
    }

    // Hydrate initial live quotes dynamically from feed
    await this.hydrateLiveIndices();
  }

  /**
   * Unsubscribes on shutdown.
   */
  public onModuleDestroy(): void {
    this.unsubscribeFromBus?.();
  }

  /**
   * Retrieves all benchmark index snapshots.
   */
  public getBenchmarkIndices(): readonly IndexQuote[] {
    return Array.from(this.liveIndices.values());
  }

  /**
   * Retrieves market indices optionally filtered by category.
   *
   * @param category Optional index category filter.
   * @returns Array of IndexQuote records.
   */
  public getIndicesByCategory(category?: IndexCategory): readonly IndexQuote[] {
    const all = Array.from(this.liveIndices.values());
    if (!category) {
      return all;
    }
    return all.filter((item) => item.category === category);
  }

  /**
   * Retrieves a single benchmark index by symbol.
   *
   * @param symbol Target symbol
   * @returns Latest IndexQuote if found
   */
  public getIndexQuote(symbol: string): IndexQuote | undefined {
    return this.liveIndices.get(symbol);
  }

  /**
   * Updates state dynamically when a market tick is received.
   */
  public handleIncomingTick(envelope: DomainEventEnvelope<MarketTickPayload>): void {
    const tick = envelope?.payload;
    if (!tick?.symbol || typeof tick.price !== "number") {
      return;
    }

    const existing = this.liveIndices.get(tick.symbol);
    if (!existing) {
      return;
    }

    const rollingSparkline = [...existing.sparkline, tick.price].slice(-20);

    const updated: IndexQuote = {
      ...existing,
      price: tick.price,
      change: tick.change ?? existing.change,
      changePercent: tick.percentChange ?? existing.changePercent,
      sparkline: rollingSparkline,
    };

    this.liveIndices.set(tick.symbol, updated);
    void this.redisService?.set(`${CachePrefix.TICKER}${tick.symbol}`, updated, 600);
  }

  private async hydrateLiveIndices(): Promise<void> {
    const symbols = Array.from(this.liveIndices.keys());
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const live = await this.liveMarketFeed.getLiveQuote(symbol);
          const existing = this.liveIndices.get(symbol);
          if (existing) {
            this.liveIndices.set(symbol, {
              ...existing,
              price: live.price,
              change: live.change,
              changePercent: live.percentChange,
              sparkline: live.sparkline.length > 0 ? live.sparkline : [live.price],
            });
          }
        } catch {
          this.logger.warn(`Could not hydrate live quote for ${symbol}`);
        }
      }),
    );
  }
}
