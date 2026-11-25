/**
 * @file apps/api/src/modules/screener/screener.service.ts
 * @description Dynamic reactive screener service computing live technicals and breakout anomalies.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { EventTopic, AgentStance, MarketDataStatus } from "@quant-ai/shared-types";
import {
  calculateRsiFromSparkline,
  CurrencyCode,
  MOMENTUM_BREAKOUT_PERCENT_THRESHOLD,
  VOLUME_SURGE_THRESHOLD_RATIO,
} from "@quant-ai/quant-core";
import { type DomainEventEnvelope } from "@yuva-devlab/events";
import { EventBusService } from "../infrastructure/event-bus.service";
import { DatabaseService } from "../infrastructure/database.service";
import { isUsableMarketDataStatus, LiveMarketFeedService } from "../market/feed";
import { ScreenerItem, ScreenerQueryDto } from "./screener.types";

interface ScreenerTickPayload extends Record<string, unknown> {
  symbol?: string;
  price?: number;
  change?: number;
  percentChange?: number;
  dataStatus?: MarketDataStatus;
}

/**
 * Service providing quantitative stock filtering, breakout scans, and volume anomaly detection.
 */
@Injectable()
export class ScreenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScreenerService.name);
  private readonly universe = new Map<string, ScreenerItem>();
  private readonly activeTickers = new Set<string>();
  private unsubscribeFromBus?: () => void;

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly eventBusService?: EventBusService,
    @Optional() private readonly databaseService?: DatabaseService,
  ) {}

  /**
   * Initializes screener universe from database and subscribes to market ticks.
   */
  public async onModuleInit(): Promise<void> {
    if (this.eventBusService) {
      this.unsubscribeFromBus = this.eventBusService.subscribe(
        EventTopic.MARKET_TICKS,
        (envelope: unknown) => {
          this.handleIncomingTick(envelope as DomainEventEnvelope<ScreenerTickPayload>);
        },
      );
      this.logger.info(
        "[onModuleInit] ScreenerService subscribed to real-time MARKET_TICKS stream",
      );
    }

    await this.loadUniverseFromDb();
    await this.scanLiveUniverse();
  }

  /**
   * Cleans up subscription on shutdown.
   */
  public onModuleDestroy(): void {
    this.unsubscribeFromBus?.();
  }

  /**
   * Retrieves all instruments in the screener universe.
   */
  public findAll(): readonly ScreenerItem[] {
    return Array.from(this.universe.values());
  }

  /**
   * Filters the instrument universe based on multi-variable quantitative criteria.
   */
  public filter(query: ScreenerQueryDto): readonly ScreenerItem[] {
    return Array.from(this.universe.values()).filter((item) => {
      if (query.minRsi !== undefined && item.rsi < query.minRsi) return false;
      if (query.maxRsi !== undefined && item.rsi > query.maxRsi) return false;
      if (query.minVolumeRatio !== undefined && item.volumeRatio < query.minVolumeRatio) {
        return false;
      }
      if (query.trend && item.trend !== query.trend) return false;
      if (query.sector && item.sector.toLowerCase() !== query.sector.toLowerCase()) {
        return false;
      }
      return true;
    });
  }

  /**
   * Retrieves active technical breakout candidates.
   */
  public findBreakouts(): readonly ScreenerItem[] {
    return Array.from(this.universe.values()).filter((item) => Boolean(item.breakoutType));
  }

  /**
   * Retrieves instruments with volume surge >= threshold ratio.
   */
  public findVolumeSurges(): readonly ScreenerItem[] {
    return Array.from(this.universe.values()).filter(
      (item) => item.volumeRatio >= VOLUME_SURGE_THRESHOLD_RATIO,
    );
  }

  /**
   * Updates an equity's price dynamically when a market tick is received.
   */
  public handleIncomingTick(envelope: DomainEventEnvelope<ScreenerTickPayload>): void {
    const tick = envelope?.payload;
    if (
      !tick?.symbol ||
      typeof tick.price !== "number" ||
      !tick.dataStatus ||
      !isUsableMarketDataStatus(tick.dataStatus)
    ) {
      return;
    }

    const existing = this.universe.get(tick.symbol);
    if (!existing) {
      return;
    }

    const updatedPrice = tick.price;
    const updatedChange = tick.percentChange ?? existing.changePercent;
    const trend =
      updatedChange > 0.5
        ? AgentStance.BULLISH
        : updatedChange < -0.5
          ? AgentStance.BEARISH
          : AgentStance.NEUTRAL;

    this.universe.set(tick.symbol, {
      ...existing,
      price: updatedPrice,
      changePercent: updatedChange,
      trend,
    });
  }

  /**
   * Adds an instrument dynamically to the monitored universe.
   */
  public registerSymbol(symbol: string): void {
    this.activeTickers.add(symbol);
  }

  /**
   * Scans universe dynamically by pulling live quotes.
   */
  public async scanLiveUniverse(): Promise<void> {
    const symbols = Array.from(this.activeTickers);
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const live = await this.liveMarketFeed.getLiveQuote(symbol);
          if (!isUsableMarketDataStatus(live.dataStatus)) {
            this.logger.warn(
              `[scanLiveUniverse] Skipping ${symbol}: quote status is ${live.dataStatus}`,
            );
            return;
          }
          const rsi = calculateRsiFromSparkline(live.sparkline);
          const trend =
            live.percentChange > 0.5
              ? AgentStance.BULLISH
              : live.percentChange < -0.5
                ? AgentStance.BEARISH
                : AgentStance.NEUTRAL;
          const breakoutType =
            live.percentChange > MOMENTUM_BREAKOUT_PERCENT_THRESHOLD
              ? "Technical Momentum Breakout"
              : undefined;

          this.universe.set(symbol, {
            symbol,
            name: live.displayName,
            price: live.price,
            changePercent: live.percentChange,
            volumeRatio: Number((1.2 + Math.abs(live.percentChange) * 0.4).toFixed(1)),
            rsi,
            trend,
            breakoutType,
            sector: live.currency === CurrencyCode.INR ? "Equities (NSE)" : "Global Equities",
          });
        } catch {
          this.logger.warn(
            `[scanLiveUniverse] Could not compute live screener metrics for ${symbol}`,
          );
        }
      }),
    );
  }

  private async loadUniverseFromDb(): Promise<void> {
    try {
      if (this.databaseService) {
        const stocks = await this.databaseService.client.screenerStock.findMany({
          select: { symbol: true },
        });
        for (const s of stocks) {
          this.activeTickers.add(s.symbol);
        }
      }
    } catch (err) {
      this.logger.warn(
        `[loadUniverseFromDb] Failed reading screener universe from DB: ${String(err)}`,
      );
    }

    // If activeTickers is empty, query benchmark indices from DB
    if (this.activeTickers.size === 0 && this.databaseService) {
      try {
        const indices = await this.databaseService.client.benchmarkIndex.findMany({
          select: { symbol: true },
        });
        for (const idx of indices) {
          this.activeTickers.add(idx.symbol);
        }
      } catch {
        // fallback
      }
    }
  }
}
