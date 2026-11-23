/**
 * @file packages/shared-types/src/universe.constants.ts
 * @description Canonical Indian market equity universe reference registry (NSE constituents).
 * Represents market instrument master data, NOT prediction outcomes or trade seeds.
 * @author yuva.devlab@gmail.com
 */

export interface MarketEquityDefinition {
  readonly symbol: string;
  readonly company: string;
  readonly sector: string;
  readonly exchange: string;
}

/**
 * Institutional equity universe reference registry across primary Indian market sectors.
 */
export const MARKET_EQUITY_REGISTRY: readonly MarketEquityDefinition[] = Object.freeze([
  // Financial Services & Banking
  { symbol: "HDFCBANK", company: "HDFC Bank Ltd", sector: "Banking", exchange: "NSE" },
  { symbol: "ICICIBANK", company: "ICICI Bank Ltd", sector: "Banking", exchange: "NSE" },
  { symbol: "SBIN", company: "State Bank of India", sector: "Banking", exchange: "NSE" },
  { symbol: "KOTAKBANK", company: "Kotak Mahindra Bank Ltd", sector: "Banking", exchange: "NSE" },
  { symbol: "AXISBANK", company: "Axis Bank Ltd", sector: "Banking", exchange: "NSE" },
  {
    symbol: "BAJFINANCE",
    company: "Bajaj Finance Ltd",
    sector: "Financial Services",
    exchange: "NSE",
  },

  // Information Technology
  {
    symbol: "TCS",
    company: "Tata Consultancy Services Ltd",
    sector: "Information Technology",
    exchange: "NSE",
  },
  { symbol: "INFY", company: "Infosys Ltd", sector: "Information Technology", exchange: "NSE" },
  {
    symbol: "HCLTECH",
    company: "HCL Technologies Ltd",
    sector: "Information Technology",
    exchange: "NSE",
  },
  { symbol: "WIPRO", company: "Wipro Ltd", sector: "Information Technology", exchange: "NSE" },

  // Energy & Oil
  { symbol: "RELIANCE", company: "Reliance Industries Ltd", sector: "Energy", exchange: "NSE" },
  {
    symbol: "ONGC",
    company: "Oil & Natural Gas Corporation Ltd",
    sector: "Energy",
    exchange: "NSE",
  },
  { symbol: "NTPC", company: "NTPC Ltd", sector: "Energy", exchange: "NSE" },
  {
    symbol: "POWERGRID",
    company: "Power Grid Corporation of India",
    sector: "Energy",
    exchange: "NSE",
  },

  // Metals & Mining
  { symbol: "TATASTEEL", company: "Tata Steel Ltd", sector: "Metals", exchange: "NSE" },
  { symbol: "JSWSTEEL", company: "JSW Steel Ltd", sector: "Metals", exchange: "NSE" },
  { symbol: "HINDALCO", company: "Hindalco Industries Ltd", sector: "Metals", exchange: "NSE" },

  // Automobiles
  { symbol: "TATAMOTORS", company: "Tata Motors Ltd", sector: "Automobile", exchange: "NSE" },
  { symbol: "MARUTI", company: "Maruti Suzuki India Ltd", sector: "Automobile", exchange: "NSE" },
  { symbol: "M&M", company: "Mahindra & Mahindra Ltd", sector: "Automobile", exchange: "NSE" },

  // Consumer & FMCG
  { symbol: "HINDUNILVR", company: "Hindustan Unilever Ltd", sector: "FMCG", exchange: "NSE" },
  { symbol: "ITC", company: "ITC Ltd", sector: "FMCG", exchange: "NSE" },
  { symbol: "TITAN", company: "Titan Company Ltd", sector: "Consumer", exchange: "NSE" },

  // Infrastructure & Telecom
  { symbol: "LT", company: "Larsen & Toubro Ltd", sector: "Infrastructure", exchange: "NSE" },
  {
    symbol: "BHARTIARTL",
    company: "Bharti Airtel Ltd",
    sector: "Telecommunication",
    exchange: "NSE",
  },
]);
