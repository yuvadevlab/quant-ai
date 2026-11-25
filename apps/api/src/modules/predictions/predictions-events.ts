/**
 * @file apps/api/src/modules/predictions/predictions-events.ts
 * @description Real-time market tick and deliberation outcome event handlers for Predictions.
 * @author yuva.devlab@gmail.com
 */

import {
  AgentRole,
  AgentStance,
  MarketDataStatus,
  Signal,
  SignalDirection,
  SignalStatus,
} from "@quant-ai/shared-types";
import {
  calculateReturnPercent,
  calculateUnrealizedPnl,
  TradePositionSide,
} from "@quant-ai/quant-core";
import type { DomainEventEnvelope } from "@yuva-devlab/events";
import type { RealtimeService } from "../realtime/realtime.service";

export interface PredictionTickPayload extends Record<string, unknown> {
  symbol?: string;
  price?: number;
  dataStatus?: MarketDataStatus;
  observedAt?: string;
}

export interface DeliberationCompletedPayload extends Record<string, unknown> {
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
 * Updates PnL and triggers automated target or stop hit state transitions on incoming market ticks.
 */
export function handlePredictionTick(
  predictions: Map<string, Signal>,
  envelope: DomainEventEnvelope<PredictionTickPayload>,
  realtimeService?: RealtimeService,
): readonly Signal[] {
  const tick = envelope?.payload;
  if (
    !tick?.symbol ||
    typeof tick.price !== "number" ||
    tick.dataStatus !== MarketDataStatus.VERIFIED ||
    !tick.observedAt ||
    !Number.isFinite(Date.parse(tick.observedAt))
  ) {
    return [];
  }

  const completedSignals: Signal[] = [];
  for (const [id, signal] of predictions.entries()) {
    if (signal.ticker === tick.symbol && signal.status === SignalStatus.ACTIVE) {
      const current = tick.price;
      const side =
        signal.direction === SignalDirection.LONG
          ? TradePositionSide.LONG
          : TradePositionSide.SHORT;
      const pnlAbsolute = calculateUnrealizedPnl(signal.entry, current, 1, side);
      const pnlPercent = calculateReturnPercent(signal.entry, current, side);
      const maxExcursion = Math.max(signal.maxExcursion ?? 0, pnlPercent);

      let status: SignalStatus = signal.status;
      if (signal.direction === SignalDirection.LONG && current >= signal.target) {
        status = SignalStatus.TARGET_HIT;
      } else if (signal.direction === SignalDirection.LONG && current <= signal.stopLoss) {
        status = SignalStatus.STOP_HIT;
      } else if (signal.direction === SignalDirection.SHORT && current <= signal.target) {
        status = SignalStatus.TARGET_HIT;
      } else if (signal.direction === SignalDirection.SHORT && current >= signal.stopLoss) {
        status = SignalStatus.STOP_HIT;
      }

      const updated: Signal = {
        ...signal,
        current,
        pnlAbsolute,
        pnlPercent,
        maxExcursion,
        status,
        ...(status !== SignalStatus.ACTIVE
          ? {
              metricEligible: true,
              outcomePrice: current,
              outcomeAt: tick.observedAt,
            }
          : {}),
      };

      predictions.set(id, updated);
      if (status !== SignalStatus.ACTIVE) completedSignals.push(updated);
      realtimeService?.emitSignalUpdate({
        id,
        ticker: signal.ticker,
        currentPrice: current,
        pnlPercent,
        status,
      });
    }
  }
  return completedSignals;
}

/**
 * Attaches multi-agent deliberation verdicts when an asynchronous consensus debate concludes.
 */
export function handleDeliberationOutcome(
  predictions: Map<string, Signal>,
  envelope: DomainEventEnvelope<DeliberationCompletedPayload>,
): void {
  const payload = envelope?.payload;
  if (!payload?.predictionId) return;

  const signal = predictions.get(payload.predictionId);
  if (!signal || !payload.verdicts) return;

  const updatedAgents = payload.verdicts.map((v) => ({
    role: v.agentRole as AgentRole,
    stance: v.stance as AgentStance,
    confidence: v.score,
    summary: v.rationale,
  }));

  predictions.set(payload.predictionId, {
    ...signal,
    confidence: payload.netScore ?? signal.confidence,
    agents: updatedAgents,
  });
}
