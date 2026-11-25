/**
 * @file src/lib/ui-copy/overview.copy.ts
 * @description Centralized copy for the Overview Desk and Market Intelligence radar.
 * @author yuva.devlab@gmail.com
 */

export const OVERVIEW_COPY = {
  HEADER: {
    BADGE: "MARKET DATA & RESEARCH",
    TITLE: "Understand the market before you act",
    SUBTITLE:
      "Review provider-backed quotes and research setups with clear context. Missing or simulated data is shown as unavailable; no trade outcome is guaranteed.",
    ASK_COPILOT: "Ask AI Copilot",
    VIEW_PREDICTIONS: "View All Predictions",
  },
  SECTOR_MATRIX: {
    TITLE: "Sector Momentum Matrix",
    SCREEN_SECTORS: "Screen Sectors",
  },
  LAUNCHPAD: {
    ARIA_LABEL: "Workstation Desks Quick Launch",
    SECTION_LABEL: "WORKSTATION MODULES",
    SECTION_TITLE: "Institutional Trading Desks",
    SCREENER_TITLE: "Quantitative Screener",
    SCREENER_DESC: "Scan 2,000+ NSE & BSE stocks for volume surges, RSI extremes, and momentum.",
    SCREENER_ACTION: "Open Desk",
    PREDICTIONS_TITLE: "Prediction Lab & Ledger",
    PREDICTIONS_DESC: "Audit automated signal generation, win-rates, excursions, and outcome logs.",
    PREDICTIONS_ACTION: "Audit Ledger",
    COPILOT_TITLE: "AI Financial Copilot",
    COPILOT_DESC: "Chat with multi-agent consensus models regarding regimes, setups, and Greeks.",
    COPILOT_ACTION: "Launch Chat",
  },
  SPOTLIGHT: {
    SECTION_LABEL: "AUTOMATED MULTI-AGENT INFERENCE",
    TITLE: "Active High-Conviction Signals",
    VIEW_ALL_LEDGER: "View Full Prediction Ledger",
    ENTRY_ZONE: "ENTRY ZONE",
    CURRENT_LTP: "CURRENT LTP",
    TARGET_1: "TARGET 1",
    STOP_LOSS: "STOP LOSS",
    AGENT_CONVICTION: "AGENT CONVICTION",
    INSPECT_TRAJECTORY: "Inspect Trajectory",
    BADGE: "TOP ACTIVE SIGNAL",
    VIEW_TRAJECTORY: "View Full Trajectory →",
    ENTRY: "Entry",
    STOP: "Stop",
    TARGET_2: "Target 2",
    HORIZON: "Horizon",
    THESIS_TITLE: "Algorithmic Thesis & Momentum Drivers:",
  },
  INDICES: {
    TITLE: "Live Benchmark Indices",
    SUBTITLE:
      "Institutional multi-timeframe quotes, tick volatility, and percentage drift across NSE sectoral pillars.",
  },
  INDEX_FILTERS: {
    ALL: "All Benchmarks",
    BROAD_MARKET: "Broad Market",
    FINANCIALS: "Banking & Financials",
    SECTORAL: "Sectoral Leaders",
    VOLATILITY: "Volatility & Macro",
  },
} as const;
