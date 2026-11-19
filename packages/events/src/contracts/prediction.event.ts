/**
 * @file packages/events/src/contracts/prediction.event.ts
 * @description Prediction generation event payload and envelope factory using @yuva-devlab/events.
 * @author yuva.devlab@gmail.com
 */

import { z } from "zod";
import { createEventEnvelope, type DomainEventEnvelope } from "@yuva-devlab/events";
import {
  MarketIndex,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  EventTopic,
} from "@quant-ai/shared-types";

/**
 * Zod schema for new quantitative prediction events.
 */
export const PredictionSignalPayloadSchema = z.object({
  predictionId: z.string().min(1),
  symbol: z.nativeEnum(MarketIndex),
  direction: z.nativeEnum(SignalDirection),
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
