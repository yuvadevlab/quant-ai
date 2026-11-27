/**
 * @file apps/api/src/modules/market/market.service.ts
 * @description Dynamic reactive market service maintaining real-time benchmark states via live feed.
 * All thresholds, labels, and parameters are database-configurable without redeployments.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import {
  CachePrefix,
  EventTopic,
  IndexCategory,
  IndexQuote,
  MarketDataStatus,
  MARKET_INDEX_REGISTRY,
} from "@quant-ai/shared-types";
import { type DomainEventEnvelope } from "@yuva-devlab/events";
import { DatabaseService } from "../infrastructure/database.service";
import { EventBusService } from "../infrastructure/event-bus.service";
import { RedisService } from "../infrastructure/redis.service";
import { LiveMarketFeedService } from "./feed";
import {
  loadMarketConfigs,
  saveMarketConfig,
  UNAVAILABLE_MARKET_BREADTH,
} from "./market-config.repository";
import {
  DEFAULT_BREADTH_CONFIG,
  DEFAULT_SECTOR_CONFIG,
  MarketBreadthConfig,
  SectorMomentumConfig,
  SystemConfigKey,
  classifyMomentum,
} from "./market-config.types";

const CORE_INDEX_SYMBOLS = ["NIFTY 50", "BANKNIFTY", "SENSEX", "INDIA VIX"] as const;
const BENCHMARK_REFRESH_INTERVAL_MS = 30_000;

interface MarketTickPayload extends Record<string, unknown> {
  symbol?: string;
  price?: number;
  change?: number;
  percentChange?: number;
  dataSource?: string;
  dataStatus?: MarketDataStatus;
  observedAt?: string;
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
  private lastBenchmarkRefreshAt = 0;
  private benchmarkRefresh?: Promise<void>;

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
        dataStatus: MarketDataStatus.UNAVAILABLE,
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
    await this.refreshBenchmarkIndices();
  }

  public onModuleDestroy(): void {
    this.unsubscribeFromBus?.();
  }

  public getBenchmarkIndices(): readonly IndexQuote[] {
    return CORE_INDEX_SYMBOLS.flatMap((symbol) => {
      const quote = this.liveIndices.get(symbol);
      return quote ? [quote] : [];
    });
  }

  public getIndicesByCategory(category?: IndexCategory): readonly IndexQuote[] {
    const all = this.getBenchmarkIndices();
    return category ? all.filter((item) => item.category === category) : all;
  }

  public async refreshBenchmarkIndices(): Promise<void> {
    if (this.benchmarkRefresh) return this.benchmarkRefresh;
    if (Date.now() - this.lastBenchmarkRefreshAt < BENCHMARK_REFRESH_INTERVAL_MS) return;

    this.benchmarkRefresh = this.hydrateCoreIndices();
    try {
      await this.benchmarkRefresh;
    } finally {
      this.lastBenchmarkRefreshAt = Date.now();
      this.benchmarkRefresh = undefined;
    }
  }

  public getIndexQuote(symbol: string): IndexQuote | undefined {
    return this.liveIndices.get(symbol);
  }

  public getMarketBreadth() {
    return UNAVAILABLE_MARKET_BREADTH;
  }

  public getSectorPerformance() {
    const sectoral = Array.from(this.liveIndices.values()).filter(
      (idx) =>
        (idx.category === IndexCategory.SECTORAL || idx.category === IndexCategory.FINANCIALS) &&
        (idx.dataStatus === MarketDataStatus.VERIFIED ||
          idx.dataStatus === MarketDataStatus.PROVIDER_UNVERIFIED ||
          idx.dataStatus === MarketDataStatus.MARKET_CLOSED),
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
    await saveMarketConfig(
      this.databaseService,
      SystemConfigKey.MARKET_BREADTH,
      "Configurable market breadth and institutional flow parameters",
      this.breadthConfig,
    );
    return this.breadthConfig;
  }

  public async updateSectorConfig(
    partial: Partial<SectorMomentumConfig>,
  ): Promise<SectorMomentumConfig> {
    this.sectorConfig = { ...this.sectorConfig, ...partial };
    await saveMarketConfig(
      this.databaseService,
      SystemConfigKey.SECTOR_MOMENTUM,
      "Configurable sector momentum thresholds",
      this.sectorConfig,
    );
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
      ...(tick.dataSource ? { dataSource: tick.dataSource } : {}),
      ...(tick.dataStatus ? { dataStatus: tick.dataStatus } : {}),
      ...(tick.observedAt ? { observedAt: tick.observedAt } : {}),
    };

    this.liveIndices.set(tick.symbol, updated);
    void this.redisService?.set(`${CachePrefix.TICKER}${tick.symbol}`, updated, 600);
  }

  private async loadConfigurationsFromDb(): Promise<void> {
    const config = await loadMarketConfigs(this.databaseService, this.logger);
    this.breadthConfig = config.breadth;
    this.sectorConfig = config.sector;
  }

  private async hydrateCoreIndices(): Promise<void> {
    for (const symbol of CORE_INDEX_SYMBOLS) {
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
            dataSource: live.source,
            dataStatus: live.dataStatus,
            ...(live.observedAt ? { observedAt: live.observedAt } : {}),
          });
        }
      } catch (error) {
        this.logger.warn(
          `[hydrateCoreIndices] Could not hydrate live quote for ${symbol}: ${String(error)}`,
        );
      }
    }
  }
}
