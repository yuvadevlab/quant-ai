/**
 * @file apps/api/src/modules/chat/chat-guardrails.ts
 * @description Prompt-injection defense and financial-domain boundary guardrails for QuantAI Copilot.
 * @author yuva.devlab@gmail.com
 */

import {
  COPILOT_EXPLICIT_OFF_TOPIC_PATTERN,
  COPILOT_FINANCE_DOMAIN_PATTERN,
  COPILOT_GREETING_PATTERN,
  COPILOT_GUARDRAIL_REPLIES,
  COPILOT_INJECTION_PATTERNS,
} from "@quant-ai/prompts";
import { extractMentionedSymbol } from "./chat-symbol-extractor";

export enum GuardrailBlockReason {
  PROMPT_INJECTION = "PROMPT_INJECTION",
  OFF_TOPIC = "OFF_TOPIC",
}

export interface ChatGuardrailResult {
  readonly allowed: boolean;
  readonly sanitizedQuery: string;
  readonly reason?: GuardrailBlockReason;
  readonly reply?: string;
}

/**
 * Strips control characters and neutralizes delimiter tags from untrusted user text.
 */
export function sanitizeChatInput(rawQuery: string): string {
  const withoutControlChars = Array.from(rawQuery)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join("");
  return withoutControlChars.replace(/<\/?trader_query>/gi, "").trim();
}

/**
 * Evaluates incoming trader chat queries for prompt injection and financial-domain relevance.
 */
export function evaluateChatGuardrails(rawQuery: string): ChatGuardrailResult {
  const sanitizedQuery = sanitizeChatInput(rawQuery);
  if (!sanitizedQuery) {
    return {
      allowed: false,
      sanitizedQuery,
      reason: GuardrailBlockReason.OFF_TOPIC,
      reply: COPILOT_GUARDRAIL_REPLIES.OFF_TOPIC,
    };
  }

  for (const pattern of COPILOT_INJECTION_PATTERNS) {
    if (pattern.test(sanitizedQuery)) {
      return {
        allowed: false,
        sanitizedQuery,
        reason: GuardrailBlockReason.PROMPT_INJECTION,
        reply: COPILOT_GUARDRAIL_REPLIES.PROMPT_INJECTION,
      };
    }
  }

  if (COPILOT_GREETING_PATTERN.test(sanitizedQuery)) {
    return { allowed: true, sanitizedQuery };
  }

  const hasSymbol = Boolean(extractMentionedSymbol(sanitizedQuery));
  const hasFinanceTerm = COPILOT_FINANCE_DOMAIN_PATTERN.test(sanitizedQuery);

  if (!hasSymbol && !hasFinanceTerm) {
    return {
      allowed: false,
      sanitizedQuery,
      reason: GuardrailBlockReason.OFF_TOPIC,
      reply: COPILOT_GUARDRAIL_REPLIES.OFF_TOPIC,
    };
  }

  if (COPILOT_EXPLICIT_OFF_TOPIC_PATTERN.test(sanitizedQuery) && !hasSymbol) {
    return {
      allowed: false,
      sanitizedQuery,
      reason: GuardrailBlockReason.OFF_TOPIC,
      reply: COPILOT_GUARDRAIL_REPLIES.OFF_TOPIC,
    };
  }

  return { allowed: true, sanitizedQuery };
}
