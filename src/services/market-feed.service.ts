/**
 * @file src/services/market-feed.service.ts
 * @description Centralized market data feed service for Indian financial benchmarks (NSE & BSE).
 * Decouples presentation components from live WebSockets or mock feeds.
 * @author yuva.devlab@gmail.com
 */

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
  {
    name: "NIFTY 50",
    exchange: "NSE",
    price: "24,188.50",
    change: "+86.20 (+0.36%)",
    changeValue: 86.2,
    positive: true,
    dayHigh: "24,215.80",
    dayLow: "24,088.10",
    path: "0,14 12,11 24,13 36,5 48,9 60,2",
  },
  {
    name: "BANKNIFTY",
    exchange: "NSE",
    price: "51,240.80",
    change: "+112.40 (+0.22%)",
    changeValue: 112.4,
    positive: true,
    dayHigh: "51,350.00",
    dayLow: "50,980.20",
    path: "0,12 12,8 24,14 36,10 48,6 60,3",
  },
  {
    name: "MIDCPNIFTY",
    exchange: "NSE",
    price: "12,875.40",
    change: "+105.10 (+0.82%)",
    changeValue: 105.1,
    positive: true,
    dayHigh: "12,902.00",
    dayLow: "12,740.00",
    path: "0,15 12,12 24,9 36,11 48,5 60,1",
  },
  {
    name: "SENSEX",
    exchange: "BSE",
    price: "79,842.10",
    change: "+248.50 (+0.31%)",
    changeValue: 248.5,
    positive: true,
    dayHigh: "79,980.00",
    dayLow: "79,510.00",
    path: "0,13 12,10 24,11 36,6 48,8 60,4",
  },
  {
    name: "INDIA VIX",
    exchange: "NSE",
    price: "13.48",
    change: "−0.42 (−3.02%)",
    changeValue: -0.42,
    positive: false,
    dayHigh: "14.10",
    dayLow: "13.35",
    path: "0,3 12,6 24,4 36,11 48,9 60,14",
    isVix: true,
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
  volatilityEnv: "Low Volatility (VIX 13.48)",
};

const SECTOR_PERFORMANCE: readonly SectorPerformance[] = [
  { name: "Nifty PSU Bank", change: "+2.15%", positive: true, momentum: "Strong" },
  { name: "Nifty IT", change: "+1.84%", positive: true, momentum: "Strong" },
  { name: "Nifty Auto", change: "+1.22%", positive: true, momentum: "Moderate" },
  { name: "Nifty Metal", change: "+0.95%", positive: true, momentum: "Moderate" },
  { name: "Nifty Pharma", change: "+0.44%", positive: true, momentum: "Neutral" },
  { name: "Nifty Energy", change: "+0.18%", positive: true, momentum: "Neutral" },
  { name: "Nifty FMCG", change: "−0.32%", positive: false, momentum: "Weak" },
  { name: "Nifty Realty", change: "−0.65%", positive: false, momentum: "Weak" },
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
