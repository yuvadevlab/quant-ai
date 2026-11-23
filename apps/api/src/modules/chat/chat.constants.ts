/**
 * @file apps/api/src/modules/chat/chat.constants.ts
 * @description Centralized constants, symbol universes, and indicators for AI Copilot chat.
 * @author yuva.devlab@gmail.com
 */

import { MARKET_EQUITY_REGISTRY } from "@quant-ai/shared-types";

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
 * Universal dynamic symbol universe recognized in chat inquiries.
 * Derived directly from shared-types MARKET_EQUITY_REGISTRY SSOT.
 */
export const CHAT_QUERY_SYMBOLS: readonly string[] = [
  ...BENCHMARK_INDEX_SYMBOLS,
  ...MARKET_EQUITY_REGISTRY.map((s) => s.symbol),
  ...GLOBAL_MACRO_SYMBOLS,
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
