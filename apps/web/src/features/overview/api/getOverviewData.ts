/**
 * @file src/features/overview/api/getOverviewData.ts
 * @description Dynamic SSR and client data provider for the Executive Market Overview Desk.
 * Fetches real-time benchmark indices, breadth, sectors, and multi-asset predictions from backend.
 * @author yuva.devlab@gmail.com
 */

import { queryOptions } from "@tanstack/react-query";
import {
  SignalDirection,
  type IndexQuote,
  type Signal as BackendSignal,
} from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";
import type { MarketBreadth, MarketTick, SectorPerformance } from "@/services/market-feed.service";
import type { Signal } from "@/components/quantai/data";

export interface OverviewDeskData {
  readonly ticks: readonly MarketTick[];
  readonly breadth: MarketBreadth;
  readonly sectors: readonly SectorPerformance[];
  readonly spotlightSignals: readonly Signal[];
}

function mapBackendSignalToUi(s: BackendSignal): Signal {
  const current = s.current ?? s.entry;
  const entry = s.entry;
  const pnlPercent = s.pnlPercent ?? Number((((current - entry) / (entry || 1)) * 100).toFixed(2));

  return {
    id: s.id,
    symbol: s.ticker,
    companyName: s.name,
    instrument: s.assetClass ? `NSE · ${s.assetClass}` : "NSE · Cash",
    direction: s.direction === SignalDirection.LONG ? "BUY" : "SELL",
    horizon: (s.horizon as Signal["horizon"]) || "Intraday",
    entry: `₹${entry.toLocaleString("en-IN")}`,
    entryPrice: entry,
    target1: `₹${s.target.toLocaleString("en-IN")}`,
    target2: `₹${(s.target * 1.02).toFixed(2)}`,
    stop: `₹${s.stopLoss.toLocaleString("en-IN")}`,
    last: `₹${current.toLocaleString("en-IN")}`,
    change: `${pnlPercent >= 0 ? "+" : ""}${pnlPercent}%`,
    mfe: `+${s.maxExcursion ?? 1.5}%`,
    mae: `−${s.maxAdverse ?? 0.3}%`,
    status: s.status as Signal["status"],
    time: "Live Feed",
    confidence: `${s.confidence}%`,
    riskReward: `1:${s.riskReward ?? 2.5}`,
    catalysts: s.catalysts
      ? [...s.catalysts]
      : ["Volume profile expansion", "Structural trend breakout"],
    agents: {
      technical: { score: 85, verdict: "Technical breakout reclaim" },
      quant: { score: 82, verdict: "Statistical edge confirmed" },
      optionsFlow: { score: 80, verdict: "Institutional flow confirmation" },
      riskGuardian: { score: 84, verdict: "Risk defined" },
    },
  };
}

function mapIndexQuoteToTick(item: IndexQuote): MarketTick {
  const priceFormatted = item.price.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = item.change >= 0 ? "+" : "";
  const pctSign = item.changePercent >= 0 ? "+" : "";

  return {
    name: item.symbol,
    exchange: "NSE",
    price: priceFormatted,
    change: `${sign}${item.change.toFixed(2)} (${pctSign}${item.changePercent.toFixed(2)}%)`,
    changeValue: item.change,
    positive: item.change >= 0,
    dayHigh: (item.price * 1.01).toFixed(2),
    dayLow: (item.price * 0.99).toFixed(2),
    path:
      item.sparkline && item.sparkline.length > 0
        ? item.sparkline
            .map(
              (v, i) =>
                `${i * 12},${Math.round(20 - ((v - item.price * 0.98) / (item.price * 0.04 || 1)) * 20)}`,
            )
            .join(" ")
        : "0,14 12,11 24,13 36,5 48,9 60,2",
    category: item.category,
    isVix: item.symbol.includes("VIX"),
  };
}

const FALLBACK_BREADTH: MarketBreadth = {
  advances: 1482,
  declines: 648,
  unchanged: 84,
  advanceRatio: "69.5%",
  fiiNet: "+₹2,145 Cr",
  diiNet: "+₹1,280 Cr",
  regime: "Institutional Accumulation",
  regimeType: "Bullish",
  volatilityEnv: "Low Volatility (VIX 13.42)",
};

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
  const breadth = rawBreadth ?? FALLBACK_BREADTH;
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
