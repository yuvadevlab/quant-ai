/**
 * @file src/lib/ui-copy/predictions.copy.ts
 * @description Centralized copy for the Predictions Lab, performance metrics, and signal ledger.
 * @author yuva.devlab@gmail.com
 */

export const PREDICTIONS_COPY = {
  HEADER: {
    BREADCRUMB_INTELLIGENCE: "INTELLIGENCE",
    TITLE: "Predictions Lab & Accuracy Ledger",
    SUBTITLE:
      "Transparent algorithmic signal ledger with live trajectory comparison, hit-rate validation, and multi-agent confidence tracking.",
    IN_FLIGHT_SUFFIX: "IN-FLIGHT SIGNALS",
    EXPORT_AUDIT: "Export Audit",
    RUN_ANALYSIS: "Run Quant Analysis",
    ANALYZING: "Analyzing Market...",
  },
  KPIS: {
    TOTAL_GENERATED: "TOTAL GENERATED",
    ALL_TIME_BADGE: "ALL TIME",
    ACTIVE_SUFFIX: "active",
    SETTLED_SUFFIX: "settled",
    WIN_RATE: "CALIBRATED WIN RATE",
    DEFAULT_WIN_RATE_BADGE: "+0.0% THIS MONTH",
    TARGETS_HIT_SUFFIX: "targets hit",
    STOPS_SUFFIX: "stops",
    PROFIT_FACTOR: "PROFIT FACTOR",
    PROFIT_FACTOR_BADGE: "RISK ADJUSTED",
    DEFAULT_AVG_GAIN: "+0.0% avg gain",
    DEFAULT_AVG_LOSS: "−0.0% avg loss",
    AVG_RR: "AVG RISK-REWARD",
    POSITIVE_EXPECTANCY: "POSITIVE EXPECTANCY",
    DEFAULT_HOLDING_HINT: "Horizon: Intraday · Swing",
  },
  TOOLBAR: {
    TAB_ALL: "All calls",
    TAB_ACTIVE: "Active",
    TAB_TARGET_HIT: "Target hit",
    TAB_STOP_HIT: "Stop loss hit",
    SEARCH_PLACEHOLDER: "Filter by symbol, instrument, or ID...",
    STYLE_ALL: "All Styles",
    STYLE_INTRADAY: "Intraday",
    STYLE_SWING: "Swing",
    STYLE_OPTIONS: "Options",
  },
  TABLE: {
    ARIA_LABEL: "Signal Audit Table",
    COL_SIGNAL: "SIGNAL & TIMESTAMP",
    COL_INSTRUMENT: "INSTRUMENT",
    COL_STANCE: "STANCE",
    COL_ENTRY: "ENTRY RANGE",
    COL_TARGETS: "TARGET LEVELS",
    COL_STOP: "STOP LOSS",
    COL_LTP: "CURRENT LTP",
    COL_STATUS: "STATUS",
    COL_EXCURSION: "MFE / MAE",
    COL_ACTION: "ACTION",
    INSPECT_ACTION: "Inspect",
  },
  EMPTY: {
    TITLE: "No Algorithmic Predictions Tracked",
    DESCRIPTION:
      "Zero dummy seed data is injected into QuantAI. Trigger a live market analysis scan to evaluate genuine technical setups across active market symbols.",
  },
} as const;
