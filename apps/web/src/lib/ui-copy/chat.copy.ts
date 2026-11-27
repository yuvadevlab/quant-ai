/**
 * @file src/lib/ui-copy/chat.copy.ts
 * @description Centralized copy for the AI Copilot conversational desk.
 */

export const CHAT_COPY = {
  HEADER: {
    TITLE: "AI Strategist",
    SUBTITLE:
      "Real-time quantitative strategist specialized in Indian indices, option chain analysis, factor backtesting, and market regime queries.",
  },
  THREAD: {
    SESSION_TITLE: "Multi-Asset Market Intelligence",
    MODEL_BADGE: "Multi-Agent Ensemble",
    ASSISTANT_NAME: "QuantAI Strategist",
    USER_NAME: "You (Trader)",
    EMBEDDED_SETUP: "EMBEDDED PREDICTION SETUP",
    ENTRY_PREFIX: "Entry:",
    TARGET_PREFIX: "T1:",
    VIEW_TRAJECTORY: "View Trajectory in Monitor",
    FOLLOW_UPS_LABEL: "Suggested follow-ups",
    THINKING_LABEL: "Synthesizing market telemetry...",
  },
  COMPOSER: {
    PLACEHOLDER: "Ask QuantAI Strategist about a symbol, pattern, options setup, or risk rule...",
    SHORTCUT_HINT: "Enter to send · Shift+Enter for new line",
    SEND_BUTTON: "Send",
    SEND_TOOLTIP: "Send query to AI Strategist",
    STOP_BUTTON: "Stop generating",
    JUMP_TO_LATEST: "Jump to latest",
    DISCLAIMER:
      "Autonomous AI committee outputs are mathematical projections, not direct SEBI financial advice.",
  },
  ACTIVITY_TIMELINE: {
    HEADER_TITLE: "Execution & Reasoning",
    THINKING: "Understanding your question",
    ANALYZED: "Analysis complete",
    ISSUES: "Completed with warnings",
    SHOW_DETAILS: "Show details",
    HIDE_DETAILS: "Hide details",
    STEPS_TAB: "Steps",
    LIVE_CONSOLE_TAB: "Live Console",
    STREAM_ACTIVE: "Live",
    COMPLETE: "Complete",
    EXECUTION_STEPS: "Execution steps",
    STEP_COUNT: (n: number) => `${n} step${n === 1 ? "" : "s"}`,
  },
  LIVE_CONSOLE: {
    TITLE: "quant-ai strategist · live telemetry",
    EMPTY: "Waiting for execution telemetry...",
  },
  MODES: {
    AGENT: "Agent mode",
    ADVISOR: "Advisor mode",
  },
  ERRORS: {
    TITLE: "Stream Interrupted",
    DESCRIPTION: "Unable to complete real-time synthesis. Check API connectivity and retry.",
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
