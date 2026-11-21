/**
 * @file src/lib/ui-copy/screener.copy.ts
 * @description Centralized copy for the Quantitative Screener Desk.
 * @author yuva.devlab@gmail.com
 */

export const SCREENER_COPY = {
  HEADER: {
    BREADCRUMB_MARKET_DESK: "MARKET DESK",
    TITLE: "Quantitative Screener & Factor Radar",
    SUBTITLE:
      "Algorithmic screening across NSE universe using momentum, mean-reversion, institutional volume anomaly, and volatility filters.",
    ASK_COPILOT: "Ask Copilot to Screen",
  },
  TOOLBAR: {
    TAB_ALL: "All Setups",
    TAB_BREAKOUTS: "Breakouts",
    TAB_OPTIONS: "Options OI Surges",
    TAB_MOMENTUM: "High Momentum (RSI > 60)",
    SEARCH_PLACEHOLDER: "Search symbol, pattern, thesis...",
    SECTOR_LABEL: "SECTOR:",
    ALL_SECTORS: "All Sectors",
  },
  TABLE: {
    ARIA_LABEL: "Screener Results",
    COL_SYMBOL: "SYMBOL & NAME",
    COL_SECTOR: "SECTOR",
    COL_PRICE: "LTP & CHANGE",
    COL_PATTERN: "PATTERN DETECTED",
    COL_RSI: "RSI (14)",
    COL_EMA: "EMA STRUCTURE",
    COL_OI: "OPTIONS OI ACTION",
    COL_VOLUME: "VOLUME SURGE",
    COL_CANDIDATE: "AI CANDIDATE",
    COL_ACTION: "ACTION",
    ANALYZE_ACTION: "Analyze",
    ANALYZE_TITLE_PREFIX: "Analyze",
    ANALYZE_TITLE_SUFFIX: "with AI Copilot",
    EMPTY_STATE: "No screener candidates matched the selected filters.",
  },
} as const;
