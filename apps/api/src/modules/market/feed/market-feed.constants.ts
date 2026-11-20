/**
 * @file apps/api/src/modules/market/feed/market-feed.constants.ts
 * @description Centralized constants and mapping rules for global and regional market feeds.
 * @author yuva.devlab@gmail.com
 */

export const GLOBAL_FEED_SYMBOL_MAP: Readonly<Record<string, string>> = Object.freeze({
  // Broad Market Benchmark Indices
  "NIFTY 50": "^NSEI",
  NIFTY: "^NSEI",
  "NIFTY NEXT 50": "^NSMIDCP",
  "NIFTY 100": "^CNX100",
  "NIFTY MIDCAP 100": "NIFTY_MIDCAP_100.NS",
  "NIFTY SMALLCAP 100": "^CNXSC",
  "NIFTY 500": "^CRSLDX",
  SENSEX: "^BSESN",

  // Financials
  BANKNIFTY: "^NSEBANK",
  "BANK NIFTY": "^NSEBANK",
  FINNIFTY: "^CNXFIN",
  "NIFTY PSU BANK": "^CNXPSUBANK",
  "NIFTY PVT BANK": "NIFTY_PVT_BANK.NS",

  // Sectoral Indices
  "NIFTY IT": "^CNXIT",
  "NIFTY AUTO": "^CNXAUTO",
  "NIFTY PHARMA": "^CNXPHARMA",
  "NIFTY FMCG": "^CNXFMCG",
  "NIFTY METAL": "^CNXMETAL",
  "NIFTY ENERGY": "^CNXENERGY",
  "NIFTY REALTY": "^CNXREALTY",
  "NIFTY INFRA": "^CNXINFRA",
  "NIFTY MNC": "^CNXMNC",
  "NIFTY PSE": "^CNXPSE",
  "NIFTY SERVICES": "^CNXSERVICE",

  // Volatility & Global Macro
  "INDIA VIX": "^INDIAVIX",
  "BRENT CRUDE": "BZ=F",
  GOLD: "GC=F",
  BTC: "BTC-USD",
  BITCOIN: "BTC-USD",
});

export const INDIAN_BLUE_CHIP_SYMBOLS: readonly string[] = [
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "INFY",
  "ICICIBANK",
  "SBIN",
  "LT",
];
