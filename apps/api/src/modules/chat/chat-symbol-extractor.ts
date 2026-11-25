/**
 * @file apps/api/src/modules/chat/chat-symbol-extractor.ts
 * @description Extracts market index or equity ticker symbols from natural-language trader queries.
 * @author yuva.devlab@gmail.com
 */

import { BENCHMARK_INDEX_SYMBOLS, OPTION_CHAIN_KEYWORDS } from "./chat.constants";

const KNOWN_INDIAN_SYMBOLS: readonly string[] = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
  "ITC",
  "BHARTIARTL",
  "AXISBANK",
  "KOTAKBANK",
  "WIPRO",
  "TATAMOTORS",
  "TATASTEEL",
  "BAJFINANCE",
  "MARUTI",
  "SUNPHARMA",
  "TITAN",
  "ADANIENT",
  "HINDUNILVR",
  "ASIANPAINT",
  "ULTRACEMCO",
  "NTPC",
  "ONGC",
  "POWERGRID",
  "JSWSTEEL",
  "HCLTECH",
  "TECHM",
  "ZOMATO",
  "ETERNAL",
  "TRENT",
  "HAL",
  "BEL",
];

const NON_TICKER_UPPER_WORDS = new Set([
  "THE",
  "AND",
  "FOR",
  "YOU",
  "ARE",
  "NOT",
  "BUT",
  "ALL",
  "CAN",
  "HOW",
  "WHY",
  "WHO",
  "WHAT",
  "YOUR",
  "ABOUT",
  "AFTER",
  "RECENT",
  "SETUP",
  "STOCK",
  "TRADE",
  "PRICE",
  "CALL",
  "ANALYSIS",
  "VIEW",
  "TODAY",
  "LEVELS",
  "MARKET",
  "PLEASE",
  "ASSESSMENT",
  "BREAKOUT",
  "OUTLOOK",
  "TARGET",
  "EXPLAIN",
  "PREDICTION",
  "PCR",
  "OPTION",
  "OPTIONS",
  "CHAIN",
  "STRIKE",
  "EXPIRY",
  "PUT",
  "OI",
  "GREEKS",
  "RSI",
  "ATR",
  "EMA",
  "SMA",
  "MACD",
  "IV",
  "FII",
  "DII",
  "NSE",
  "BSE",
  "SEBI",
  "RBI",
  "GDP",
  "USD",
  "INR",
  "CEO",
  "IPO",
  "ETF",
  "API",
  "LLM",
  "AI",
  "HI",
  "HELLO",
  "HEY",
  "HELP",
  "VIX",
  "BUY",
  "SELL",
  "HOLD",
  "LONG",
  "SHORT",
  "RISK",
  "STOP",
  "LOSS",
  "PROFIT",
  "GAIN",
  "KELLY",
]);

/**
 * Extracts a market index or equity symbol from a trader's chat query.
 * Avoids treating ordinary English words as stock tickers.
 */
export function extractMentionedSymbol(query: string): string | undefined {
  const upper = query.toUpperCase();
  for (const sym of BENCHMARK_INDEX_SYMBOLS) {
    if (upper.includes(sym)) return sym;
  }

  const cashtagMatch = query.match(/\$([A-Za-z]{2,12})\b/);
  if (cashtagMatch?.[1]) {
    return cashtagMatch[1].toUpperCase();
  }

  for (const sym of KNOWN_INDIAN_SYMBOLS) {
    if (new RegExp(`\\b${sym}\\b`, "i").test(query)) return sym;
  }

  // Only treat explicitly UPPERCASE tokens as ad-hoc tickers (never lowercase English words)
  const exactCaps = query.match(/\b[A-Z]{2,12}\b/g);
  if (exactCaps) {
    return exactCaps.find((w) => !NON_TICKER_UPPER_WORDS.has(w));
  }

  return undefined;
}

/**
 * Determines whether the trader query relates to derivatives or option-chain telemetry.
 */
export function isOptionChainInquiry(query: string): boolean {
  const upper = query.toUpperCase();
  return OPTION_CHAIN_KEYWORDS.some((kw) => upper.includes(kw));
}
