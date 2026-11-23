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
  THREAD: {
    SESSION_TITLE: "Session: Multi-Asset Market Intelligence & Strategy Deliberation",
    MODEL_BADGE: "Multi-Agent Ensemble (Gemini / Anthropic / Groq)",
    ASSISTANT_NAME: "QuantAI Copilot",
    USER_NAME: "You (Trader)",
    EMBEDDED_SETUP: "EMBEDDED PREDICTION SETUP",
    ENTRY_PREFIX: "Entry:",
    TARGET_PREFIX: "T1:",
    VIEW_TRAJECTORY: "View Trajectory in Monitor",
  },
  COMPOSER: {
    PLACEHOLDER: "Ask QuantAI about a symbol, pattern, options setup, or risk condition...",
    SHORTCUT_HINT: "Enter to send",
    SEND_BUTTON: "Send",
    SEND_TOOLTIP: "Send query to Copilot",
    DISCLAIMER:
      "Autonomous AI committee outputs are mathematical projections, not direct SEBI financial advice.",
  },
  SUGGESTIONS: {
    LABEL: "QUICK PROMPTS:",
    PROMPT_NIFTY: "Scan Nifty 50 expiry momentum",
    PROMPT_BANKNIFTY: "BankNifty 51,200 CE options structure",
    PROMPT_RELIANCE: "Analyze Reliance 15m breakout",
    PROMPT_RULES: "Explain automated invalidation rules",
  },
  INITIAL_MESSAGES: {
    FIRST_ASSISTANT:
      "Reliance Industries is demonstrating institutional accumulation above the 20 EMA after an opening range breakout. Technical momentum is confirmed by volume expansion and Call unwinding at 3,000 CE. Below is the multi-agent consensus trade structure:",
    USER_QUERY: "What specific criteria would invalidate this trade hypothesis?",
    SECOND_ASSISTANT:
      "The deterministic Quant Risk Officer established two strict invalidation rules: \n1. A 15-minute candle close below the stop-loss level.\n2. A reversal in options flow where resistance calls see heavy institutional writing without spot price progression.",
  },
} as const;
