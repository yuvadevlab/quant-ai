/**
 * @file src/features/overview/api/getOverviewData.ts
 * @description Dynamic SSR and client data provider for the Executive Market Overview Desk.
 * Fetches real-time benchmark indices, breadth, sectors, and multi-asset predictions from backend.
 */

import { queryOptions } from "@tanstack/react-query";
import type { IndexQuote, Signal as BackendSignal } from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";
import {
  DEFAULT_BREADTH,
  mapIndexQuoteToTick,
  type MarketBreadth,
  type MarketTick,
  type SectorPerformance,
} from "@/services/market-feed.service";
import type { Signal } from "@/components/quantai/data";
import { mapBackendSignalToUi } from "@/features/predictions/api/getPredictionsData";

export interface OverviewDeskData {
  readonly ticks: readonly MarketTick[];
  readonly breadth: MarketBreadth;
  readonly sectors: readonly SectorPerformance[];
  readonly spotlightSignals: readonly Signal[];
}

/**
 * Fetches executive market desk data dynamically from backend API.
 */
export async function getOverviewData(): Promise<OverviewDeskData> {
  const [rawIndices, rawBreadth, rawSectors, rawPredictions] = await Promise.all([
    apiFetch<IndexQuote[]>("/api/market/indices"),
    apiFetch<MarketBreadth>("/api/market/breadth"),
    apiFetch<SectorPerformance[]>("/api/market/sectors"),
    apiFetch<BackendSignal[]>("/api/predictions"),
  ]);

  const ticks = rawIndices && rawIndices.length > 0 ? rawIndices.map(mapIndexQuoteToTick) : [];
  const breadth = rawBreadth ?? DEFAULT_BREADTH;
  const sectors = rawSectors ?? [];
  const spotlightSignals =
    rawPredictions && rawPredictions.length > 0
      ? rawPredictions.slice(0, 3).map(mapBackendSignalToUi)
      : [];

  return {
    ticks,
    breadth,
    sectors,
    spotlightSignals,
  };
}

/**
 * Canonical TanStack Query options for the overview market desk.
 */
export const overviewQueryOptions = () =>
  queryOptions({
    queryKey: ["overview-desk"],
    queryFn: () => getOverviewData(),
    staleTime: 1000 * 10,
  });
