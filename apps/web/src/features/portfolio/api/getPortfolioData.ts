/**
 * @file src/features/portfolio/api/getPortfolioData.ts
 * @description Dynamic data provider for the Paper Portfolio & Risk Desk.
 * Fetches simulated positions and executions from the backend API.
 * @author yuva.devlab@gmail.com
 */

import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-fetcher";

export interface PositionItem {
  readonly symbol: string;
  readonly instrument: string;
  readonly side: "LONG" | "SHORT";
  readonly qty: number;
  readonly entryPrice: number;
  readonly currentPrice: number;
  readonly pnl: number;
  readonly pnlPercent?: number;
  readonly returnPercent?: number;
  readonly stopLoss: number;
  readonly target?: number;
  readonly targetPrice?: number;
  readonly status?: "OPEN" | "CLOSED";
}

export interface ExecutionItem {
  readonly id: string;
  readonly symbol: string;
  readonly type: string;
  readonly qty: number;
  readonly entryPrice?: number;
  readonly price?: string;
  readonly exitPrice?: string | number;
  readonly pnl?: string | number;
  readonly outcome?: string;
  readonly result?: string;
  readonly timestamp?: string;
  readonly time?: string;
}

export interface PortfolioData {
  readonly totalEquity: number;
  readonly initialCapital: number;
  readonly realizedPnl: number;
  readonly unrealizedPnl: number;
  readonly availableMargin: number;
  readonly marginUsed: number;
  readonly winRate: string;
  readonly positions: readonly PositionItem[];
  readonly recentExecutions: readonly ExecutionItem[];
}

const DEFAULT_PORTFOLIO: PortfolioData = {
  totalEquity: 1000000,
  initialCapital: 1000000,
  realizedPnl: 0,
  unrealizedPnl: 0,
  availableMargin: 1000000,
  marginUsed: 0,
  winRate: "0.0%",
  positions: [],
  recentExecutions: [],
};

/**
 * Fetches simulated paper trading portfolio statistics and active positions dynamically from backend.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const data = await apiFetch<PortfolioData>("/api/portfolio");

  if (!data) {
    return DEFAULT_PORTFOLIO;
  }

  return {
    totalEquity: data.totalEquity ?? DEFAULT_PORTFOLIO.totalEquity,
    initialCapital: data.initialCapital ?? DEFAULT_PORTFOLIO.initialCapital,
    realizedPnl: data.realizedPnl ?? DEFAULT_PORTFOLIO.realizedPnl,
    unrealizedPnl: data.unrealizedPnl ?? DEFAULT_PORTFOLIO.unrealizedPnl,
    availableMargin: data.availableMargin ?? DEFAULT_PORTFOLIO.availableMargin,
    marginUsed: data.marginUsed ?? DEFAULT_PORTFOLIO.marginUsed,
    winRate: data.winRate ?? DEFAULT_PORTFOLIO.winRate,
    positions: data.positions ?? [],
    recentExecutions: data.recentExecutions ?? [],
  };
}

/**
 * Query options for TanStack query client.
 */
export const portfolioQueryOptions = () =>
  queryOptions({
    queryKey: ["portfolio-ledger"],
    queryFn: () => getPortfolioData(),
    staleTime: 1000 * 10,
  });
