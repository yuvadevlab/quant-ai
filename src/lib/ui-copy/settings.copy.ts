/**
 * @file src/lib/ui-copy/settings.copy.ts
 * @description Centralized copy for the Settings Desk.
 * @author yuva.devlab@gmail.com
 */

export const SETTINGS_COPY = {
  HEADER: {
    TITLE: "System Preferences & Model Configuration",
    SUBTITLE:
      "Fine-tune multi-agent reasoning models, quantitative risk thresholds, market feed rates, and alert channels.",
  },
  SECTIONS: {
    MODELS: {
      TITLE: "Autonomous Multi-Agent AI Engine",
      DESCRIPTION: "Configure which frontier model powers each individual analytical persona.",
      MACRO_AGENT: "Macro & Monetary Policy Agent",
      MOMENTUM_AGENT: "Technical & Order-Flow Agent",
      VOLATILITY_AGENT: "Volatility & Greeks Agent",
      SYNTHESIS_LEAD: "Chief Synthesis Engine",
    },
    RISK: {
      TITLE: "Institutional Risk Limits",
      DESCRIPTION: "Enforce safety boundaries on suggested signals.",
      MAX_SL_PCT: "Maximum Invalidation Stop-Loss Distance (%)",
      MIN_RR: "Minimum Risk-to-Reward Ratio (e.g. 1:2)",
      MIN_CONFIDENCE: "Minimum Signal Confidence Threshold (%)",
    },
    FEEDS: {
      TITLE: "NSE & BSE Live Data Feed",
      DESCRIPTION: "Manage market depth polling frequencies and order-flow socket connectivity.",
      REFRESH_INTERVAL: "Tick Polling Interval",
      PAPER_MODE: "Simulated Paper-Tracking Engine Active",
    },
  },
} as const;
