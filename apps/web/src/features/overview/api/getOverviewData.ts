/**
 * @file src/features/overview/api/getOverviewData.ts
 * @description SSR and client data provider for the Executive Market Overview Desk.
 */

import { queryOptions } from "@tanstack/react-query";
import {
  marketBreadth,
  marketTicks,
  sectorPerformance,
  signals,
  type Signal,
} from "@/components/quantai/data";
import type { MarketBreadth, MarketTick, SectorPerformance } from "@/services/market-feed.service";

export interface OverviewDeskData {
  readonly ticks: readonly MarketTick[];
  readonly breadth: MarketBreadth;
  readonly sectors: readonly SectorPerformance[];
  readonly spotlightSignals: readonly Signal[];
}

/**
 * Fetches executive market desk data for server-side rendering and client refreshes.
 *
 * @returns OverviewDeskData payload
 */
export async function getOverviewData(): Promise<OverviewDeskData> {
  const activeSignals = signals.filter((s) => s.status === "Active").slice(0, 3);

  return {
    ticks: marketTicks.filter((t) => !t.isVix) as unknown as readonly MarketTick[],
    breadth: marketBreadth as unknown as MarketBreadth,
    sectors: sectorPerformance as unknown as readonly SectorPerformance[],
    spotlightSignals: activeSignals,
  };
}

/**
 * Canonical TanStack Query options for the overview market desk.
 */
export const overviewQueryOptions = () =>
  queryOptions({
    queryKey: ["overview-desk"],
    queryFn: () => getOverviewData(),
    staleTime: 1000 * 30,
  });
