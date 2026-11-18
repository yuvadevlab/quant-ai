/**
 * @file src/features/portfolio/api/getPortfolioData.ts
 * @description Data provider for the Paper Portfolio & Risk Desk.
 */

import { paperPortfolio } from "@/components/quantai/data";

export interface PortfolioData {
  readonly totalEquity: number;
  readonly initialCapital: number;
  readonly realizedPnl: number;
  readonly unrealizedPnl: number;
  readonly availableMargin: number;
  readonly marginUsed: number;
  readonly winRate: string;
  readonly positions: typeof paperPortfolio.positions;
  readonly recentExecutions: typeof paperPortfolio.recentExecutions;
}

/**
 * Fetches simulated paper trading portfolio statistics and active positions.
 *
 * @returns PortfolioData payload
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  return paperPortfolio;
}
