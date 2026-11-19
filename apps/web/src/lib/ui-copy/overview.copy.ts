/**
 * @file src/lib/ui-copy/overview.copy.ts
 * @description Centralized copy for the Overview Desk. */

export const OVERVIEW_COPY = {
  HEADER: {
    TITLE: "Market Intelligence & Signal Radar",
    SUBTITLE:
      "Real-time algorithmic surveillance across NSE indices and high-liquidity Indian equities.",
  },
  METRICS: {
    HIT_RATE_TITLE: "30-Day Win Rate",
    HIT_RATE_SUB: "128 of 163 signals reached Target 1",
    CONFIDENCE_TITLE: "Model Avg Confidence",
    CONFIDENCE_SUB: "Across 4 active multi-agent models",
    ACTIVE_TARGETS_TITLE: "Active Trajectories",
    ACTIVE_TARGETS_SUB: "Live surveillance monitors",
    SHARPE_TITLE: "Algorithmic Sharpe",
    SHARPE_SUB: "Risk-adjusted performance score",
  },
  REGIME: {
    LABEL: "CURRENT REGIME",
    TITLE: "NIFTY Regime: Mild Bullish with High IV Skew",
    DESCRIPTION:
      "VIX currently consolidating at 13.4. Options open interest indicates strong support at 24,000 and institutional call writing clustering near 24,500.",
    VIX_LEVEL: "VIX 13.4 (Neutral)",
    PULLBACK_ODDS: "Pullback Risk: 18%",
  },
  INDEX_FILTERS: {
    ALL: "All Benchmarks",
    BROAD_MARKET: "Broad Market",
    FINANCIALS: "Banking & Financials",
    SECTORAL: "Sectoral Leaders",
    VOLATILITY: "Volatility & Macro",
  },
  HOT_SIGNALS: {
    TITLE: "High-Confidence Active Signals",
    VIEW_ALL: "View Full Predictions Lab →",
  },
  AGENT_PULSE: {
    TITLE: "Autonomous Multi-Agent Consensus Stream",
    SUBTITLE:
      "Live deliberation feed combining macro, momentum, volatility, and order-flow agents.",
  },
} as const;
