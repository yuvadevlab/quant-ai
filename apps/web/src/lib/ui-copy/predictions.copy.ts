/**
 * @file src/lib/ui-copy/predictions.copy.ts
 * @description Centralized copy for the Predictions Lab and Signal Ledger. */

export const PREDICTIONS_COPY = {
  HEADER: {
    TITLE: "Predictions Lab & Accuracy Ledger",
    SUBTITLE:
      "Transparent algorithmic signal ledger with live trajectory comparison, hit-rate validation, and multi-agent confidence tracking.",
  },
  FILTERS: {
    ALL_HORIZONS: "All Horizons",
    INTRADAY: "Intraday (1D)",
    SWING: "Swing (1-2W)",
    POSITIONAL: "Positional (1M)",
    ACTIVE_ONLY: "Active Signals Only",
  },
  TABLE: {
    COL_SYMBOL: "Symbol & Horizon",
    COL_DIRECTION: "Bias",
    COL_ENTRY: "Entry Reference",
    COL_TARGET: "Targets (T1 / T2)",
    COL_STOP: "Invalidation Stop",
    COL_CONFIDENCE: "Consensus Confidence",
    COL_STATUS: "Signal Status",
    COL_ACTIONS: "Monitor",
  },
  EMPTY: {
    TITLE: "No Matching Signals Found",
    DESCRIPTION:
      "Adjust horizon filter or search criteria to inspect tracked algorithmic positions.",
  },
} as const;
