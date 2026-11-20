/**
 * @file apps/api/src/modules/chat/chat.constants.ts
 * @description Centralized constants, symbol universes, and response templates for AI Copilot chat.
 * @author yuva.devlab@gmail.com
 */

import type { LiveMarketQuote } from "../market/feed";

/**
 * Universal recognizer symbols scanned in chat prompt inquiries.
 */
export const CHAT_QUERY_SYMBOLS: readonly string[] = [
  "NIFTY 50",
  "NIFTY",
  "BANKNIFTY",
  "BANK NIFTY",
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "INFY",
  "ICICIBANK",
  "AMZN",
  "AAPL",
  "NVDA",
  "BTC",
  "GOLD",
  "CRUDE",
] as const;

/**
 * Chat formatting templates and response generators.
 */
export const CHAT_TEMPLATES = {
  /**
   * Generates formatted quantitative summary when a live instrument is referenced.
   */
  LIVE_QUOTE_SUMMARY: (quote: LiveMarketQuote): string => {
    const sign = quote.change >= 0 ? "+" : "";
    const sentiment =
      quote.percentChange >= 0 ? "bullish order flow expansion" : "defensive consolidation";
    const recommendedStop = (quote.price * 0.985).toFixed(2);

    return (
      `${quote.symbol} is currently trading at ${quote.currency} ${quote.price.toLocaleString("en-IN")} ` +
      `(${sign}${quote.percentChange.toFixed(2)}%). ` +
      `Day Range: ${quote.dayLow} – ${quote.dayHigh}. Volume: ${quote.volume.toLocaleString()}. ` +
      `Quantitative consensus indicates ${sentiment} with dynamic stop-loss recommended at ${recommendedStop}.`
    );
  },

  /**
   * Generates default institutional risk response for generic quant inquiries.
   */
  GENERIC_QUANT_REPLY: (query: string): string =>
    `Quantitative analysis for "${query}": Multi-agent deliberation models show overall market volatility regime ` +
    `is stable. Institutional risk parameters require minimum 2.0x Risk:Reward ratio and strict invalidation on daily close below structural VWAP.`,
} as const;
