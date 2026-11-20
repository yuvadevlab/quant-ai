/**
 * @file apps/api/src/modules/market/feed/market-feed.constants.ts
 * @description Centralized constants and mapping rules for global and regional market feeds.
 * @author yuva.devlab@gmail.com
 */

export const GLOBAL_FEED_SYMBOL_MAP: Readonly<Record<string, string>> = {
  "NIFTY 50": "^NSEI",
  NIFTY: "^NSEI",
  BANKNIFTY: "^NSEBANK",
  "BANK NIFTY": "^NSEBANK",
  SENSEX: "^BSESN",
  "INDIA VIX": "^INDIAVIX",
  "BRENT CRUDE": "BZ=F",
  GOLD: "GC=F",
  BTC: "BTC-USD",
  BITCOIN: "BTC-USD",
};

export const INDIAN_BLUE_CHIP_SYMBOLS: readonly string[] = [
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "INFY",
  "ICICIBANK",
  "SBIN",
  "LT",
];
