/**
 * @file src/constants/market.constants.ts
 * @description Centralized domain enums and canonical constants for Indian financial markets & quantitative algorithms. */

/**
 * Major Indian stock market indices tracked by QuantAI.
 */
export enum MarketIndex {
  NIFTY_50 = "NIFTY_50",
  BANK_NIFTY = "BANK_NIFTY",
  NIFTY_FIN_SERVICE = "NIFTY_FIN_SERVICE",
  NIFTY_MIDCAP_100 = "NIFTY_MIDCAP_100",
  NIFTY_AUTO = "NIFTY_AUTO",
  NIFTY_IT = "NIFTY_IT",
  NIFTY_PHARMA = "NIFTY_PHARMA",
}

/**
 * Quantitative algorithmic signal directions.
 */
export enum SignalDirection {
  LONG = "LONG",
  SHORT = "SHORT",
  NEUTRAL = "NEUTRAL",
}

/**
 * Life-cycle execution states of a predictive signal.
 */
export enum SignalStatus {
  ACTIVE = "ACTIVE",
  TARGET_HIT = "TARGET_HIT",
  STOP_HIT = "STOP_HIT",
  INVALIDATED = "INVALIDATED",
  EXPIRED = "EXPIRED",
}

/**
 * Prediction forecast time horizons.
 */
export enum SignalHorizon {
  INTRADAY = "INTRADAY",
  SWING_1W = "SWING_1W",
  POSITIONAL_1M = "POSITIONAL_1M",
  MULTI_MONTH = "MULTI_MONTH",
}

/**
 * Macro market volatility & trend regimes.
 */
export enum MarketRegime {
  TRENDING_BULLISH = "TRENDING_BULLISH",
  TRENDING_BEARISH = "TRENDING_BEARISH",
  HIGH_VOLATILITY_CHOP = "HIGH_VOLATILITY_CHOP",
  LOW_VOLATILITY_RANGE = "LOW_VOLATILITY_RANGE",
}

/**
 * AI Reasoning Engine Model Providers.
 */
export enum ModelProvider {
  GEMINI_2_5_PRO = "GEMINI_2_5_PRO",
  GEMINI_2_5_FLASH = "GEMINI_2_5_FLASH",
  DEEPSEEK_R1 = "DEEPSEEK_R1",
  CLAUDE_3_7_SONNET = "CLAUDE_3_7_SONNET",
}

/**
 * Multi-Agent consensus deliberation roles.
 */
export enum AgentRole {
  MACRO_ANALYST = "MACRO_ANALYST",
  MOMENTUM_SPECIALIST = "MOMENTUM_SPECIALIST",
  VOLATILITY_SURFACE = "VOLATILITY_SURFACE",
  SYNTHESIS_LEAD = "SYNTHESIS_LEAD",
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
