/**
 * @file src/constants/market.constants.ts
 * @description Centralized domain enums and canonical constants for financial markets, UI tabs, and strategies.
 */

export {
  AssetClass,
  IndexCategory,
  ModelProvider,
  OptionType,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeHorizon,
  TradeStrategy,
} from "@quant-ai/shared-types";

/**
 * High-level prediction forecast time horizons for UI filters.
 */
export enum SignalHorizon {
  INTRADAY = "INTRADAY",
  SWING_1W = "SWING_1W",
  POSITIONAL_1M = "POSITIONAL_1M",
  MULTI_MONTH = "MULTI_MONTH",
  OPTIONS = "OPTIONS",
  SCALP = "SCALP",
}

/**
 * Filter tabs for index grid views.
 */
export enum IndexCategoryFilter {
  ALL = "ALL",
  BROAD_MARKET = "BROAD_MARKET",
  FINANCIALS = "FINANCIALS",
  SECTORAL = "SECTORAL",
  VOLATILITY = "VOLATILITY",
}

/**
 * Prediction Lab Filter Tabs.
 */
export enum LedgerFilterTab {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  TARGET_HIT = "TARGET_HIT",
  STOP_HIT = "STOP_HIT",
}

/**
 * Screener category filter tabs.
 */
export enum ScreenerTab {
  ALL = "all",
  BREAKOUTS = "breakouts",
  OPTIONS = "options",
  MOMENTUM = "momentum",
}

/**
 * Chat conversation actor types.
 */
export enum ChatMessageType {
  ASSISTANT = "assistant",
  USER = "user",
}

/**
 * Order execution sides.
 */
export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

/**
 * Portfolio position directional sides.
 */
export enum PositionSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

/**
 * Filter constants for UI horizon and sector dropdowns.
 */
export enum HorizonFilter {
  ALL = "All styles",
}

export enum SectorFilter {
  ALL = "ALL",
}
