/**
 * @file src/services/market-feed.service.ts
 * @description Centralized market data feed service for Indian financial benchmarks (NSE & BSE).
 * Decouples presentation components from live WebSockets or mock feeds.
 * Author: yuva.devlab@gmail.com
 */

import { IndexCategory } from "@quant-ai/shared-types";

/**
 * Benchmark Index Tick definition.
 */
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
  readonly isVix?: boolean;
  readonly category?: IndexCategory;
}

/**
 * Market Breadth & Flow snapshot.
 */
export interface MarketBreadth {
  readonly advances: number;
  readonly declines: number;
  readonly unchanged: number;
  readonly advanceRatio: string;
  readonly fiiNet: string;
  readonly diiNet: string;
  readonly regime: string;
  readonly regimeType: string;
  readonly volatilityEnv: string;
}

/**
 * Sector momentum indicator.
 */
export interface SectorPerformance {
  readonly name: string;
  readonly change: string;
  readonly positive: boolean;
  readonly momentum: "Strong" | "Moderate" | "Neutral" | "Weak";
}

const BENCHMARK_TICKS: readonly MarketTick[] = [
  // ─── Broad Market Tiers ──────────────────────────────────────────────────
  {
    name: "NIFTY 50",
    exchange: "NSE",
    price: "24,350.25",
    change: "+142.80 (+0.59%)",
    changeValue: 142.8,
    positive: true,
    dayHigh: "24,380.00",
    dayLow: "24,210.00",
    path: "0,14 12,11 24,13 36,5 48,9 60,2",
    category: IndexCategory.BROAD_MARKET,
  },
  {
    name: "NIFTY NEXT 50",
    exchange: "NSE",
    price: "71,240.10",
    change: "+620.40 (+0.88%)",
    changeValue: 620.4,
    positive: true,
    dayHigh: "71,380.00",
    dayLow: "70,600.00",
    path: "0,15 12,12 24,10 36,7 48,4 60,1",
    category: IndexCategory.BROAD_MARKET,
  },
  {
    name: "NIFTY MIDCAP 100",
    exchange: "NSE",
    price: "58,650.30",
    change: "+715.20 (+1.23%)",
    changeValue: 715.2,
    positive: true,
    dayHigh: "58,720.00",
    dayLow: "57,900.00",
    path: "0,16 12,13 24,9 36,8 48,3 60,0",
    category: IndexCategory.BROAD_MARKET,
  },
  {
    name: "NIFTY SMALLCAP 100",
    exchange: "NSE",
    price: "18,920.85",
    change: "+285.40 (+1.53%)",
    changeValue: 285.4,
    positive: true,
    dayHigh: "18,980.00",
    dayLow: "18,620.00",
    path: "0,15 12,11 24,8 36,6 48,3 60,1",
    category: IndexCategory.BROAD_MARKET,
  },
  {
    name: "SENSEX",
    exchange: "BSE",
    price: "80,110.60",
    change: "+412.30 (+0.52%)",
    changeValue: 412.3,
    positive: true,
    dayHigh: "80,240.00",
    dayLow: "79,700.00",
    path: "0,13 12,10 24,11 36,6 48,8 60,4",
    category: IndexCategory.BROAD_MARKET,
  },

  // ─── Banking & Financials ────────────────────────────────────────────────
  {
    name: "BANKNIFTY",
    exchange: "NSE",
    price: "52,180.40",
    change: "−85.20 (−0.16%)",
    changeValue: -85.2,
    positive: false,
    dayHigh: "52,350.00",
    dayLow: "52,110.00",
    path: "0,12 12,8 24,14 36,10 48,6 60,3",
    category: IndexCategory.FINANCIALS,
  },
  {
    name: "FINNIFTY",
    exchange: "NSE",
    price: "23,890.15",
    change: "+95.40 (+0.40%)",
    changeValue: 95.4,
    positive: true,
    dayHigh: "23,940.00",
    dayLow: "23,780.00",
    path: "0,14 12,12 24,10 36,8 48,5 60,3",
    category: IndexCategory.FINANCIALS,
  },
  {
    name: "NIFTY PSU BANK",
    exchange: "NSE",
    price: "7,120.60",
    change: "+124.50 (+1.78%)",
    changeValue: 124.5,
    positive: true,
    dayHigh: "7,150.00",
    dayLow: "6,980.00",
    path: "0,15 12,12 24,9 36,6 48,3 60,1",
    category: IndexCategory.FINANCIALS,
  },

  // ─── Sectoral Leaders ────────────────────────────────────────────────────
  {
    name: "NIFTY IT",
    exchange: "NSE",
    price: "43,210.50",
    change: "+850.30 (+2.01%)",
    changeValue: 850.3,
    positive: true,
    dayHigh: "43,350.00",
    dayLow: "42,350.00",
    path: "0,16 12,13 24,8 36,5 48,2 60,0",
    category: IndexCategory.SECTORAL,
  },
  {
    name: "NIFTY AUTO",
    exchange: "NSE",
    price: "25,890.20",
    change: "+310.40 (+1.21%)",
    changeValue: 310.4,
    positive: true,
    dayHigh: "25,950.00",
    dayLow: "25,570.00",
    path: "0,14 12,11 24,9 36,7 48,4 60,2",
    category: IndexCategory.SECTORAL,
  },
  {
    name: "NIFTY METAL",
    exchange: "NSE",
    price: "9,840.35",
    change: "+195.60 (+2.03%)",
    changeValue: 195.6,
    positive: true,
    dayHigh: "9,880.00",
    dayLow: "9,640.00",
    path: "0,15 12,12 24,8 36,6 48,2 60,0",
    category: IndexCategory.SECTORAL,
  },
  {
    name: "NIFTY PHARMA",
    exchange: "NSE",
    price: "22,450.75",
    change: "−115.80 (−0.51%)",
    changeValue: -115.8,
    positive: false,
    dayHigh: "22,590.00",
    dayLow: "22,420.00",
    path: "0,5 12,8 24,9 36,12 48,13 60,15",
    category: IndexCategory.SECTORAL,
  },

  // ─── Volatility & Sentiment ──────────────────────────────────────────────
  {
    name: "INDIA VIX",
    exchange: "NSE",
    price: "13.42",
    change: "−0.45 (−3.24%)",
    changeValue: -0.45,
    positive: false,
    dayHigh: "14.10",
    dayLow: "13.35",
    path: "0,3 12,6 24,4 36,11 48,9 60,14",
    isVix: true,
    category: IndexCategory.VOLATILITY,
  },
];

const MARKET_BREADTH: MarketBreadth = {
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

const SECTOR_PERFORMANCE: readonly SectorPerformance[] = [
  { name: "Nifty IT", change: "+2.01%", positive: true, momentum: "Strong" },
  { name: "Nifty Metal", change: "+2.03%", positive: true, momentum: "Strong" },
  { name: "Nifty PSU Bank", change: "+1.78%", positive: true, momentum: "Strong" },
  { name: "Nifty Auto", change: "+1.21%", positive: true, momentum: "Moderate" },
  { name: "Nifty Energy", change: "+1.07%", positive: true, momentum: "Moderate" },
  { name: "Nifty Pharma", change: "−0.51%", positive: false, momentum: "Neutral" },
  { name: "Nifty FMCG", change: "−0.24%", positive: false, momentum: "Weak" },
  { name: "Nifty Realty", change: "+2.13%", positive: true, momentum: "Strong" },
];

/**
 * Retrieves the current benchmark ticks.
 */
export function getBenchmarkTicks(): readonly MarketTick[] {
  return BENCHMARK_TICKS;
}

/**
 * Retrieves the live market breadth and institutional flow metrics.
 */
export function getMarketBreadth(): MarketBreadth {
  return MARKET_BREADTH;
}

/**
 * Retrieves sector momentum rankings.
 */
export function getSectorPerformance(): readonly SectorPerformance[] {
  return SECTOR_PERFORMANCE;
}
