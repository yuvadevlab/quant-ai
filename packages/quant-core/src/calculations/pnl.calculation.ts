/**
 * @file packages/finance-engine/src/calculations/pnl.calculation.ts
 * @description Deterministic profit and loss (PnL), returns, and performance metrics.
 * @author yuva.devlab@gmail.com
 */

import {
  DEFAULT_CURRENCY_DECIMAL_PLACES,
  DEFAULT_PERCENT_DECIMAL_PLACES,
  PERCENTAGE_MULTIPLIER,
} from "../constants/technical.constants";

export enum TradePositionSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

/**
 * Calculates absolute unrealized PnL based on position side.
 *
 * @param entryPrice - Average fill entry price.
 * @param currentPrice - Current mark-to-market market price.
 * @param quantity - Number of shares or derivative contracts.
 * @param side - TradePositionSide (LONG or SHORT).
 * @returns Absolute PnL currency value.
 */
export function calculateUnrealizedPnl(
  entryPrice: number,
  currentPrice: number,
  quantity: number,
  side: TradePositionSide = TradePositionSide.LONG,
): number {
  const priceDifference =
    side === TradePositionSide.LONG ? currentPrice - entryPrice : entryPrice - currentPrice;

  return Number((priceDifference * quantity).toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES));
}

/**
 * Calculates percentage return on investment.
 *
 * @param entryPrice - Entry fill price.
 * @param currentPrice - Current mark price.
 * @param side - TradePositionSide.
 * @returns Percentage return rounded to 2 decimal places.
 */
export function calculateReturnPercent(
  entryPrice: number,
  currentPrice: number,
  side: TradePositionSide = TradePositionSide.LONG,
): number {
  if (entryPrice <= 0) return 0;
  const priceDifference =
    side === TradePositionSide.LONG ? currentPrice - entryPrice : entryPrice - currentPrice;

  const returnRatio = priceDifference / entryPrice;
  return Number((returnRatio * PERCENTAGE_MULTIPLIER).toFixed(DEFAULT_PERCENT_DECIMAL_PLACES));
}

/**
 * Calculates historical win rate percentage from executed trades.
 *
 * @param winningTradesCount - Number of trades with net positive PnL.
 * @param totalTradesCount - Total number of closed executions.
 * @returns Formatted percentage string (e.g. "78.4%") or "0.0%".
 */
export function calculateWinRate(winningTradesCount: number, totalTradesCount: number): string {
  if (totalTradesCount <= 0) {
    return "0.0%";
  }
  const ratio = (winningTradesCount / totalTradesCount) * PERCENTAGE_MULTIPLIER;
  return `${ratio.toFixed(1)}%`;
}
