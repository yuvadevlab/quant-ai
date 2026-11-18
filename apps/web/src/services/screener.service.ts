/**
 * @file src/services/screener.service.ts
 * @description Quantitative factor scanning service for Indian equities. */

/**
 * Screener item record.
 */
export interface ScreenerItem {
  readonly symbol: string;
  readonly name: string;
  readonly sector: string;
  readonly price: string;
  readonly change: string;
  readonly positive: boolean;
  readonly rsi: number;
  readonly emaStatus: string;
  readonly oiAction: string;
  readonly volumeSurge: string;
  readonly pattern: string;
  readonly signalCandidate: "Strong BUY" | "BUY" | "Neutral" | "SELL";
}

const SCREENER_ITEMS: readonly ScreenerItem[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sector: "Energy",
    price: "₹2,434.60",
    change: "+0.50%",
    positive: true,
    rsi: 63.4,
    emaStatus: "Above 20/50",
    oiAction: "Short Covering",
    volumeSurge: "+42%",
    pattern: "Ascending Triangle Breakout",
    signalCandidate: "Strong BUY",
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel",
    sector: "Metals",
    price: "₹160.80",
    change: "+1.20%",
    positive: true,
    rsi: 68.2,
    emaStatus: "EMA Bullish Cross",
    oiAction: "Long Buildup",
    volumeSurge: "+58%",
    pattern: "Multi-week Range Expansion",
    signalCandidate: "Strong BUY",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    sector: "PSU Banking",
    price: "₹824.50",
    change: "+2.30%",
    positive: true,
    rsi: 71.0,
    emaStatus: "Above 20/50",
    oiAction: "Long Buildup",
    volumeSurge: "+85%",
    pattern: "Flag & Pole Continuation",
    signalCandidate: "Strong BUY",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    sector: "IT",
    price: "₹1,506.20",
    change: "−0.19%",
    positive: false,
    rsi: 48.5,
    emaStatus: "Below 50 EMA",
    oiAction: "Unwinding",
    volumeSurge: "−12%",
    pattern: "Pullback to Support",
    signalCandidate: "Neutral",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    sector: "Telecom",
    price: "₹1,684.00",
    change: "+1.15%",
    positive: true,
    rsi: 64.8,
    emaStatus: "Above 20/50",
    oiAction: "Long Buildup",
    volumeSurge: "+34%",
    pattern: "All-Time High Consolidation",
    signalCandidate: "BUY",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sector: "Banking",
    price: "₹1,736.80",
    change: "−0.44%",
    positive: false,
    rsi: 44.2,
    emaStatus: "EMA Rejection",
    oiAction: "Short Buildup",
    volumeSurge: "+28%",
    pattern: "Resistance Rejection",
    signalCandidate: "SELL",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    sector: "Infrastructure",
    price: "₹3,540.00",
    change: "+0.88%",
    positive: true,
    rsi: 59.4,
    emaStatus: "Above 20/50",
    oiAction: "Long Buildup",
    volumeSurge: "+22%",
    pattern: "Cup with Handle",
    signalCandidate: "BUY",
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki",
    sector: "Auto",
    price: "₹11,450.00",
    change: "+1.65%",
    positive: true,
    rsi: 66.5,
    emaStatus: "Above 20/50",
    oiAction: "Short Covering",
    volumeSurge: "+45%",
    pattern: "Bullish Channel Rebound",
    signalCandidate: "Strong BUY",
  },
];

/**
 * Retrieves scanned universe items.
 */
export function getScreenerItems(): readonly ScreenerItem[] {
  return SCREENER_ITEMS;
}
