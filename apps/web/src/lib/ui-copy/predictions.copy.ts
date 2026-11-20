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
  },
  KPIS: {
    TOTAL_GENERATED: "TOTAL GENERATED",
    ALL_TIME_BADGE: "ALL TIME",
    ACTIVE_SUFFIX: "active",
    SETTLED_SUFFIX: "settled",
    WIN_RATE: "CALIBRATED WIN RATE",
    WIN_RATE_BADGE: "+3.2% THIS MONTH",
    TARGETS_HIT_SUFFIX: "targets hit",
    STOPS_SUFFIX: "stops",
    PROFIT_FACTOR: "PROFIT FACTOR",
    PROFIT_FACTOR_BADGE: "RISK ADJUSTED",
    AVG_GAIN: "+3.6% avg gain",
    AVG_LOSS: "−1.2% avg loss",
    AVG_RR: "AVG RISK-REWARD",
    POSITIVE_EXPECTANCY: "POSITIVE EXPECTANCY",
    HOLDING_HINT: "Avg holding: 42m (Intraday) / 4d (Swing)",
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
    TITLE: "No Matching Signals Found",
    DESCRIPTION:
      "Adjust your horizon filter or search criteria to inspect tracked algorithmic positions.",
  },
} as const;
