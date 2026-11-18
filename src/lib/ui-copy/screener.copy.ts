/**
 * @file src/lib/ui-copy/screener.copy.ts
 * @description Centralized copy for the Quantitative Screener Desk.
 * @author yuva.devlab@gmail.com
 */

export const SCREENER_COPY = {
  HEADER: {
    TITLE: "Quantitative Screener & Factor Radar",
    SUBTITLE:
      "Algorithmic screening across NSE universe using momentum, mean-reversion, institutional volume anomaly, and volatility filters.",
  },
  PRESETS: {
    HIGH_CONVICTION: "High Conviction Signals (>85%)",
    MOMENTUM_BREAKOUT: "Momentum Breakouts",
    MEAN_REVERSION: "Oversold Mean Reversion",
    OPTIONS_SKEW: "Options IV Anomaly",
  },
  STATS: {
    SCANNED_UNIVERSE: "Scanned Universe",
    MATCHING_SETUPS: "Qualifying Setups",
    AVG_VOLATILITY: "Average Universe IV",
  },
} as const;
