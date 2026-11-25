/**
 * @file apps/api/src/modules/portfolio/portfolio.service.ts
 * @description Dynamic paper portfolio service marking active simulated positions to live market prices.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { EventTopic, MarketDataStatus } from "@quant-ai/shared-types";
import {
  calculatePortfolioValuations,
  calculateReturnPercent,
  calculateUnrealizedPnl,
  calculateWinRate,
  TradePositionSide,
} from "@quant-ai/quant-core";
import { type DomainEventEnvelope } from "@yuva-devlab/events";
import { EventBusService } from "../infrastructure/event-bus.service";
import { DatabaseService } from "../infrastructure/database.service";
import { isUsableMarketDataStatus, LiveMarketFeedService } from "../market/feed";
import {
  type PaperExecution,
  type PaperPosition,
  type PortfolioSummary,
  PositionSide,
} from "./portfolio.types";

interface TickEventPayload extends Record<string, unknown> {
  symbol?: string;
  price?: number;
  dataStatus?: MarketDataStatus;
}

/**
 * Service managing simulated paper portfolio, live marks to market, and performance ledgers.
 */
@Injectable()
export class PortfolioService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PortfolioService.name);
  private initialCapital = 1000000;
  private realizedPnl = 0;
  private unsubTick?: () => void;

  private readonly positions = new Map<string, PaperPosition>();
  private readonly executions: PaperExecution[] = [];

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly eventBusService?: EventBusService,
    @Optional() private readonly databaseService?: DatabaseService,
  ) {}

  /**
   * Initializes positions dynamically with live pricing and subscribes to market ticks.
   */
  public async onModuleInit(): Promise<void> {
    if (this.eventBusService) {
      this.unsubTick = this.eventBusService.subscribe(
        EventTopic.MARKET_TICKS,
        (envelope: unknown) => {
          this.handleIncomingTick(envelope as DomainEventEnvelope<TickEventPayload>);
        },
      );
      this.logger.info("[onModuleInit] PortfolioService subscribed to real-time MARKET_TICKS");
    }

    await this.loadPortfolioFromDb();
  }

  /**
   * Cleans up subscription on shutdown.
   */
  public onModuleDestroy(): void {
    this.unsubTick?.();
  }

  /**
   * Returns current portfolio summary with live mark-to-market valuations.
   */
  public getPortfolioSummary(): PortfolioSummary {
    const activePositions = Array.from(this.positions.values());
    const valuationPositions = activePositions.map((pos) => ({
      entryPrice: pos.entryPrice,
      qty: pos.qty,
      pnl: pos.pnl,
    }));

    const metrics = calculatePortfolioValuations(
      this.initialCapital,
      this.realizedPnl,
      valuationPositions,
    );

    const winningTrades = this.executions.filter((e) => e.pnl > 0).length;
    const winRate = calculateWinRate(winningTrades, this.executions.length);

    return {
      totalEquity: metrics.totalEquity,
      initialCapital: this.initialCapital,
      realizedPnl: this.realizedPnl,
      unrealizedPnl: metrics.unrealizedPnl,
      availableMargin: metrics.availableMargin,
      marginUsed: metrics.marginUsed,
      winRate,
      positions: activePositions,
      recentExecutions: this.executions,
    };
  }

  /**
   * Adds an execution record dynamically and updates realized PnL.
   */
  public recordExecution(execution: PaperExecution): void {
    this.executions.unshift(execution);
    this.realizedPnl = Number((this.realizedPnl + execution.pnl).toFixed(2));
  }

  /**
   * Adds or updates a paper trading position.
   */
  public addPosition(position: PaperPosition): void {
    this.positions.set(position.symbol, position);
  }

  /**
   * Updates position mark to market when tick arrives.
   */
  public handleIncomingTick(envelope: DomainEventEnvelope<TickEventPayload>): void {
    const tick = envelope?.payload;
    if (
      !tick?.symbol ||
      typeof tick.price !== "number" ||
      !tick.dataStatus ||
      !isUsableMarketDataStatus(tick.dataStatus)
    ) {
      return;
    }

    const existing = this.positions.get(tick.symbol);
    if (!existing) return;

    const currentPrice = tick.price;
    const side =
      existing.side === PositionSide.LONG ? TradePositionSide.LONG : TradePositionSide.SHORT;
    const pnl = calculateUnrealizedPnl(existing.entryPrice, currentPrice, existing.qty, side);
    const returnPercent = calculateReturnPercent(existing.entryPrice, currentPrice, side);

    this.positions.set(tick.symbol, {
      ...existing,
      currentPrice,
      dataStatus: tick.dataStatus,
      pnl,
      returnPercent,
    });
  }

  private async loadPortfolioFromDb(): Promise<void> {
    if (!this.databaseService) return;

    try {
      const dbPositions = await this.databaseService.client.paperPosition.findMany();
      for (const pos of dbPositions) {
        let currentPrice = pos.entryPrice;
        let dataStatus = MarketDataStatus.UNAVAILABLE;
        try {
          const live = await this.liveMarketFeed.getLiveQuote(pos.symbol);
          if (isUsableMarketDataStatus(live.dataStatus)) {
            currentPrice = live.price;
            dataStatus = live.dataStatus;
          }
        } catch (error) {
          this.logger.debug(
            `[loadPortfolioFromDb] Quote unavailable for ${pos.symbol}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }

        const side = pos.side === "LONG" ? TradePositionSide.LONG : TradePositionSide.SHORT;
        const pnl = calculateUnrealizedPnl(pos.entryPrice, currentPrice, pos.qty, side);
        const returnPercent = calculateReturnPercent(pos.entryPrice, currentPrice, side);

        this.positions.set(pos.symbol, {
          symbol: pos.symbol,
          instrument: pos.instrument,
          side: pos.side === "SHORT" ? PositionSide.SHORT : PositionSide.LONG,
          qty: pos.qty,
          entryPrice: pos.entryPrice,
          currentPrice,
          dataStatus,
          pnl,
          returnPercent,
          stopLoss: pos.stopLoss,
          targetPrice: pos.targetPrice,
        });
      }

      const dbExecutions = await this.databaseService.client.paperExecution.findMany({
        orderBy: { timestamp: "desc" },
        take: 20,
      });

      for (const exec of dbExecutions) {
        this.executions.push({
          id: exec.id,
          symbol: exec.symbol,
          type: exec.type as never,
          qty: exec.qty,
          entryPrice: exec.entryPrice,
          exitPrice: exec.exitPrice,
          pnl: exec.pnl,
          outcome: exec.outcome,
          timestamp: exec.timestamp.toISOString(),
        });
      }

      this.realizedPnl = Number(this.executions.reduce((acc, e) => acc + e.pnl, 0).toFixed(2));
    } catch (err) {
      this.logger.warn(
        `[loadPortfolioFromDb] Could not load portfolio records from DB: ${String(err)}`,
      );
    }
  }
}
