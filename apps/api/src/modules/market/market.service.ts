/**
 * @file apps/api/src/modules/market/market.service.ts
 * @description Dynamic reactive market service maintaining real-time benchmark states via live feed.
 * All thresholds, labels, and parameters are database-configurable without redeployments.
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
import { DatabaseService } from "../infrastructure/database.service";
import { EventBusService } from "../infrastructure/event-bus.service";
import { RedisService } from "../infrastructure/redis.service";
import { LiveMarketFeedService } from "./feed";
import {
  DEFAULT_BREADTH_CONFIG,
  DEFAULT_SECTOR_CONFIG,
  MarketBreadthConfig,
  SectorMomentumConfig,
  SystemConfigKey,
  calculateMarketBreadth,
  classifyMomentum,
} from "./market-config.types";

interface MarketTickPayload extends Record<string, unknown> {
  symbol?: string;
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
  private breadthConfig: MarketBreadthConfig = DEFAULT_BREADTH_CONFIG;
  private sectorConfig: SectorMomentumConfig = DEFAULT_SECTOR_CONFIG;
  private unsubscribeFromBus?: () => void;

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly eventBusService?: EventBusService,
    @Optional() private readonly redisService?: RedisService,
    @Optional() private readonly databaseService?: DatabaseService,
  ) {
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

  public async onModuleInit(): Promise<void> {
    if (this.eventBusService) {
      this.unsubscribeFromBus = this.eventBusService.subscribe(
        EventTopic.MARKET_TICKS,
        (envelope: unknown) => {
          this.handleIncomingTick(envelope as DomainEventEnvelope<MarketTickPayload>);
        },
      );
      this.logger.info("[onModuleInit] MarketService subscribed to real-time MARKET_TICKS stream");
    }

    await this.loadConfigurationsFromDb();
    await this.hydrateLiveIndices();
  }

  public onModuleDestroy(): void {
    this.unsubscribeFromBus?.();
  }

  public getBenchmarkIndices(): readonly IndexQuote[] {
    return Array.from(this.liveIndices.values());
  }

  public getIndicesByCategory(category?: IndexCategory): readonly IndexQuote[] {
    const all = Array.from(this.liveIndices.values());
    return category ? all.filter((item) => item.category === category) : all;
  }

  public getIndexQuote(symbol: string): IndexQuote | undefined {
    return this.liveIndices.get(symbol);
  }

  public getMarketBreadth() {
    const changes = Array.from(this.liveIndices.values()).map((idx) => idx.change);
    const vix = this.liveIndices.get("INDIA VIX")?.price ?? 0;
    return calculateMarketBreadth(changes, vix, this.breadthConfig);
  }

  public getSectorPerformance() {
    const sectoral = Array.from(this.liveIndices.values()).filter(
      (idx) => idx.category === IndexCategory.SECTORAL || idx.category === IndexCategory.FINANCIALS,
    );

    return sectoral.map((idx) => {
      const pct = idx.changePercent;
      const momentum = classifyMomentum(pct, this.sectorConfig);

      return {
        name: idx.symbol,
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
        positive: pct >= 0,
        momentum,
      };
    });
  }

  public getBreadthConfig(): MarketBreadthConfig {
    return this.breadthConfig;
  }

  public getSectorConfig(): SectorMomentumConfig {
    return this.sectorConfig;
  }

  public async updateBreadthConfig(
    partial: Partial<MarketBreadthConfig>,
  ): Promise<MarketBreadthConfig> {
    this.breadthConfig = { ...this.breadthConfig, ...partial };
    this.logger.info("[updateBreadthConfig] Updated market breadth runtime configuration");
    if (this.databaseService) {
      await this.databaseService.client.systemConfig.upsert({
        where: { key: SystemConfigKey.MARKET_BREADTH },
        update: { value: this.breadthConfig as object },
        create: {
          key: SystemConfigKey.MARKET_BREADTH,
          description: "Configurable market breadth and institutional flow parameters",
          value: this.breadthConfig as object,
        },
      });
    }
    return this.breadthConfig;
  }

  public async updateSectorConfig(
    partial: Partial<SectorMomentumConfig>,
  ): Promise<SectorMomentumConfig> {
    this.sectorConfig = { ...this.sectorConfig, ...partial };
    this.logger.info("[updateSectorConfig] Updated sector momentum runtime configuration");
    if (this.databaseService) {
      await this.databaseService.client.systemConfig.upsert({
        where: { key: SystemConfigKey.SECTOR_MOMENTUM },
        update: { value: this.sectorConfig as object },
        create: {
          key: SystemConfigKey.SECTOR_MOMENTUM,
          description: "Configurable sector momentum classification percentage thresholds",
          value: this.sectorConfig as object,
        },
      });
    }
    return this.sectorConfig;
  }

  public handleIncomingTick(envelope: DomainEventEnvelope<MarketTickPayload>): void {
    const tick = envelope?.payload;
    if (!tick?.symbol || typeof tick.price !== "number") return;

    const existing = this.liveIndices.get(tick.symbol);
    if (!existing) return;

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

  private async loadConfigurationsFromDb(): Promise<void> {
    if (!this.databaseService) return;
    try {
      const breadthRecord = await this.databaseService.client.systemConfig.findUnique({
        where: { key: SystemConfigKey.MARKET_BREADTH },
      });
      if (breadthRecord?.value && typeof breadthRecord.value === "object") {
        this.breadthConfig = { ...DEFAULT_BREADTH_CONFIG, ...(breadthRecord.value as object) };
      }

      const sectorRecord = await this.databaseService.client.systemConfig.findUnique({
        where: { key: SystemConfigKey.SECTOR_MOMENTUM },
      });
      if (sectorRecord?.value && typeof sectorRecord.value === "object") {
        this.sectorConfig = { ...DEFAULT_SECTOR_CONFIG, ...(sectorRecord.value as object) };
      }
      this.logger.info("[loadConfigurationsFromDb] Market configs loaded from database");
    } catch (error) {
      this.logger.warn(
        `[loadConfigurationsFromDb] Could not load market configs from database: ${String(error)}`,
      );
    }
  }

  private async hydrateLiveIndices(): Promise<void> {
    const symbols = Array.from(this.liveIndices.keys());
    for (const symbol of symbols) {
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
        this.logger.warn(`[hydrateLiveIndices] Could not hydrate live quote for ${symbol}`);
      }
    }
  }
}
