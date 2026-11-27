/**
 * @file packages/events/src/contracts/deliberation.event.ts
 * @description Multi-agent deliberation consensus event payload and envelope factory.
 */

import { z } from "zod";
import { createEventEnvelope, type DomainEventEnvelope } from "@yuva-devlab/events";
import { AgentRole, AgentStance, EventTopic } from "@quant-ai/shared-types";

/**
 * Zod schema for individual agent verdict.
 */
export const AgentVerdictPayloadSchema = z.object({
  agentRole: z.nativeEnum(AgentRole),
  stance: z.nativeEnum(AgentStance),
  score: z.number().min(0).max(100),
  rationale: z.string().min(1),
  isVeto: z.boolean(),
});

/**
 * Zod schema for multi-agent deliberation outcome event.
 */
export const DeliberationPayloadSchema = z.object({
  predictionId: z.string().min(1),
  consensusVeto: z.boolean(),
  netScore: z.number().min(0).max(100),
  verdicts: z.array(AgentVerdictPayloadSchema),
  timestamp: z.string().datetime(),
});

export type DeliberationPayload = z.infer<typeof DeliberationPayloadSchema>;

/**
 * Creates an ecosystem-standard DomainEventEnvelope for a completed multi-agent deliberation.
 *
 * @param payload - Deliberation consensus and agent verdicts.
 * @param executionId - Execution correlation ID.
 * @returns Standardized DomainEventEnvelope.
 */
export function createDeliberationEnvelope(
  payload: DeliberationPayload,
  executionId?: string,
): DomainEventEnvelope<DeliberationPayload> {
  return createEventEnvelope<DeliberationPayload>({
    eventType: EventTopic.DELIBERATION_COMPLETED,
    payload,
    executionId,
  });
}
