/**
 * @file packages/events/src/contracts/tick.event.ts
 * @description Real-time market tick event payload and envelope factory using @yuva-devlab/events.
 */

import { z } from "zod";
import { createEventEnvelope, type DomainEventEnvelope } from "@yuva-devlab/events";
import { EventTopic, MarketDataStatus } from "@quant-ai/shared-types";

/**
 * Zod validator for high-frequency market tick stream payloads.
 */
export const MarketTickPayloadSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  change: z.number(),
  percentChange: z.number(),
  high: z.number().positive(),
  low: z.number().positive(),
  volume: z.number().nonnegative(),
  timestamp: z.string().datetime(),
  dataSource: z.string(),
  dataStatus: z.nativeEnum(MarketDataStatus),
  observedAt: z.string().datetime().optional(),
});

export type MarketTickPayload = z.infer<typeof MarketTickPayloadSchema>;

/**
 * Creates an ecosystem-standard DomainEventEnvelope for a market tick.
 *
 * @param payload - Ingested tick pricing and volume payload.
 * @param executionId - Optional correlation or run identifier.
 * @returns Standardized DomainEventEnvelope.
 */
export function createMarketTickEnvelope(
  payload: MarketTickPayload,
  executionId?: string,
): DomainEventEnvelope<MarketTickPayload> {
  return createEventEnvelope<MarketTickPayload>({
    eventType: EventTopic.MARKET_TICKS,
    payload,
    executionId,
  });
}
