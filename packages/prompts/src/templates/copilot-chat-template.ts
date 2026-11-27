/**
 * @file packages/prompts/src/templates/copilot-chat-template.ts
 * @description User prompt builder and follow-up question extraction utilities for QuantAI Strategist.
 */

import { TRADER_QUERY_DELIMITER } from "../system/copilot-chat-system.prompt";

const FOLLOW_UP_SECTION_REGEX = /(?:^|\n)#{2,4}\s*Follow-up Suggestions\s*:?\s*\n([\s\S]*)$/i;

/**
 * Builds the Strategist chat user prompt with optional verified market telemetry
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

/**
 * Extracts clickable follow-up questions from the trailing `### Follow-up Suggestions:` section.
 *
 * @param markdown - Raw assistant markdown reply.
 * @returns Up to 3 follow-up question strings.
 */
export function extractFollowUpQuestions(markdown: string): string[] {
  const match = markdown.match(FOLLOW_UP_SECTION_REGEX);
  if (!match?.[1]) return [];

  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•\d.)]+\s*/, "").trim())
    .filter((line) => line.length > 8 && line.endsWith("?"))
    .slice(0, 3);
}

/**
 * Strips the trailing `### Follow-up Suggestions:` section from markdown prose
 * when follow-up chips are rendered separately by the UI.
 *
 * @param markdown - Raw assistant markdown reply.
 * @returns Markdown prose without the trailing follow-up suggestions block.
 */
export function stripFollowUpSection(markdown: string): string {
  return markdown.replace(FOLLOW_UP_SECTION_REGEX, "").trim();
}
