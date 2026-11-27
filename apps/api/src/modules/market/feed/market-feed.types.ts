/**
 * @file apps/api/src/modules/market/feed/market-feed.types.ts
 * @description Dynamic market data feed contracts and quote structures.
 */

import type { MarketDataStatus } from "@quant-ai/shared-types";

/**
 * Normalized quote and provenance for an instrument.
 */
export interface LiveMarketQuote {
  readonly symbol: string;
  readonly displayName: string;
  readonly price: number;
  readonly change: number;
  readonly percentChange: number;
  readonly dayHigh: number;
  readonly dayLow: number;
  readonly volume: number;
  readonly currency: string;
  readonly exchange: string;
  readonly instrumentType: string;
  readonly sparkline: readonly number[];
  readonly source: string;
  readonly dataStatus: MarketDataStatus;
  readonly observedAt?: string;
  readonly timestamp: string;
}

/**
 * Historical OHLCV candle item.
 */
export interface MarketCandle {
  readonly timestamp: number;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
}
