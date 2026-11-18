/**
 * @file src/lib/ui-copy/chat.copy.ts
 * @description Centralized copy for the AI Copilot conversational desk.
 * @author yuva.devlab@gmail.com
 */

export const CHAT_COPY = {
  HEADER: {
    TITLE: "Quantitative Strategy Copilot",
    SUBTITLE:
      "Real-time conversational agent specialized in Indian indices, option chain analysis, factor backtesting, and market regime queries.",
  },
  INPUT: {
    PLACEHOLDER:
      "Ask QuantAI (e.g., 'What is the current NIFTY call writing skew?' or 'Analyze RELIANCE swing setup')...",
    DISCLAIMER: "QuantAI outputs are mathematical approximations. Not SEBI advisory.",
  },
  SUGGESTED_PROMPTS: [
    "What is the current NIFTY regime and 3-day trajectory prediction?",
    "Show BANKNIFTY option chain open interest clustering for next expiry",
    "Identify top 3 oversold midcaps with institutional accumulation",
    "Stress test our portfolio against an emergency 50bps RBI rate hike",
  ],
} as const;
