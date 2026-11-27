/**
 * @file src/lib/ui-copy/monitor.copy.ts
 * @description Centralized copy for the Live Trajectory Monitor Desk.
 */

export const MONITOR_COPY = {
  DATA_PROVENANCE_UNAVAILABLE: "Data provenance unavailable",
  HEADER: {
    BREADCRUMB_BACK: "Prediction Ledger",
    SPECIALISTS_COUNT: "3 Specialized Agents",
    LIVE_STREAM_ACTIVE: "Live Stream Active",
    STREAM_CONNECTED: "Stream Connected",
    TRIGGER_DELIBERATION: "Trigger AI Deliberation",
    DELIBERATING: "Deliberating...",
    TRIGGER_TOOLTIP: "Trigger on-demand multi-agent adversarial debate",
  },
  DELIBERATION: {
    TITLE: "Multi-Agent Deliberation Breakdown",
    SUBTITLE:
      "Recorded on-demand agent responses for this prediction. No responses are shown until an analysis is run.",
    RESPONSES_RECORDED: "responses recorded",
    NO_RESPONSES: "No deliberation recorded",
    EMPTY: "Run an on-demand analysis to record agent responses for this prediction.",
  },
  CONE: {
    TITLE: "Real-time Predictive Trajectory Cone",
    SUBTITLE: "Actual price path vs. predicted confidence bounds and expected path to Target 1.",
    LEGEND_ACTUAL: "Actual Price",
    LEGEND_EXPECTED: "Expected Path",
    LEGEND_CONE: "Predictive Cone",
    LEGEND_TARGET: "Target 1",
    LEGEND_STOP: "Stop Loss",
    MFE_LABEL: "MAX FAVORABLE EXCURSION (MFE)",
    MFE_SUBTEXT: "Peak ₹2,449.60",
    MAE_LABEL: "MAX ADVERSE EXCURSION (MAE)",
    MAE_SUBTEXT: "Trough ₹2,417.10",
    ALIGNMENT_LABEL: "TRAJECTORY ALIGNMENT",
    ALIGNMENT_SUBTEXT: "Within Upper Cone",
    PROGRESS_LABEL: "PROGRESS TO TARGET 1",
    PROGRESS_SUBTEXT: "68% completed",
  },
  INVALIDATION: {
    TITLE: "Automated Invalidation Rule",
    DESCRIPTION_PREFIX: "If a 15-minute candle closes below",
    DESCRIPTION_SUFFIX:
      "or if Call Open Interest surges by > 35% on the immediate strike, the trade hypothesis is invalidated immediately.",
    ACTION_PREFIX: "Ask Copilot about",
  },
} as const;
