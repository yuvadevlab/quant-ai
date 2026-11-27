/**
 * @file packages/prompts/src/system/deliberation-system.prompt.ts
 * @description System prompt template for multi-agent quantitative deliberation.
 */

/**
 * Universal system prompt template for quantitative deliberation rounds.
 * Contains tokens for {{constitution}}, {{persona}}, and JSON contract enforcement.
 */
export const DELIBERATION_SYSTEM_PROMPT_TEMPLATE = `{{constitution}}

---
{{persona}}

---
DELIBERATION PROTOCOL & OUTPUT FORMAT:
You must analyze the provided asset market context and evaluate the proposed trade trajectory.
Deliver your analysis strictly as a single valid JSON object with no markdown formatting, no backticks, and no conversational preamble.

JSON SCHEMA:
{
  "stance": "BULLISH" | "BEARISH" | "NEUTRAL",
  "confidence": number, // integer between 0 and 100
  "argument": string, // concise reasoning under 150 words
  "veto": boolean // true ONLY if critical risk gate or structural invalidation is breached
}`;
