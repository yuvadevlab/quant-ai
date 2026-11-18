/**
 * @file src/lib/ui-copy/monitor.copy.ts
 * @description Centralized copy for the Live Trajectory Monitor Desk.
 * @author yuva.devlab@gmail.com
 */

export const MONITOR_COPY = {
  HEADER: {
    BACK_LINK: "← Back to Predictions Lab",
    LIVE_INDICATOR: "LIVE ACCURACY SURVEILLANCE",
  },
  METRICS: {
    ENTRY_PRICE: "Entry Reference Price",
    CURRENT_PRICE: "Current Market Price",
    TARGET_1: "Primary Target (T1)",
    TARGET_2: "Extended Target (T2)",
    STOP_LOSS: "Hard Invalidation Stop",
    RISK_REWARD: "Risk to Reward Ratio",
    PROGRESS_PCT: "Target Path Completion",
  },
  CHART: {
    TITLE: "Live Actual vs Predicted Monte Carlo Cone",
    SUBTITLE: "Real-time tick overlay against machine learning forecasted volatility band.",
    LEGEND_ACTUAL: "Actual Market Price",
    LEGEND_EXPECTED: "Expected Mean Trajectory",
    LEGEND_CONE: "90% Confidence Interval",
  },
  DELIBERATION: {
    TITLE: "Multi-Agent Consensus Deliberation",
    SUBTITLE: "Individual agent probability weightings and architectural rationale.",
    AGENT_MACRO: "Macro & Rates Agent",
    AGENT_MOMENTUM: "Technical & Order-Flow Agent",
    AGENT_VOLATILITY: "Volatility Surface & Greeks Agent",
    AGENT_SYNTHESIS: "Chief Strategy Synthesis",
  },
} as const;
