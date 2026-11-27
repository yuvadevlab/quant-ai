/**
 * @file apps/api/src/modules/chat/chat.constants.ts
 * @description Centralized constants, symbol universes, and indicators for AI Copilot chat.
 */

/**
 * Benchmark Indian market indices recognized in Copilot prompts.
 */
export const BENCHMARK_INDEX_SYMBOLS: readonly string[] = [
  "NIFTY 50",
  "NIFTY",
  "BANKNIFTY",
  "BANK NIFTY",
  "FINNIFTY",
  "SENSEX",
  "INDIA VIX",
] as const;

/**
 * Global commodities and cryptocurrencies recognized in Copilot prompts.
 */
export const GLOBAL_MACRO_SYMBOLS: readonly string[] = [
  "BTC",
  "BITCOIN",
  "GOLD",
  "CRUDE",
  "BRENT",
] as const;

/**
 * Keywords indicating an inquiry relates to derivatives or options chains.
 */
export const OPTION_CHAIN_KEYWORDS: readonly string[] = [
  "OPTION",
  "OPTIONS",
  "CHAIN",
  "PCR",
  "STRIKE",
  "EXPIRY",
  "CALL",
  "PUT",
  "OI",
  "GREEKS",
] as const;
