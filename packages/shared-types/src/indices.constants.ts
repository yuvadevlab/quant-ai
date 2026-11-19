/**
 * @fileoverview Seed registry of financial market benchmark index metadata.
 * @author yuva.devlab@gmail.com
 */

import { IndexCategory } from "./enums";
import type { IndexMetadata } from "./indices.types";

/**
 * Institutional registry of market indices across market cap tiers, sectors, and volatility assets.
 */
export const MARKET_INDEX_REGISTRY: Readonly<Record<string, IndexMetadata>> = Object.freeze({
  "NIFTY 50": {
    symbol: "NIFTY 50",
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty 50",
    description: "Flagship blue-chip benchmark index of the National Stock Exchange of India.",
    isBenchmark: true,
  },
  "NIFTY NEXT 50": {
    symbol: "NIFTY NEXT 50",
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty Next 50",
    description: "50 large-cap companies ranked 51-100 by free-float market capitalization.",
    isBenchmark: false,
  },
  "NIFTY 100": {
    symbol: "NIFTY 100",
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty 100",
    description: "Top 100 liquid blue-chip companies in the Indian capital market.",
    isBenchmark: false,
  },
  "NIFTY MIDCAP 100": {
    symbol: "NIFTY MIDCAP 100",
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty Midcap 100",
    description: "Growth-oriented medium capitalization companies driving domestic expansion.",
    isBenchmark: true,
  },
  "NIFTY SMALLCAP 100": {
    symbol: "NIFTY SMALLCAP 100",
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty Smallcap 100",
    description: "Dynamic emerging small capitalization leaders with high beta sensitivity.",
    isBenchmark: true,
  },
  "NIFTY 500": {
    symbol: "NIFTY 500",
    category: IndexCategory.BROAD_MARKET,
    displayName: "Nifty 500",
    description: "Broad market indicator covering >90% of free float market cap across 22 sectors.",
    isBenchmark: false,
  },
  BANKNIFTY: {
    symbol: "BANKNIFTY",
    category: IndexCategory.FINANCIALS,
    displayName: "Bank Nifty",
    description: "Most active banking benchmark comprising the 12 most liquid Indian banks.",
    isBenchmark: true,
  },
  FINNIFTY: {
    symbol: "FINNIFTY",
    category: IndexCategory.FINANCIALS,
    displayName: "Nifty Financial Services",
    description: "Comprises banks, NBFCs, housing finance, insurance, and AMC companies.",
    isBenchmark: false,
  },
  "NIFTY PSU BANK": {
    symbol: "NIFTY PSU BANK",
    category: IndexCategory.FINANCIALS,
    displayName: "Nifty PSU Bank",
    description: "Public sector banking index tracking government-owned banks.",
    isBenchmark: false,
  },
  "NIFTY PVT BANK": {
    symbol: "NIFTY PVT BANK",
    category: IndexCategory.FINANCIALS,
    displayName: "Nifty Private Bank",
    description: "Private sector commercial banking institutions.",
    isBenchmark: false,
  },
  "NIFTY IT": {
    symbol: "NIFTY IT",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty IT",
    description: "Top technology and software export leaders (TCS, Infosys, HCLTech, etc.).",
    isBenchmark: true,
  },
  "NIFTY AUTO": {
    symbol: "NIFTY AUTO",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Auto",
    description: "Automobile OEMs, two-wheelers, commercial vehicles, and auto components.",
    isBenchmark: false,
  },
  "NIFTY PHARMA": {
    symbol: "NIFTY PHARMA",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Pharma",
    description: "Defensive healthcare and pharmaceutical manufacturing companies.",
    isBenchmark: false,
  },
  "NIFTY FMCG": {
    symbol: "NIFTY FMCG",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty FMCG",
    description: "Fast-moving consumer goods and defensive domestic consumption leaders.",
    isBenchmark: false,
  },
  "NIFTY METAL": {
    symbol: "NIFTY METAL",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Metal",
    description: "Producers of steel, aluminium, zinc, and mining commodities.",
    isBenchmark: false,
  },
  "NIFTY ENERGY": {
    symbol: "NIFTY ENERGY",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Energy",
    description: "Petroleum refining, power generation, gas distribution, and renewable energy.",
    isBenchmark: false,
  },
  "NIFTY REALTY": {
    symbol: "NIFTY REALTY",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Realty",
    description: "Commercial and residential real estate developers.",
    isBenchmark: false,
  },
  "NIFTY INFRA": {
    symbol: "NIFTY INFRA",
    category: IndexCategory.SECTORAL,
    displayName: "Nifty Infrastructure",
    description: "Capital goods, construction, ports, and infrastructure conglomerates.",
    isBenchmark: false,
  },
  "INDIA VIX": {
    symbol: "INDIA VIX",
    category: IndexCategory.VOLATILITY,
    displayName: "India VIX",
    description:
      "NSE implied volatility index measuring 30-day expected market annualized fluctuation.",
    isBenchmark: true,
  },
  SENSEX: {
    symbol: "SENSEX",
    category: IndexCategory.BROAD_MARKET,
    displayName: "BSE Sensex",
    description: "Bombay Stock Exchange 30 prominent, large-cap companies.",
    isBenchmark: true,
  },
  "BRENT CRUDE": {
    symbol: "BRENT CRUDE",
    category: IndexCategory.VOLATILITY,
    displayName: "Brent Crude",
    description: "International crude oil benchmark impacting Indian inflation and currency.",
    isBenchmark: false,
  },
});
