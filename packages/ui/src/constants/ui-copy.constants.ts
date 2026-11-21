/**
 * @file packages/ui/src/constants/ui-copy.constants.ts
 * @description Centralized UI copy dictionary for reusable components in @quant-ai/ui.
 * Adheres to Rule 5 (Package-level isolation) and Rule 6 (Zero hardcoded strings).
 * @author yuva.devlab@gmail.com
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
    FILLED_PREFIX: "Filled:",
    CURRENT_LTP: "CURRENT LTP",
    TARGET_1_LEVEL: "TARGET 1 LEVEL",
    TARGET_1_FOOTER: "+1.34% target upside",
    TARGET_2_LEVEL: "TARGET 2 LEVEL",
    TARGET_2_FOOTER: "+2.38% extended target",
    STOP_LOSS: "STOP LOSS",
    STOP_LOSS_FOOTER: "−0.84% max risk",
    AGENT_CONVICTION: "AGENT CONVICTION",
    RISK_REWARD_PREFIX: "Risk/Reward",
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
  },
  INVALIDATION_CARD: {
    DEFAULT_TITLE: "Automated Invalidation Rule",
  },
  CONFIDENCE_METER: {
    LABEL: "MODEL CONFIDENCE",
  },
} as const;

export type UiCopyConstantsCatalog = typeof UI_COPY_CONSTANTS;
