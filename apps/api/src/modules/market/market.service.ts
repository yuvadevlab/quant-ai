import { Injectable } from "@nestjs/common";
import { MarketIndex } from "@quant-ai/contracts";

/**
 * Benchmark index quote data structure.
 */
export interface IndexQuote {
  readonly symbol: MarketIndex;
  readonly price: number;
  readonly change: number;
  readonly changePercent: number;
  readonly sparkline: readonly number[];
}

/**
 * Service managing live and cached market benchmark data feeds.
 */
@Injectable()
export class MarketService {
  private readonly indices: readonly IndexQuote[] = [
    {
      symbol: MarketIndex.NIFTY_50,
      price: 24350.25,
      change: 142.8,
      changePercent: 0.59,
      sparkline: [24210, 24240, 24290, 24310, 24350],
    },
    {
      symbol: MarketIndex.BANKNIFTY,
      price: 52180.4,
      change: -85.2,
      changePercent: -0.16,
      sparkline: [52300, 52280, 52210, 52190, 52180],
    },
    {
      symbol: MarketIndex.FINNIFTY,
      price: 23890.15,
      change: 95.4,
      changePercent: 0.4,
      sparkline: [23780, 23820, 23850, 23870, 23890],
    },
    {
      symbol: MarketIndex.SENSEX,
      price: 80110.6,
      change: 412.3,
      changePercent: 0.52,
      sparkline: [79700, 79820, 79950, 80040, 80110],
    },
    {
      symbol: MarketIndex.INDIA_VIX,
      price: 13.42,
      change: -0.45,
      changePercent: -3.24,
      sparkline: [14.1, 13.9, 13.7, 13.5, 13.42],
    },
  ];

  /**
   * Retrieves all major benchmark index snapshots.
   *
   * @returns Array of IndexQuote records.
   */
  getBenchmarkIndices(): readonly IndexQuote[] {
    return this.indices;
  }
}
