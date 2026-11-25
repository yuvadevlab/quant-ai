/**
 * @file src/services/market-feed.service.ts
 * @description Centralized market data feed service for Indian financial benchmarks (NSE & BSE).
 * Fetches dynamic quotes, breadth, and sector momentum directly from backend API.
 * @author yuva.devlab@gmail.com
 */

import { useQuery } from "@tanstack/react-query";
import { MarketDataStatus, type IndexCategory, type IndexQuote } from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";

export interface MarketTick {
  readonly name: string;
  readonly exchange: "NSE" | "BSE";
  readonly price: string;
  readonly change: string;
  readonly changeValue: number;
  readonly positive: boolean;
  readonly dayHigh: string;
  readonly dayLow: string;
  readonly path: string;
  readonly dataStatus: MarketDataStatus;
  readonly dataSource?: string;
  readonly observedAt?: string;
  readonly isVix?: boolean;
  readonly category?: IndexCategory;
}

export interface MarketBreadth {
  readonly dataAvailable: boolean;
  readonly advances: number | null;
  readonly declines: number | null;
  readonly unchanged: number | null;
  readonly advanceRatio: string | null;
  readonly fiiNet: string | null;
  readonly diiNet: string | null;
  readonly regime: string;
  readonly regimeType: string;
  readonly volatilityEnv: string;
}

export interface SectorPerformance {
  readonly name: string;
  readonly change: string;
  readonly positive: boolean;
  readonly momentum: "Strong" | "Moderate" | "Neutral" | "Weak";
}

export const DEFAULT_BREADTH: MarketBreadth = {
  dataAvailable: false,
  advances: null,
  declines: null,
  unchanged: null,
  advanceRatio: null,
  fiiNet: null,
  diiNet: null,
  regime: "Unavailable",
  regimeType: "Unavailable",
  volatilityEnv: "Market breadth source unavailable",
};

export function mapIndexQuoteToTick(item: IndexQuote): MarketTick {
  const dataStatus = item.dataStatus ?? MarketDataStatus.UNAVAILABLE;
  const hasMarketPrice =
    dataStatus !== MarketDataStatus.SIMULATED &&
    dataStatus !== MarketDataStatus.UNAVAILABLE &&
    item.price > 0;
  const priceFormatted = hasMarketPrice
    ? item.price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";
  const sign = item.change >= 0 ? "+" : "";
  const pctSign = item.changePercent >= 0 ? "+" : "";

  return {
    name: item.symbol,
    exchange: "NSE",
    price: priceFormatted,
    change: hasMarketPrice
      ? `${sign}${item.change.toFixed(2)} (${pctSign}${item.changePercent.toFixed(2)}%)`
      : "—",
    changeValue: item.change,
    positive: item.change >= 0,
    dayHigh: "—",
    dayLow: "—",
    path:
      hasMarketPrice && item.sparkline && item.sparkline.length > 0
        ? item.sparkline
            .map(
              (v, i) =>
                `${i * 12},${Math.round(20 - ((v - item.price * 0.98) / (item.price * 0.04 || 1)) * 20)}`,
            )
            .join(" ")
        : "",
    dataStatus,
    ...(item.dataSource ? { dataSource: item.dataSource } : {}),
    ...(item.observedAt ? { observedAt: item.observedAt } : {}),
    category: item.category,
    isVix: item.symbol.includes("VIX"),
  };
}

/**
 * Hook to retrieve dynamic benchmark indices from backend.
 */
export function useBenchmarkTicks() {
  return useQuery<MarketTick[]>({
    queryKey: ["market-indices"],
    queryFn: async () => {
      const data = await apiFetch<IndexQuote[]>("/api/market/indices");
      return data && data.length > 0 ? data.map(mapIndexQuoteToTick) : [];
    },
    staleTime: 1000 * 10,
  });
}

/**
 * Hook to retrieve dynamic market breadth and flows from backend.
 */
export function useMarketBreadth() {
  return useQuery<MarketBreadth>({
    queryKey: ["market-breadth"],
    queryFn: async () => {
      const data = await apiFetch<MarketBreadth>("/api/market/breadth");
      return data ?? DEFAULT_BREADTH;
    },
    staleTime: 1000 * 10,
  });
}

/**
 * Hook to retrieve dynamic sector performance matrix from backend.
 */
export function useSectorPerformance() {
  return useQuery<SectorPerformance[]>({
    queryKey: ["market-sectors"],
    queryFn: async () => {
      const data = await apiFetch<SectorPerformance[]>("/api/market/sectors");
      return data ?? [];
    },
    staleTime: 1000 * 10,
  });
}

/**
 * Fallback synchronous accessor.
 */
export function getMarketBreadth(): MarketBreadth {
  return DEFAULT_BREADTH;
}

/**
 * Fallback synchronous accessor.
 */
export function getBenchmarkTicks(): readonly MarketTick[] {
  return [];
}

/**
 * Fallback synchronous accessor.
 */
export function getSectorPerformance(): readonly SectorPerformance[] {
  return [];
}
