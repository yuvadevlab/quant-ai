/**
 * @file src/features/screener/api/getScreenerData.ts
 * @description Dynamic data provider for the Quantitative Market Screener.
 * Fetches universe items dynamically from the backend screener API.
 * @author yuva.devlab@gmail.com
 */

import { queryOptions } from "@tanstack/react-query";
import { SectorFilter } from "@/constants/market.constants";
import { apiFetch } from "@/lib/api-fetcher";
import type { ScreenerItem as UiScreenerItem } from "@/components/quantai/data";

interface BackendScreenerItem {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  volumeRatio: number;
  rsi: number;
  trend: string;
  breakoutType?: string;
}

export interface ScreenerData {
  readonly items: readonly UiScreenerItem[];
  readonly sectors: readonly string[];
}

function mapBackendToUiScreenerItem(item: BackendScreenerItem): UiScreenerItem {
  const isPos = item.changePercent >= 0;
  return {
    symbol: item.symbol,
    name: item.name,
    sector: item.sector,
    price: `₹${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    change: `${isPos ? "+" : ""}${item.changePercent.toFixed(2)}%`,
    positive: isPos,
    rsi: item.rsi,
    emaStatus: isPos ? "Above 20/50" : "Below 50 EMA",
    oiAction: isPos ? "Long Buildup" : "Short Buildup",
    volumeSurge: `+${Math.round(item.volumeRatio * 25)}%`,
    pattern: item.breakoutType ?? (isPos ? "Momentum Expansion" : "Range Consolidation"),
    signalCandidate:
      item.changePercent >= 1.5
        ? "Strong BUY"
        : item.changePercent >= 0.5
          ? "BUY"
          : item.changePercent <= -1.0
            ? "SELL"
            : "Neutral",
  };
}

/**
 * Fetches quantitative screener records dynamically from the backend API.
 */
export async function getScreenerData(): Promise<ScreenerData> {
  const rawItems = await apiFetch<BackendScreenerItem[]>("/api/screener");
  const items = rawItems && rawItems.length > 0 ? rawItems.map(mapBackendToUiScreenerItem) : [];
  const uniqueSectors = Array.from(new Set(items.map((i) => i.sector))).filter(Boolean);
  const sectors = [SectorFilter.ALL, ...uniqueSectors];

  return {
    items,
    sectors,
  };
}

/**
 * Canonical TanStack Query options for the quantitative screener.
 */
export const screenerQueryOptions = () =>
  queryOptions({
    queryKey: ["screener-data"],
    queryFn: () => getScreenerData(),
    staleTime: 1000 * 15,
  });
