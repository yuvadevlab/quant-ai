/**
 * @fileoverview Canonical registry of Indian financial market index metadata.
 * Author: yuva.devlab@gmail.com
 */

import { IndexCategory, MarketIndex } from "./enums";
import { IndexMetadata } from "./indices.types";

/**
 * Institutional registry of market indices across market cap tiers and sectors.
 */
export const MARKET_INDEX_REGISTRY: Readonly<Record<MarketIndex, IndexMetadata>> = {
  [MarketIndex.NIFTY_50]: {
    symbol: MarketIndex.NIFTY_50,
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty 50",
    description: "Flagship blue-chip benchmark index of the National Stock Exchange of India.",
    isBenchmark: true,
  },
  [MarketIndex.NIFTY_NEXT_50]: {
    symbol: MarketIndex.NIFTY_NEXT_50,
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty Next 50",
    description: "50 large-cap companies ranked 51-100 by free-float market capitalization.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_100]: {
    symbol: MarketIndex.NIFTY_100,
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty 100",
    description: "Top 100 liquid blue-chip companies in the Indian capital market.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_MIDCAP_100]: {
    symbol: MarketIndex.NIFTY_MIDCAP_100,
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty Midcap 100",
    description: "Growth-oriented medium capitalization companies driving domestic expansion.",
    isBenchmark: true,
  },
  [MarketIndex.NIFTY_SMALLCAP_100]: {
    symbol: MarketIndex.NIFTY_SMALLCAP_100,
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty Smallcap 100",
    description: "Dynamic emerging small capitalization leaders with high beta sensitivity.",
    isBenchmark: true,
  },
  [MarketIndex.NIFTY_500]: {
    symbol: MarketIndex.NIFTY_500,
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty 500",
    description: "Broad market indicator covering >90% of free float market cap across 22 sectors.",
    isBenchmark: false,
  },

  // Banking & Financials
  [MarketIndex.BANKNIFTY]: {
    symbol: MarketIndex.BANKNIFTY,
    category: IndexCategory.FINANCIALS,
    displayName: "Bank Nifty",
    description: "Most active banking benchmark comprising the 12 most liquid Indian banks.",
    isBenchmark: true,
  },
  [MarketIndex.FINNIFTY]: {
    symbol: MarketIndex.FINNIFTY,
    category: IndexCategory.FINANCIALS,
    displayName: "Nifty Financial Services",
    description: "Comprises banks, NBFCs, housing finance, insurance, and AMC companies.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_PSU_BANK]: {
    symbol: MarketIndex.NIFTY_PSU_BANK,
    category: IndexCategory.FINANCIALS,
    displayName: "Nifty PSU Bank",
    description: "Public sector banking index tracking government-owned banks.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_PVT_BANK]: {
    symbol: MarketIndex.NIFTY_PVT_BANK,
    category: IndexCategory.FINANCIALS,
    displayName: "Nifty Private Bank",
    description: "Private sector commercial banking institutions.",
    isBenchmark: false,
  },

  // Sectoral Leaders
  [MarketIndex.NIFTY_IT]: {
    symbol: MarketIndex.NIFTY_IT,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty IT",
    description: "Top technology and software export leaders (TCS, Infosys, HCLTech, etc.).",
    isBenchmark: true,
  },
  [MarketIndex.NIFTY_AUTO]: {
    symbol: MarketIndex.NIFTY_AUTO,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Auto",
    description: "Automobile OEMs, two-wheelers, commercial vehicles, and auto components.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_PHARMA]: {
    symbol: MarketIndex.NIFTY_PHARMA,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Pharma",
    description: "Defensive healthcare and pharmaceutical manufacturing companies.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_FMCG]: {
    symbol: MarketIndex.NIFTY_FMCG,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty FMCG",
    description: "Fast-moving consumer goods and defensive domestic consumption leaders.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_METAL]: {
    symbol: MarketIndex.NIFTY_METAL,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Metal",
    description: "Producers of steel, aluminium, zinc, and mining commodities.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_ENERGY]: {
    symbol: MarketIndex.NIFTY_ENERGY,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Energy",
    description: "Petroleum refining, power generation, gas distribution, and renewable energy.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_REALTY]: {
    symbol: MarketIndex.NIFTY_REALTY,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Realty",
    description: "Commercial and residential real estate developers.",
    isBenchmark: false,
  },
  [MarketIndex.NIFTY_INFRA]: {
    symbol: MarketIndex.NIFTY_INFRA,
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Infrastructure",
    description: "Capital goods, construction, ports, and infrastructure conglomerates.",
    isBenchmark: false,
  },

  // Volatility & Global
  [MarketIndex.INDIA_VIX]: {
    symbol: MarketIndex.INDIA_VIX,
    category: IndexCategory.VOLATILITY,
    displayName: "India VIX",
    description:
      "NSE implied volatility index measuring 30-day expected market annualized fluctuation.",
    isBenchmark: true,
  },
  [MarketIndex.SENSEX]: {
    symbol: MarketIndex.SENSEX,
    category: IndexCategory.BROAD_MARKET,
    displayName: "BSE Sensex",
    description: "Bombay Stock Exchange 30 prominent, large-cap companies.",
    isBenchmark: true,
  },
  [MarketIndex.BRENT_CRUDE]: {
    symbol: MarketIndex.BRENT_CRUDE,
    category: IndexCategory.VOLATILITY,
    displayName: "Brent Crude",
    description: "International crude oil benchmark impacting Indian inflation and currency.",
    isBenchmark: false,
  },
} as const;
