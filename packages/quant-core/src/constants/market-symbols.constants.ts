/**
 * @file packages/finance-engine/src/constants/market-symbols.constants.ts
 * @description Centralized enums for multi-asset exchanges, currencies, suffixes, and instruments.
 */

/**
 * Standard global exchange ticker suffixes.
 */
export enum ExchangeSuffix {
  NSE = ".NS",
  BSE = ".BO",
  CRYPTO_USD = "-USD",
  FUTURES_CONTINUOUS = "=F",
}

/**
 * Global financial market exchanges.
 */
export enum ExchangeCode {
  NSE = "NSE",
  BSE = "BSE",
  NASDAQ = "NASDAQ",
  NYSE = "NYSE",
  CRYPTO = "CRYPTO",
  COMMODITIES = "COMMODITIES",
}

/**
 * Supported transactional and display currencies.
 */
export enum CurrencyCode {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

/**
 * Financial instrument classifications.
 */
export enum InstrumentTypeCode {
  EQUITY = "EQUITY",
  INDEX = "INDEX",
  OPTION = "OPTION",
  FUTURES = "FUTURES",
  CRYPTO = "CRYPTO",
  COMMODITY = "COMMODITY",
}

/**
 * Currency display glyphs.
 */
export enum CurrencyGlyph {
  INR = "₹",
  USD = "$",
  EUR = "€",
  GBP = "£",
}
