/**
 * @fileoverview Universal dynamic instrument and options derivative type contracts.
 * @author yuva.devlab@gmail.com
 */

import { AssetClass, MarketExchange, OptionType, TradeStrategy } from "./enums";

/**
 * Options sensitivity parameters (The Greeks).
 */
export interface OptionGreeks {
  readonly delta: number;
  readonly gamma: number;
  readonly theta: number;
  readonly vega: number;
  readonly rho?: number;
  readonly impliedVolatility: number;
}

/**
 * Derivative contract specification for options trades.
 */
export interface OptionContractDetails {
  readonly underlyingSymbol: string;
  readonly strikePrice: number;
  readonly optionType: OptionType;
  readonly expiryDate: string;
  readonly lotSize?: number;
  readonly greeks?: OptionGreeks;
}

/**
 * Universal dynamic financial instrument specification.
 */
export interface DynamicInstrument {
  readonly symbol: string;
  readonly name: string;
  readonly assetClass: AssetClass;
  readonly exchange: MarketExchange;
  readonly currency: string;
  readonly primaryStrategy?: TradeStrategy;
  readonly optionDetails?: OptionContractDetails;
}
