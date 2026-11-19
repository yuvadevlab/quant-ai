/**
 * @fileoverview Type contracts for market indices, metadata, and benchmark telemetry.
 * Author: yuva.devlab@gmail.com
 */

import { IndexCategory, MarketIndex } from "./enums";

/**
 * Static metadata descriptor for a financial market index.
 */
export interface IndexMetadata {
  readonly symbol: MarketIndex;
  readonly category: IndexCategory;
  readonly displayName: string;
  readonly description: string;
  readonly isBenchmark: boolean;
}

/**
 * Real-time or snapshot quote payload for an index.
 */
export interface IndexQuote {
  readonly symbol: MarketIndex;
  readonly category: IndexCategory;
  readonly price: number;
  readonly change: number;
  readonly changePercent: number;
  readonly sparkline: readonly number[];
}
