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
import {
  AgentRole,
  AgentStance,
  EventTopic,
  Signal,
  SignalDirection,
  SignalStatus,
  TrajectoryPoint,
} from "@quant-ai/shared-types";
import { type DomainEventEnvelope } from "@yuva-devlab/events";
import { EventBusService } from "../infrastructure/event-bus.service";
import { LiveMarketFeedService } from "../market/feed";
import { RealtimeService } from "../realtime/realtime.service";
import { hydratePredictionsFromLiveFeed } from "./predictions-hydrator";

interface PredictionTickPayload extends Record<string, unknown> {
  symbol?: string;
  price?: number;
}

interface DeliberationCompletedPayload extends Record<string, unknown> {
  predictionId?: string;
  consensusVeto?: boolean;
  netScore?: number;
  verdicts?: Array<{
    agentRole: string;
    stance: string;
    score: number;
    rationale: string;
  }>;
}

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
  ) {}

  /**
   * Subscribes to real-time events and hydrates multi-strategy opportunities dynamically.
   */
  public async onModuleInit(): Promise<void> {
    if (this.eventBusService) {
      this.unsubTick = this.eventBusService.subscribe(
        EventTopic.MARKET_TICKS,
        (envelope: unknown) => {
          this.handleIncomingTick(envelope as DomainEventEnvelope<PredictionTickPayload>);
        },
      );
      this.unsubDeliberation = this.eventBusService.subscribe(
        EventTopic.DELIBERATION_COMPLETED,
        (envelope: unknown) => {
          this.handleDeliberationOutcome(
            envelope as DomainEventEnvelope<DeliberationCompletedPayload>,
          );
        },
      );
      this.logger.info("PredictionsService subscribed to real-time MARKET_TICKS and DELIBERATION");
    }

    const hydrated = await hydratePredictionsFromLiveFeed(this.liveMarketFeed, this.logger);
    for (const [id, signal] of hydrated.entries()) {
      this.predictions.set(id, signal);
    }
  }

  /**
   * Cleans up event subscriptions on shutdown.
   */
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

  /**
   * Retrieves a single prediction by ID.
   */
  public findById(id: string): Signal {
    const signal = this.predictions.get(id);
    if (!signal) {
      throw new NotFoundException(`Prediction with ID "${id}" not found.`);
    }
    return signal;
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
   * Dynamically updates PnL and status on incoming market ticks.
   */
  public handleIncomingTick(envelope: DomainEventEnvelope<PredictionTickPayload>): void {
    const tick = envelope?.payload;
    if (!tick?.symbol || typeof tick.price !== "number") {
      return;
    }

    for (const [id, signal] of this.predictions.entries()) {
      if (signal.ticker === tick.symbol && signal.status === SignalStatus.ACTIVE) {
        const current = tick.price;
        const pnlAbsolute = Number((current - signal.entry).toFixed(2));
        const pnlPercent = Number((((current - signal.entry) / signal.entry) * 100).toFixed(2));
        const maxExcursion = Math.max(signal.maxExcursion ?? 0, pnlPercent);

        let status: SignalStatus = signal.status;
        if (signal.direction === SignalDirection.LONG && current >= signal.target) {
          status = SignalStatus.TARGET_HIT;
        } else if (signal.direction === SignalDirection.LONG && current <= signal.stopLoss) {
          status = SignalStatus.INVALIDATED;
        }

        const updated: Signal = {
          ...signal,
          current,
          pnlAbsolute,
          pnlPercent,
          maxExcursion,
          status,
        };

        this.predictions.set(id, updated);
        this.realtimeService?.emitSignalUpdate({
          id,
          ticker: signal.ticker,
          currentPrice: current,
          pnlPercent,
          status,
        });
      }
    }
  }

  /**
   * Attaches multi-agent deliberation verdicts when a debate completes.
   */
  public handleDeliberationOutcome(
    envelope: DomainEventEnvelope<DeliberationCompletedPayload>,
  ): void {
    const payload = envelope?.payload;
    if (!payload?.predictionId) return;

    const signal = this.predictions.get(payload.predictionId);
    if (!signal || !payload.verdicts) return;

    const updatedAgents = payload.verdicts.map((v) => ({
      role: v.agentRole as AgentRole,
      stance: v.stance as AgentStance,
      confidence: v.score,
      summary: v.rationale,
    }));

    this.predictions.set(payload.predictionId, {
      ...signal,
      confidence: payload.netScore ?? signal.confidence,
      agents: updatedAgents,
    });
  }
}
