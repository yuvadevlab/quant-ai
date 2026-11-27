/**
 * @file packages/shared-types/src/universe.constants.ts
 * @description Canonical Indian market equity universe reference registry (NSE constituents).
 * Represents market instrument master data, NOT prediction outcomes or trade seeds.
 */

export interface MarketEquityDefinition {
  readonly symbol: string;
  readonly company: string;
  readonly sector: string;
  readonly exchange: string;
}

/**
 * Dynamic equity universe reference registry. Zero hardcoded stocks.
 * Symbols enter dynamically via user search, watchlists, and live market feeds.
 */
export const MARKET_EQUITY_REGISTRY: readonly MarketEquityDefinition[] = Object.freeze([]);
