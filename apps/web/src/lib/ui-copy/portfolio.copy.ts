/**
 * @file src/lib/ui-copy/portfolio.copy.ts
 * @description Centralized copy for the Paper Portfolio & Risk Desk.
 * @author yuva.devlab@gmail.com
 */

export const PORTFOLIO_COPY = {
  HEADER: {
    BREADCRUMB_TRADING_DESK: "TRADING DESK",
    TITLE: "Paper Portfolio & Execution Risk Desk",
    SUBTITLE:
      "Simulated capital allocations, live mark-to-market positions, automated risk parameters, and order fill history.",
    SIMULATION_STATUS: "SIMULATION ACTIVE",
    CAPITAL_SUFFIX: "CAPITAL",
  },
  KPIS: {
    TOTAL_EQUITY: "TOTAL EQUITY",
    TOTAL_RETURN_SUFFIX: "total return",
    UNREALIZED_PNL: "UNREALIZED P&L",
    OPEN_POSITIONS_SUBTEXT: "Across open paper positions",
    REALIZED_PNL: "REALIZED P&L",
    WIN_RATE_PREFIX: "Win Rate",
    AVAILABLE_MARGIN: "AVAILABLE MARGIN",
    MARGIN_USED_PREFIX: "Margin Used:",
  },
  POSITIONS_TABLE: {
    TITLE: "Active Simulated Positions",
    PILL_SUFFIX: "Open Positions",
    ARIA_LABEL: "Open Positions",
    COL_INSTRUMENT: "INSTRUMENT",
    COL_SIDE: "SIDE",
    COL_QTY: "QTY",
    COL_AVG_ENTRY: "AVG ENTRY",
    COL_LTP: "CURRENT LTP",
    COL_PNL: "P&L (₹)",
    COL_RETURN: "RETURN (%)",
    COL_STOP: "STOP LOSS",
    COL_TARGET: "TARGET",
    COL_ACTION: "ACTION",
    SIMULATE_EXIT_BTN: "Simulate Exit",
  },
  ORDERS_TABLE: {
    TITLE: "Completed Orders Audit Log",
    PILL: "Historical Executions",
    ARIA_LABEL: "Order Audit Log",
    COL_ORDER_ID: "ORDER ID",
    COL_INSTRUMENT: "INSTRUMENT",
    COL_SIDE: "SIDE",
    COL_QTY: "QTY",
    COL_ENTRY: "ENTRY PRICE",
    COL_EXIT: "EXIT PRICE",
    COL_PNL: "REALIZED P&L",
    COL_OUTCOME: "OUTCOME",
    COL_TIME: "EXECUTION TIME",
  },
} as const;
