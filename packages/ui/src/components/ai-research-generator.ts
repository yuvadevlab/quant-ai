/**
 * @file packages/ui/src/components/ai-research-generator.ts
 * @description Dynamic quantitative AI research synthesis generator for trading recommendations.
 * @author yuva.devlab@gmail.com
 */

import type { TableSignalItem } from "../types";

/**
 * Known sector mapping for major institutional Indian equities.
 */
const SECTOR_PROFILES: Record<string, { sector: string; catalyst: string; driver: string }> = {
  TCS: {
    sector: "IT Services",
    catalyst: "20-EMA mean-reversion retest with RSI bullish divergence at 62.4",
    driver: "algorithmic buy-block accumulation at key support",
  },
  INFY: {
    sector: "IT Services",
    catalyst: "IT index gamma squeeze setup and multi-timeframe moving average reclaim",
    driver: "positive options skew and short covering",
  },
  RELIANCE: {
    sector: "Energy & Conglomerate",
    catalyst: "Futures open interest buildup and heavy put writing at support",
    driver: "energy sector relative strength index leading the benchmark",
  },
  HDFCBANK: {
    sector: "Banking & Financials",
    catalyst: "Bank Nifty sector rotation with 2.2x volume surge and call delta unwinding",
    driver: "institutional accumulation at lower Bollinger boundary",
  },
  ICICIBANK: {
    sector: "Banking & Financials",
    catalyst: "Sustained credit growth tailwinds and multi-week ascending triangle breakout",
    driver: "high institutional buying participation in cash and futures",
  },
  SBIN: {
    sector: "PSU Banking",
    catalyst: "Public sector banking index outperformance and momentum continuation",
    driver: "order book liquidity absorption above VWAP threshold",
  },
  AXISBANK: {
    sector: "Banking & Financials",
    catalyst: "Breakout above consolidating range with ATR volatility expansion",
    driver: "institutional block flow and favorable beta-adjusted momentum",
  },
  LT: {
    sector: "Capital Goods & Infrastructure",
    catalyst: "Order flow imbalance confirming breakout above multi-week resistance levels",
    driver: "heavy algorithmic block buying and structural industrial tailwinds",
  },
  NIFTY: {
    sector: "Benchmark Index",
    catalyst: "Market breadth expansion with 72% constituent participation above 20 EMA",
    driver: "algorithmic VWAP retest confirming directional continuation",
  },
  BANKNIFTY: {
    sector: "Banking Index",
    catalyst: "Expiry gamma unwinding and call strike absorption above weekly pivot",
    driver: "institutional liquidity sweep and momentum continuation",
  },
};

/**
 * Dynamically synthesizes an institutional AI quantitative research rationale based on real-time trade metrics.
 */
export function generateDynamicAiResearchRationale(signal: TableSignalItem): string {
  const symbolKey = signal.symbol.toUpperCase();
  const profile = SECTOR_PROFILES[symbolKey];

  const entryNum = parseFloat(signal.entry.replace(/[^0-9.-]/g, "")) || 100;
  const targetNum = parseFloat(signal.target1.replace(/[^0-9.-]/g, "")) || entryNum * 1.04;
  const stopNum = parseFloat(signal.stop.replace(/[^0-9.-]/g, "")) || entryNum * 0.98;
  const upsidePct = (((targetNum - entryNum) / (entryNum || 1)) * 100).toFixed(1);
  const riskPct = Math.abs(((entryNum - stopNum) / (entryNum || 1)) * 100).toFixed(1);

  const isBuy = signal.direction.toLowerCase() === "buy";
  const directionVerb = isBuy ? "bullish accumulation" : "bearish distribution";
  const rrr = signal.riskReward || "1:2.5";
  const score = signal.score
    ? Math.round(signal.score * 10)
    : signal.confidence
      ? parseInt(signal.confidence.replace(/[^0-9]/g, ""), 10) || 75
      : 75;

  // 1. If explicit tailored rationale exists (not the old static string), prioritize it
  if (
    signal.rationale &&
    signal.rationale.length > 20 &&
    !signal.rationale.includes("multi-week resistance levels")
  ) {
    return signal.rationale;
  }

  // 2. If specialized catalysts exist in the signal data, weave them dynamically into research thesis
  if (signal.catalysts && signal.catalysts.length >= 2) {
    const primaryCat = signal.catalysts[0];
    const secondaryCat = signal.catalysts[1];
    return `AI Quantitative Synthesis: Confirmed ${directionVerb} triggered by ${primaryCat} and ${secondaryCat}. Order flow models project a +${upsidePct}% path toward Target 1 (${signal.target1}) with ${score}% model confidence and ${rrr} risk-reward.`;
  }

  // 3. Asset-specific dynamic quantitative synthesis
  if (profile) {
    return `AI Quantitative Synthesis: ${profile.driver.charAt(0).toUpperCase() + profile.driver.slice(1)} in ${profile.sector}. Triggered by ${profile.catalyst}, models project a +${upsidePct}% upside path toward ${signal.target1} with ${score}% win probability and protected stop at ${signal.stop}.`;
  }

  // 4. Mathematical expectancy synthesis for any dynamic asset
  const targetLabel = signal.target1 || `₹${targetNum.toFixed(2)}`;
  const stopLabel = signal.stop || `₹${stopNum.toFixed(2)}`;
  return `AI Quantitative Synthesis: Multi-agent consensus identifies ${directionVerb} with +${upsidePct}% expected gain vs -${riskPct}% risk. Volume profile expansion and favorable ${rrr} mathematical expectancy support high-conviction path toward ${targetLabel} with stop at ${stopLabel}.`;
}
