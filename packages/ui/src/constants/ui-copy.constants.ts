/**
 * @file packages/ui/src/constants/ui-copy.constants.ts
 * @description Centralized UI copy dictionary for reusable components in @quant-ai/ui.
 * Adheres to Rule 5 (Package-level isolation) and Rule 6 (Zero hardcoded strings).
 */

export const UI_COPY_CONSTANTS = {
  BRAND: {
    NAME: "QuantAI",
    TAGLINE: "Algorithmic Precision for Indian Financial Markets",
    PREFIX: "Quant",
    SUFFIX: "AI",
    MARKET_BADGE: "NSE · BSE",
  },
  SIGNAL_CARD: {
    CONVICTION: "CONVICTION",
    VIEW_TRAJECTORY: "Inspect Live Trajectory",
  },
  MONITOR_KPI_GRID: {
    ENTRY_ZONE: "ENTRY ZONE",
    ENTRY_REFERENCE_PREFIX: "Recorded entry:",
    TARGET_1_LEVEL: "TARGET 1 LEVEL",
    TARGET_2_LEVEL: "TARGET 2 LEVEL",
    STOP_LOSS: "STOP LOSS",
    MODEL_CONFIDENCE: "HEURISTIC SCORE",
    RISK_REWARD_PREFIX: "Risk/Reward",
    RECORDED_PRICE: "RECORDED PRICE",
  },
  SIGNAL_HEADER: {
    BUY_LABEL: "BUY · BULLISH",
    SELL_LABEL: "SELL · BEARISH",
    HORIZON_SUFFIX: "Horizon",
    SUBTITLE_SUFFIX:
      "— Automated multi-agent trajectory tracking, cone projections, and real-time excursion monitoring.",
  },
  MARKET_BREADTH: {
    TITLE: "Market Breadth & Institutional Flows",
    ADVANCES: "ADVANCES",
    DECLINES: "DECLINES",
    FII_NET_FLOW: "FII NET FLOW",
    DII_NET_FLOW: "DII NET FLOW",
    OF_MARKET: "of market",
    FII_SUB: "Strong Foreign Inflow",
    DII_SUB: "Domestic Support",
    DEFAULT_UNIVERSE: "NSE 2,214 Stocks",
    UNIVERSE_UNAVAILABLE: "Source unavailable",
    DATA_UNAVAILABLE: "Verified constituent breadth and institutional-flow data are not connected.",
    SECTORS_UNAVAILABLE: "Sector movement is unavailable until provider data can be verified.",
  },
  MARKET_DATA: {
    VERIFIED: "Verified",
    PROVIDER_UNVERIFIED: "Provider data · unverified",
    MARKET_CLOSED: "Latest session close",
    STALE: "Stale quote",
    SIMULATED: "Sample data hidden",
    UNAVAILABLE: "Market data unavailable",
    AS_OF: "As of",
  },
  INVALIDATION_CARD: {
    DEFAULT_TITLE: "Automated Invalidation Rule",
  },
  CONFIDENCE_METER: {
    LABEL: "MODEL CONFIDENCE",
  },
  RECOMMENDATION_CARD: {
    CURRENT_PRICE: "Current price",
    TARGET: "Target",
    STOP_LOSS: "Stop loss",
    MODEL_CONFIDENCE: "Heuristic score",
    RATIONALE_TITLE: "Recorded research rationale",
    RATIONALE_UNAVAILABLE: "No research rationale was recorded for this prediction.",
    PROVENANCE_UNAVAILABLE: "Data provenance unavailable",
    HORIZON_SUFFIX: "horizon",
    RISK_REWARD_PREFIX: "Risk/reward",
    INSPECT: "Inspect",
  },
  PREDICTIONS_KPI_GRID: {
    ARIA_LABEL: "Prediction performance metrics",
    TOTAL_GENERATED: "TOTAL GENERATED",
    ALL_TIME: "ALL-TIME",
    ACTIVE_SUFFIX: "active",
    SETTLED_SUFFIX: "settled",
    WIN_RATE: "WIN RATE",
    TARGETS_HIT_SUFFIX: "targets hit",
    STOPS_SUFFIX: "stops",
    PROFIT_FACTOR: "PROFIT FACTOR",
    AVG_GAIN_SUFFIX: "avg gain",
    AVG_LOSS_SUFFIX: "avg loss",
    AVG_RISK_REWARD: "AVG RISK / REWARD",
  },
  MONITOR_CHART: {
    TITLE: "PRICE HISTORY",
    UNAVAILABLE:
      "Provider-supplied price history is unavailable. The chart is hidden rather than showing generated market prices.",
  },
  PREDICTION_ACCURACY_RIBBON: {
    ARIA_LABEL: "Verified prediction performance metrics",
    WIN_RATE: "VERIFIED WIN RATE",
    TARGETS_HIT: "eligible targets hit",
    STOPS: "eligible stops",
    PROFIT_FACTOR: "PROFIT FACTOR",
    ELIGIBLE_OUTCOMES_ONLY: "Calculated from eligible completed outcomes only",
  },
} as const;

export type UiCopyConstantsCatalog = typeof UI_COPY_CONSTANTS;
