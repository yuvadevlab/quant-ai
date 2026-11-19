/**
 * @file src/features/overview/api/getOverviewData.ts
 * @description SSR and client data provider for the Executive Market Overview Desk.
 */

import { queryOptions } from "@tanstack/react-query";
import {
  marketBreadth,
  sectorPerformance,
  signals,
  UiSignalStatus,
  type Signal,
} from "@/components/quantai/data";
import {
  getBenchmarkTicks,
  type MarketBreadth,
  type MarketTick,
  type SectorPerformance,
} from "@/services/market-feed.service";

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
  const activeSignals = signals.filter((s) => s.status === UiSignalStatus.ACTIVE).slice(0, 3);

  return {
    ticks: getBenchmarkTicks(),
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
