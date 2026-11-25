/**
 * @file packages/prompts/src/templates/copilot-chat-template.ts
 * @description User prompt builder isolating untrusted trader queries with delimiter tags.
 * @author yuva.devlab@gmail.com
 */

import { TRADER_QUERY_DELIMITER } from "../system/copilot-chat-system.prompt";

/**
 * Builds the Copilot chat user prompt with optional verified market telemetry
 * and strict delimiter isolation around the untrusted trader query.
 *
 * @param query - Sanitized trader inquiry.
 * @param marketContext - Optional provider-backed market telemetry context.
 * @returns Formatted user prompt string.
 */
export function buildCopilotChatUserPrompt(query: string, marketContext?: string): string {
  const escapedQuery = query.replace(/<\/?trader_query>/gi, "");
  const isolatedQuery = `${TRADER_QUERY_DELIMITER.OPEN}\n${escapedQuery}\n${TRADER_QUERY_DELIMITER.CLOSE}`;

  return marketContext
    ? `Verified Market Telemetry:\n${marketContext}\n\n${isolatedQuery}\n\nSynthesize institutional analysis:`
    : `${isolatedQuery}\n\nSynthesize institutional analysis:`;
}
