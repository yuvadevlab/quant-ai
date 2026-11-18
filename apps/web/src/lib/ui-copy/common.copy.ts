/**
 * @file src/lib/ui-copy/common.copy.ts
 * @description Universal actions, badge labels, navigation copy, and regulatory disclaimer. */

export const COMMON_COPY = {
  APP: {
    NAME: "QuantAI",
    PREFIX: "Quant",
    SUFFIX: "AI",
    BADGE: "V2 PRO",
    TITLE: "AI Quantitative Market Intelligence & Strategy Workstation",
    TAGLINE: "Algorithmic Precision for Indian Financial Markets",
    MARKET_BADGE: "NSE · BSE",
  },
  ACTIONS: {
    SAVE: "Save Changes",
    CANCEL: "Cancel",
    REFRESH: "Refresh Stream",
    SEARCH_PLACEHOLDER: "Search symbols (e.g. NIFTY, RELIANCE, HDFCBANK)...",
    APPLY_FILTERS: "Apply Filters",
    RESET_FILTERS: "Reset",
    EXPORT_CSV: "Export Ledger",
    INSPECT_TRAJECTORY: "Inspect Live Trajectory",
    OPEN_MONITOR: "Open Monitor Desk",
    TRIGGER_PREDICTION: "Run AI Scan",
    SEND_MESSAGE: "Send Prompt",
    VIEW_ALL: "View All Signals",
  },
  NAV: {
    OVERVIEW: "Overview Desk",
    PREDICTIONS: "Predictions Lab",
    SCREENER: "Quant Screener",
    PORTFOLIO: "Portfolio & Risk",
    CHAT: "AI Copilot",
    SETTINGS: "System Settings",
  },
  STATUS: {
    ACTIVE: "Active Target",
    TARGET_HIT: "Target Reached",
    STOP_HIT: "Stop Triggered",
    INVALIDATED: "Signal Invalidation",
    EXPIRED: "Time Expired",
    LIVE_STREAM: "Live NSE Feed",
  },
  REGULATORY_DISCLAIMER: {
    HEADING: "REGULATORY & EDUCATIONAL NOTICE",
    CONTENT:
      "QuantAI is an advanced quantitative research, mathematical modeling, and algorithmic intelligence environment built strictly for educational, informational, and paper-tracking purposes. QuantAI is NOT a registered financial advisory, SEBI-registered research analyst, or portfolio manager. All predictive trajectories, confidence intervals, and multi-agent deliberations represent machine learning mathematical probabilities and do NOT constitute direct financial advice, investment recommendations, or buy/sell orders. Past prediction accuracy does not guarantee future market performance. Derivatives, equities, and options trading involve substantial risk of capital loss. Please consult a SEBI-registered financial advisor before undertaking any trading decisions.",
    COPYRIGHT: "© 2026 Yuva DevLab · Attribution: yuva.devlab@gmail.com",
  },
} as const;
