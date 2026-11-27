/**
 * @file packages/events/src/contracts/prediction.event.ts
 * @description Prediction generation event payload and envelope factory using @yuva-devlab/events.
 */

import { z } from "zod";
import { createEventEnvelope, type DomainEventEnvelope } from "@yuva-devlab/events";
import {
  AssetClass,
  EventTopic,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeStrategy,
} from "@quant-ai/shared-types";

/**
 * Zod schema for new quantitative prediction events.
 */
export const PredictionSignalPayloadSchema = z.object({
  predictionId: z.string().min(1),
  symbol: z.string().min(1),
  direction: z.nativeEnum(SignalDirection),
  strategy: z.nativeEnum(TradeStrategy).optional(),
  assetClass: z.nativeEnum(AssetClass).optional(),
  confidenceScore: z.number().min(0).max(100),
  expectedValue: z.number(),
  targetPrice: z.number().positive(),
  stopLossPrice: z.number().positive(),
  regime: z.nativeEnum(SignalRegime),
  status: z.nativeEnum(SignalStatus),
  createdAt: z.string().datetime(),
});

export type PredictionSignalPayload = z.infer<typeof PredictionSignalPayloadSchema>;

/**
 * Creates an ecosystem-standard DomainEventEnvelope for a generated prediction signal.
 *
 * @param payload - Quantitative model prediction signal.
 * @param traceId - Distributed telemetry trace identifier.
 * @returns Standardized DomainEventEnvelope.
 */
export function createPredictionEnvelope(
  payload: PredictionSignalPayload,
  traceId?: string,
): DomainEventEnvelope<PredictionSignalPayload> {
  return createEventEnvelope<PredictionSignalPayload>({
    eventType: EventTopic.PREDICTION_GENERATED,
    payload,
    traceId,
  });
}
