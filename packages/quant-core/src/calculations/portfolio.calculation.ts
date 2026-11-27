/**
 * @file packages/finance-engine/src/calculations/portfolio.calculation.ts
 * @description Equity marks, margin calculations, and cash reserve formulas.
 */

import { DEFAULT_CURRENCY_DECIMAL_PLACES } from "../constants/technical.constants";

export interface ValuationPosition {
  readonly entryPrice: number;
  readonly qty: number;
  readonly pnl: number;
}

export interface PortfolioValuationOutput {
  readonly totalEquity: number;
  readonly unrealizedPnl: number;
  readonly marginUsed: number;
  readonly availableMargin: number;
}

/**
 * Calculates current paper portfolio valuations, margin utilization, and available trading power.
 */
export function calculatePortfolioValuations(
  initialCapital: number,
  realizedPnl: number,
  positions: readonly ValuationPosition[],
): PortfolioValuationOutput {
  const unrealizedPnl = Number(
    positions.reduce((acc, pos) => acc + pos.pnl, 0).toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES),
  );

  const marginUsed = Number(
    positions
      .reduce((acc, pos) => acc + pos.entryPrice * pos.qty, 0)
      .toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES),
  );

  const totalEquity = Number(
    (initialCapital + realizedPnl + unrealizedPnl).toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES),
  );

  const availableMargin = Math.max(
    0,
    Number((totalEquity - marginUsed).toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES)),
  );

  return {
    totalEquity,
    unrealizedPnl,
    marginUsed,
    availableMargin,
  };
}
