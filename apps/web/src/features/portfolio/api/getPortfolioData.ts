/**
 * @file src/features/portfolio/api/getPortfolioData.ts
 * @description Data provider for the Paper Portfolio & Risk Desk.
 * @author yuva.devlab@gmail.com
 */

import { queryOptions } from "@tanstack/react-query";
import { WEB_ENV } from "@/constants/env.constants";
import { ApiRoute } from "@/constants/routes.constants";
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
 * Fetches simulated paper trading portfolio statistics and active positions from backend.
 * Falls back to paperPortfolio baseline if backend service is unreachable.
 *
 * @returns PortfolioData payload
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const endpoint = `${WEB_ENV.VITE_API_URL}${ApiRoute.PORTFOLIO}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      return paperPortfolio;
    }

    const data = (await res.json()) as PortfolioData;
    return {
      totalEquity: data.totalEquity ?? paperPortfolio.totalEquity,
      initialCapital: data.initialCapital ?? paperPortfolio.initialCapital,
      realizedPnl: data.realizedPnl ?? paperPortfolio.realizedPnl,
      unrealizedPnl: data.unrealizedPnl ?? paperPortfolio.unrealizedPnl,
      availableMargin: data.availableMargin ?? paperPortfolio.availableMargin,
      marginUsed: data.marginUsed ?? paperPortfolio.marginUsed,
      winRate: data.winRate ?? paperPortfolio.winRate,
      positions: (data.positions?.length ?? 0) > 0 ? data.positions : paperPortfolio.positions,
      recentExecutions:
        (data.recentExecutions?.length ?? 0) > 0
          ? data.recentExecutions
          : paperPortfolio.recentExecutions,
    };
  } catch {
    return paperPortfolio;
  }
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
