/**
 * @fileoverview Canonical financial market, strategy, asset class, and prediction state enums.
 */

/**
 * Supported AI model provider backends for quantitative deliberation and research.
 */
export enum ModelProvider {
  GEMINI = "gemini",
  ANTHROPIC = "anthropic",
  GROQ = "groq",
  OLLAMA = "ollama",
  SIMULATED = "simulated",
}

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
 * Reliability state for market observations used by analysis and outcome tracking.
 */
export enum MarketDataStatus {
  VERIFIED = "VERIFIED",
  PROVIDER_UNVERIFIED = "PROVIDER_UNVERIFIED",
  MARKET_CLOSED = "MARKET_CLOSED",
  STALE = "STALE",
  SIMULATED = "SIMULATED",
  UNAVAILABLE = "UNAVAILABLE",
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
 * Trading execution strategy category across multi-asset universes.
 */
export enum TradeStrategy {
  INTRADAY_SCALP = "SCALP",
  SWING = "SWING",
  OPTIONS_EXPIRY = "OPTIONS",
  ALGO = "ALGO",
  POSITIONAL_INVESTMENT = "INVESTMENT",
}

/**
 * High-level financial asset classification.
 */
export enum AssetClass {
  INDEX = "INDEX",
  EQUITY = "EQUITY",
  OPTION = "OPTION",
  FUTURE = "FUTURE",
  CRYPTO = "CRYPTO",
  COMMODITY = "COMMODITY",
  FOREX = "FOREX",
}

/**
 * Options derivative contract type.
 */
export enum OptionType {
  CALL = "CE",
  PUT = "PE",
}

/**
 * Trade execution horizon & holding duration.
 */
export enum TradeHorizon {
  M5_SCALP = "5M_SCALP",
  M15_SCALP = "15M_SCALP",
  INTRADAY = "INTRADAY",
  EXPIRY_ZERO_DTE = "0DTE_EXPIRY",
  EXPIRY_WEEKLY = "WEEKLY_EXPIRY",
  SWING_DAYS = "SWING_DAYS",
  SWING_WEEKS = "SWING_WEEKS",
  POSITIONAL_MONTHS = "POSITIONAL_MONTHS",
}

/**
 * Global market exchange identifier.
 */
export enum MarketExchange {
  NSE = "NSE",
  BSE = "BSE",
  NASDAQ = "NASDAQ",
  NYSE = "NYSE",
  BINANCE = "BINANCE",
  CME = "CME",
  GLOBAL = "GLOBAL",
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
