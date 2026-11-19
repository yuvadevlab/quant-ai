/**
 * @fileoverview Canonical financial market and prediction state enums. */

/**
 * Standard life cycle status for quantitative predictions.
 */
export enum SignalStatus {
  ACTIVE = "Active",
  TARGET_HIT = "Target hit",
  STOP_HIT = "Stop hit",
  EXPIRED = "Expired",
  INVALIDATED = "Invalidated",
}

/**
 * Directional bias for signals and predictions.
 */
export enum SignalDirection {
  LONG = "LONG",
  SHORT = "SHORT",
  NEUTRAL = "NEUTRAL",
}

/**
 * Market volatility and trend regime classification.
 */
export enum SignalRegime {
  BULLISH_EXPANSION = "Bullish Expansion",
  BEARISH_CONTRACTION = "Bearish Contraction",
  SIDEWAYS_CONSOLIDATION = "Sideways Consolidation",
  HIGH_VOLATILITY = "High Volatility",
}

/**
 * High-level classification categories for financial market benchmark indices.
 */
export enum IndexCategory {
  BROAD_MARKET = "BROAD_MARKET",
  FINANCIALS = "FINANCIALS",
  SECTORAL = "SECTORAL",
  VOLATILITY = "VOLATILITY",
}

/**
 * National Stock Exchange (NSE) & global market benchmarks.
 */
export enum MarketIndex {
  // Broad Market
  NIFTY_50 = "NIFTY 50",
  NIFTY_NEXT_50 = "NIFTY NEXT 50",
  NIFTY_100 = "NIFTY 100",
  NIFTY_MIDCAP_100 = "NIFTY MIDCAP 100",
  NIFTY_SMALLCAP_100 = "NIFTY SMALLCAP 100",
  NIFTY_500 = "NIFTY 500",

  // Banking & Financials
  BANKNIFTY = "BANKNIFTY",
  FINNIFTY = "FINNIFTY",
  NIFTY_PSU_BANK = "NIFTY PSU BANK",
  NIFTY_PVT_BANK = "NIFTY PVT BANK",

  // Sectoral Leaders
  NIFTY_IT = "NIFTY IT",
  NIFTY_AUTO = "NIFTY AUTO",
  NIFTY_PHARMA = "NIFTY PHARMA",
  NIFTY_FMCG = "NIFTY FMCG",
  NIFTY_METAL = "NIFTY METAL",
  NIFTY_ENERGY = "NIFTY ENERGY",
  NIFTY_REALTY = "NIFTY REALTY",
  NIFTY_INFRA = "NIFTY INFRA",

  // Volatility & Global
  INDIA_VIX = "INDIA VIX",
  SENSEX = "SENSEX",
  BRENT_CRUDE = "BRENT CRUDE",
}

/**
 * Canonical application route paths.
 */
export enum AppRoute {
  OVERVIEW = "/",
  PREDICTIONS = "/predictions",
  PREDICTIONS_DETAIL = "/predictions/$id",
  MONITOR = "/monitor",
  SCREENER = "/screener",
  PORTFOLIO = "/portfolio",
  CHAT = "/chat",
  SETTINGS = "/settings",
}
