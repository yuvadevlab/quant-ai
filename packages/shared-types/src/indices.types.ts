/**
 * @fileoverview Type contracts for market indices, metadata, and benchmark telemetry.
 * @author yuva.devlab@gmail.com
 */

import { IndexCategory, MarketDataStatus } from "./enums";

/**
 * Metadata descriptor for a financial market index or benchmark asset.
 */
export interface IndexMetadata {
  readonly symbol: string;
  readonly category: IndexCategory;
  readonly displayName: string;
  readonly description: string;
  readonly isBenchmark: boolean;
}

/**
 * Real-time or snapshot quote payload for an index or tracked benchmark.
 */
export interface IndexQuote {
  readonly symbol: string;
  readonly category: IndexCategory;
  readonly price: number;
  readonly change: number;
  readonly changePercent: number;
  readonly sparkline: readonly number[];
  readonly dataSource?: string;
  readonly dataStatus?: MarketDataStatus;
  readonly observedAt?: string;
}
