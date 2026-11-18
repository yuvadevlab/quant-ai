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
 * National Stock Exchange (NSE) & global market benchmarks.
 */
export enum MarketIndex {
  NIFTY_50 = "NIFTY 50",
  BANKNIFTY = "BANKNIFTY",
  FINNIFTY = "FINNIFTY",
  SENSEX = "SENSEX",
  BRENT_CRUDE = "BRENT CRUDE",
  INDIA_VIX = "INDIA VIX",
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
