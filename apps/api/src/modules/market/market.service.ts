import { Injectable } from "@nestjs/common";
import { IndexCategory, IndexQuote, MarketIndex } from "@quant-ai/contracts";

/**
 * Service managing live and cached market benchmark data feeds across categories.
 * Author: yuva.devlab@gmail.com
 */
@Injectable()
export class MarketService {
  private readonly indices: readonly IndexQuote[] = [
    // ─── Broad Market Tiers ──────────────────────────────────────────────────
    {
      symbol: MarketIndex.NIFTY_50,
      category: IndexCategory.BROAD_MARKET,
      price: 24350.25,
      change: 142.8,
      changePercent: 0.59,
      sparkline: [24210, 24240, 24290, 24310, 24350],
    },
    {
      symbol: MarketIndex.NIFTY_NEXT_50,
      category: IndexCategory.BROAD_MARKET,
      price: 71240.1,
      change: 620.4,
      changePercent: 0.88,
      sparkline: [70600, 70800, 70950, 71100, 71240],
    },
    {
      symbol: MarketIndex.NIFTY_MIDCAP_100,
      category: IndexCategory.BROAD_MARKET,
      price: 58650.3,
      change: 715.2,
      changePercent: 1.23,
      sparkline: [57900, 58150, 58350, 58500, 58650],
    },
    {
      symbol: MarketIndex.NIFTY_SMALLCAP_100,
      category: IndexCategory.BROAD_MARKET,
      price: 18920.85,
      change: 285.4,
      changePercent: 1.53,
      sparkline: [18620, 18710, 18800, 18880, 18920],
    },
    {
      symbol: MarketIndex.SENSEX,
      category: IndexCategory.BROAD_MARKET,
      price: 80110.6,
      change: 412.3,
      changePercent: 0.52,
      sparkline: [79700, 79820, 79950, 80040, 80110],
    },
    {
      symbol: MarketIndex.NIFTY_500,
      category: IndexCategory.BROAD_MARKET,
      price: 22890.45,
      change: 168.2,
      changePercent: 0.74,
      sparkline: [22720, 22760, 22810, 22850, 22890],
    },

    // ─── Banking & Financials ────────────────────────────────────────────────
    {
      symbol: MarketIndex.BANKNIFTY,
      category: IndexCategory.FINANCIALS,
      price: 52180.4,
      change: -85.2,
      changePercent: -0.16,
      sparkline: [52300, 52280, 52210, 52190, 52180],
    },
    {
      symbol: MarketIndex.FINNIFTY,
      category: IndexCategory.FINANCIALS,
      price: 23890.15,
      change: 95.4,
      changePercent: 0.4,
      sparkline: [23780, 23820, 23850, 23870, 23890],
    },
    {
      symbol: MarketIndex.NIFTY_PSU_BANK,
      category: IndexCategory.FINANCIALS,
      price: 7120.6,
      change: 124.5,
      changePercent: 1.78,
      sparkline: [6980, 7030, 7070, 7100, 7120],
    },
    {
      symbol: MarketIndex.NIFTY_PVT_BANK,
      category: IndexCategory.FINANCIALS,
      price: 26450.8,
      change: -32.1,
      changePercent: -0.12,
      sparkline: [26510, 26490, 26470, 26460, 26450],
    },

    // ─── Sectoral Leaders ────────────────────────────────────────────────────
    {
      symbol: MarketIndex.NIFTY_IT,
      category: IndexCategory.SECTORAL,
      price: 43210.5,
      change: 850.3,
      changePercent: 2.01,
      sparkline: [42350, 42600, 42890, 43050, 43210],
    },
    {
      symbol: MarketIndex.NIFTY_AUTO,
      category: IndexCategory.SECTORAL,
      price: 25890.2,
      change: 310.4,
      changePercent: 1.21,
      sparkline: [25570, 25650, 25740, 25820, 25890],
    },
    {
      symbol: MarketIndex.NIFTY_PHARMA,
      category: IndexCategory.SECTORAL,
      price: 22450.75,
      change: -115.8,
      changePercent: -0.51,
      sparkline: [22590, 22550, 22510, 22480, 22450],
    },
    {
      symbol: MarketIndex.NIFTY_METAL,
      category: IndexCategory.SECTORAL,
      price: 9840.35,
      change: 195.6,
      changePercent: 2.03,
      sparkline: [9640, 9700, 9760, 9810, 9840],
    },
    {
      symbol: MarketIndex.NIFTY_FMCG,
      category: IndexCategory.SECTORAL,
      price: 59420.15,
      change: -140.2,
      changePercent: -0.24,
      sparkline: [59600, 59550, 59500, 59460, 59420],
    },
    {
      symbol: MarketIndex.NIFTY_ENERGY,
      category: IndexCategory.SECTORAL,
      price: 39850.6,
      change: 420.8,
      changePercent: 1.07,
      sparkline: [39420, 39550, 39680, 39790, 39850],
    },
    {
      symbol: MarketIndex.NIFTY_REALTY,
      category: IndexCategory.SECTORAL,
      price: 1085.4,
      change: 22.6,
      changePercent: 2.13,
      sparkline: [1062, 1069, 1075, 1081, 1085],
    },

    // ─── Volatility & Sentiment ──────────────────────────────────────────────
    {
      symbol: MarketIndex.INDIA_VIX,
      category: IndexCategory.VOLATILITY,
      price: 13.42,
      change: -0.45,
      changePercent: -3.24,
      sparkline: [14.1, 13.9, 13.7, 13.5, 13.42],
    },
    {
      symbol: MarketIndex.BRENT_CRUDE,
      category: IndexCategory.VOLATILITY,
      price: 74.85,
      change: -0.65,
      changePercent: -0.86,
      sparkline: [75.6, 75.3, 75.1, 74.95, 74.85],
    },
  ];

  /**
   * Retrieves all major benchmark index snapshots.
   */
  getBenchmarkIndices(): readonly IndexQuote[] {
    return this.indices;
  }

  /**
   * Retrieves market indices optionally filtered by category.
   *
   * @param category Optional index category filter.
   * @returns Array of IndexQuote records.
   */
  getIndicesByCategory(category?: IndexCategory): readonly IndexQuote[] {
    if (!category) {
      return this.indices;
    }
    return this.indices.filter((item) => item.category === category);
  }
}
