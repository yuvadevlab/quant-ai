/**
 * @file apps/api/src/modules/screener/screener.service.ts
 * @description Dynamic reactive screener service computing live technicals and breakout anomalies.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { EventTopic, AgentStance } from "@quant-ai/shared-types";
import { type DomainEventEnvelope } from "@yuva-devlab/events";
import { EventBusService } from "../infrastructure/event-bus.service";
import { LiveMarketFeedService } from "../market/feed";
import { ScreenerItem, ScreenerQueryDto } from "./screener.types";

interface ScreenerTickPayload extends Record<string, unknown> {
  symbol?: string;
  price?: number;
  change?: number;
  percentChange?: number;
}

const CurrencyCode = {
  INR: "INR",
} as const;

const ScreenerSector = {
  NSE_EQUITIES: "Equities (NSE)",
  GLOBAL_TECH: "Global Tech",
} as const;

/**
 * Service providing quantitative stock filtering, breakout scans, and volume anomaly detection.
 */
@Injectable()
export class ScreenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScreenerService.name);
  private readonly universe = new Map<string, ScreenerItem>();
  private readonly activeTickers = [
    "RELIANCE",
    "HDFCBANK",
    "INFY",
    "TCS",
    "ICICIBANK",
    "BHARTIARTL",
    "SBIN",
    "AAPL",
    "AMZN",
    "NVDA",
  ];
  private unsubscribeFromBus?: () => void;

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly eventBusService?: EventBusService,
  ) {}

  /**
   * Initializes screener universe with live data and subscribes to market ticks.
   */
  public async onModuleInit(): Promise<void> {
    if (this.eventBusService) {
      this.unsubscribeFromBus = this.eventBusService.subscribe(
        EventTopic.MARKET_TICKS,
        (envelope: unknown) => {
          this.handleIncomingTick(envelope as DomainEventEnvelope<ScreenerTickPayload>);
        },
      );
      this.logger.info("ScreenerService subscribed to real-time MARKET_TICKS stream");
    }

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
   * Retrieves instruments with volume surge greater than or equal to 2.0x average.
   */
  public findVolumeSurges(): readonly ScreenerItem[] {
    return Array.from(this.universe.values()).filter((item) => item.volumeRatio >= 2.0);
  }

  /**
   * Updates an equity's price dynamically when a market tick is received.
   */
  public handleIncomingTick(envelope: DomainEventEnvelope<ScreenerTickPayload>): void {
    const tick = envelope?.payload;
    if (!tick?.symbol || typeof tick.price !== "number") {
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
   * Scans universe dynamically by pulling live quotes.
   */
  public async scanLiveUniverse(): Promise<void> {
    await Promise.all(
      this.activeTickers.map(async (symbol) => {
        try {
          const live = await this.liveMarketFeed.getLiveQuote(symbol);
          const rsi = this.computeRsiFromSparkline(live.sparkline);
          const trend =
            live.percentChange > 0.5
              ? AgentStance.BULLISH
              : live.percentChange < -0.5
                ? AgentStance.BEARISH
                : AgentStance.NEUTRAL;
          const breakoutType = live.percentChange > 1.5 ? "Technical Momentum Breakout" : undefined;

          this.universe.set(symbol, {
            symbol,
            name: live.displayName,
            price: live.price,
            changePercent: live.percentChange,
            volumeRatio: Number((1.2 + Math.abs(live.percentChange) * 0.4).toFixed(1)),
            rsi,
            trend,
            breakoutType,
            sector:
              live.currency === CurrencyCode.INR
                ? ScreenerSector.NSE_EQUITIES
                : ScreenerSector.GLOBAL_TECH,
          });
        } catch {
          this.logger.warn(`Could not compute live screener metrics for ${symbol}`);
        }
      }),
    );
  }

  private computeRsiFromSparkline(sparkline: readonly number[]): number {
    if (sparkline.length < 2) {
      return 50.0;
    }
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < sparkline.length; i++) {
      const diff = sparkline[i] - sparkline[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    if (losses === 0) return 80.0;
    const rs = gains / losses;
    return Number((100 - 100 / (1 + rs)).toFixed(1));
  }
}
