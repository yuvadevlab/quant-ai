/**
 * @file src/lib/ui-copy/portfolio.copy.ts
 * @description Centralized copy for the Portfolio & Risk Desk. */

export const PORTFOLIO_COPY = {
  HEADER: {
    TITLE: "Portfolio Analytics & Risk Engine",
    SUBTITLE:
      "Institutional exposure breakdown, factor sensitivities, beta attribution, and automated stress testing for Indian portfolios.",
  },
  METRICS: {
    NET_VALUE: "Total Monitored Equity",
    PORTFOLIO_BETA: "Portfolio NIFTY Beta",
    MAX_DRAWDOWN: "Historical Max Drawdown",
    VALUE_AT_RISK: "95% 1-Day Parametric VaR",
  },
  SECTIONS: {
    ALLOCATION: "Sector & Asset Class Allocation",
    STRESS_TEST: "Algorithmic Macro Stress Scenarios",
    REBALANCE: "AI Rebalancing Recommendations",
  },
} as const;
