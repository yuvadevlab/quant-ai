/**
 * @file apps/api/src/modules/portfolio/portfolio.types.ts
 * @description Type definitions for simulated paper trading portfolio and risk ledgers.
 * @author yuva.devlab@gmail.com
 */

/**
 * Trade position direction.
 */
export enum PositionSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

/**
 * Execution order side.
 */
export enum ExecutionType {
  BUY = "BUY",
  SELL = "SELL",
}

/**
 * Simulated paper position record.
 */
export interface PaperPosition {
  readonly symbol: string;
  readonly instrument: string;
  readonly side: PositionSide;
  readonly qty: number;
  readonly entryPrice: number;
  readonly currentPrice: number;
  readonly pnl: number;
  readonly returnPercent: number;
  readonly stopLoss: number;
  readonly targetPrice: number;
}

/**
 * Simulated execution history entry.
 */
export interface PaperExecution {
  readonly id: string;
  readonly symbol: string;
  readonly type: ExecutionType;
  readonly qty: number;
  readonly entryPrice: number;
  readonly exitPrice: number;
  readonly pnl: number;
  readonly outcome: string;
  readonly timestamp: string;
}

/**
 * Full portfolio ledger summary payload.
 */
export interface PortfolioSummary {
  readonly totalEquity: number;
  readonly initialCapital: number;
  readonly realizedPnl: number;
  readonly unrealizedPnl: number;
  readonly availableMargin: number;
  readonly marginUsed: number;
  readonly winRate: string;
  readonly positions: readonly PaperPosition[];
  readonly recentExecutions: readonly PaperExecution[];
}
