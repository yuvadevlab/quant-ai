/**
 * @file apps/api/src/modules/predictions/predictions.service.ts
 * @description Dynamic reactive predictions service tracking multi-strategy live setups, PnL, and agent consensus.
 * @author yuva.devlab@gmail.com
 */

import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  OnModuleDestroy,
  Optional,
} from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { EventTopic, Signal, SignalStatus, TrajectoryPoint } from "@quant-ai/shared-types";
import { type DomainEventEnvelope } from "@yuva-devlab/events";
import { EventBusService } from "../infrastructure/event-bus.service";
import { DatabaseService } from "../infrastructure/database.service";
import { LiveMarketFeedService } from "../market/feed";
import { RealtimeService } from "../realtime/realtime.service";
import { hydratePredictionsFromDatabase } from "./predictions-hydrator";
import { executeRealMarketAnalysis, type AnalysisFilterOptions } from "./predictions-analyzer";
import {
  handlePredictionTick,
  handleDeliberationOutcome,
  type PredictionTickPayload,
  type DeliberationCompletedPayload,
} from "./predictions-events";

/**
 * Service managing dynamic multi-strategy prediction ledgers, live PnL, and trajectories.
 */
@Injectable()
export class PredictionsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PredictionsService.name);
  private readonly predictions = new Map<string, Signal>();
  private unsubTick?: () => void;
  private unsubDeliberation?: () => void;

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly eventBusService?: EventBusService,
    @Optional() private readonly realtimeService?: RealtimeService,
    @Optional() private readonly databaseService?: DatabaseService,
  ) {}

  public async onModuleInit(): Promise<void> {
    if (this.eventBusService) {
      this.unsubTick = this.eventBusService.subscribe(
        EventTopic.MARKET_TICKS,
        (envelope: unknown) => {
          handlePredictionTick(
            this.predictions,
            envelope as DomainEventEnvelope<PredictionTickPayload>,
            this.realtimeService,
          );
        },
      );
      this.unsubDeliberation = this.eventBusService.subscribe(
        EventTopic.DELIBERATION_COMPLETED,
        (envelope: unknown) => {
          handleDeliberationOutcome(
            this.predictions,
            envelope as DomainEventEnvelope<DeliberationCompletedPayload>,
          );
        },
      );
      this.logger.info(
        "[onModuleInit] PredictionsService subscribed to real-time MARKET_TICKS and DELIBERATION",
      );
    }

    const hydrated = await hydratePredictionsFromDatabase(
      this.databaseService,
      this.liveMarketFeed,
      this.logger,
    );
    for (const [id, signal] of hydrated.entries()) {
      this.predictions.set(id, signal);
    }
  }

  public onModuleDestroy(): void {
    this.unsubTick?.();
    this.unsubDeliberation?.();
  }

  /**
   * Retrieves all predictions from the dynamic ledger.
   */
  public findAll(): readonly Signal[] {
    return Array.from(this.predictions.values());
  }

  /**
   * Retrieves active signals pending outcome.
   */
  public findActive(): readonly Signal[] {
    return Array.from(this.predictions.values()).filter((s) => s.status === SignalStatus.ACTIVE);
  }

  public findActiveBySymbol(symbol: string): Signal | undefined {
    const sym = symbol.toUpperCase().trim();
    return Array.from(this.predictions.values()).find(
      (s) => s.ticker.toUpperCase() === sym && s.status === SignalStatus.ACTIVE,
    );
  }

  public findById(id: string): Signal {
    const signal = this.predictions.get(id) ?? this.findActiveBySymbol(id);
    if (!signal) {
      throw new NotFoundException(`Prediction with ID "${id}" not found.`);
    }
    return signal;
  }

  /**
   * Resolves a prediction by ID or ticker; dynamically analyzes and generates if not yet present.
   */
  public async findOrGenerate(idOrTicker: string): Promise<Signal> {
    try {
      return this.findById(idOrTicker);
    } catch {
      if (/^pred_/i.test(idOrTicker)) {
        throw new NotFoundException(`Prediction with ID "${idOrTicker}" not found.`);
      }

      const cleanSym = idOrTicker
        .toUpperCase()
        .replace(/^PRED-/, "")
        .trim();
      const analyzed = await executeRealMarketAnalysis(
        this.databaseService,
        this.liveMarketFeed,
        this.logger,
        { symbols: [cleanSym] },
      );
      if (analyzed.length > 0 && analyzed[0]) {
        const generated = analyzed[0];
        this.predictions.set(generated.id, generated);
        return generated;
      }
      throw new NotFoundException(`Could not analyze or generate prediction for "${idOrTicker}".`);
    }
  }

  /**
   * Retrieves the Monte Carlo trajectory cone for an active prediction.
   */
  public getTrajectory(id: string): readonly TrajectoryPoint[] {
    const signal = this.findById(id);
    return signal.trajectory ?? [];
  }

  /**
   * Dynamically adds or updates a signal in the ledger.
   */
  public registerSignal(signal: Signal): void {
    this.predictions.set(signal.id, signal);
  }

  /**
   * Invalidates a previous prediction and records audit status in database and live stream.
   */
  public async invalidateSignal(id: string, reason?: string): Promise<boolean> {
    const signal = this.predictions.get(id);
    if (!signal) return false;

    const updated: Signal = {
      ...signal,
      status: SignalStatus.INVALIDATED,
      thesis: reason ? `${signal.thesis} [Invalidated: ${reason}]` : signal.thesis,
    };
    this.predictions.set(id, updated);

    if (this.databaseService) {
      try {
        await this.databaseService.client.prediction.update({
          where: { id },
          data: { status: SignalStatus.INVALIDATED },
        });
      } catch (err) {
        this.logger.warn(`[invalidateSignal] DB update failed for ${id}: ${String(err)}`);
      }
    }

    this.realtimeService?.emitSignalUpdate({
      id,
      ticker: signal.ticker,
      currentPrice: signal.current,
      pnlPercent: signal.pnlPercent ?? 0,
      status: SignalStatus.INVALIDATED,
    });

    this.logger.info(
      `[invalidateSignal] Marked prediction ${id} as INVALIDATED (${reason ?? "thesis break"})`,
    );
    return true;
  }

  /**
   * Re-evaluates or generates a new prediction for a symbol, safely invalidating any conflicting prior thesis.
   */
  public async registerOrUpdateSignalForSymbol(
    symbol: string,
    reason?: string,
  ): Promise<Signal | null> {
    const active = this.findActiveBySymbol(symbol);
    if (active && reason) {
      await this.invalidateSignal(active.id, reason);
    }

    const signals = await this.runLiveMarketAnalysis({ symbols: [symbol] });
    return signals[0] ?? null;
  }

  public async runLiveMarketAnalysis(options?: AnalysisFilterOptions): Promise<readonly Signal[]> {
    const signals = await executeRealMarketAnalysis(
      this.databaseService,
      this.liveMarketFeed,
      this.logger,
      options,
    );
    for (const signal of signals) {
      this.predictions.set(signal.id, signal);
      this.realtimeService?.emitSignalUpdate({
        id: signal.id,
        ticker: signal.ticker,
        currentPrice: signal.current,
        pnlPercent: signal.pnlPercent ?? 0,
        status: signal.status,
      });
    }
    return signals;
  }
}
