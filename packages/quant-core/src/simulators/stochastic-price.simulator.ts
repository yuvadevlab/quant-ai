/**
 * @file packages/finance-engine/src/simulators/stochastic-price.simulator.ts
 * @description Stochastic price simulator using Geometric Brownian Motion (GBM) with Box-Muller transform.
 * For offline testing, Monte Carlo risk simulation, and local development.
 * @author yuva.devlab@gmail.com
 */

import {
  CurrencyCode,
  ExchangeCode,
  ExchangeSuffix,
  InstrumentTypeCode,
} from "../constants/market-symbols.constants";
import {
  DEFAULT_CURRENCY_DECIMAL_PLACES,
  DEFAULT_PERCENT_DECIMAL_PLACES,
  PERCENTAGE_MULTIPLIER,
} from "../constants/technical.constants";

export const GBM_DRIFT_FACTOR = 0.00001;
export const GBM_VOLATILITY_FACTOR = 0.0012;
export const BOX_MULLER_MIN_EPSILON = 1e-6;
export const SIMULATED_SPARKLINE_POINTS = 20;
export const DAY_HIGH_SPREAD_MULTIPLIER = 1.008;
export const DAY_LOW_SPREAD_MULTIPLIER = 0.992;

export interface SimulatedPriceTick {
  readonly symbol: string;
  readonly price: number;
  readonly change: number;
  readonly percentChange: number;
  readonly dayHigh: number;
  readonly dayLow: number;
  readonly volume: number;
  readonly currency: CurrencyCode;
  readonly exchange: ExchangeCode;
  readonly instrumentType: InstrumentTypeCode;
  readonly sparkline: readonly number[];
  readonly timestamp: string;
}

/**
 * Institutional Geometric Brownian Motion (GBM) generator for price modeling.
 */
export class StochasticPriceSimulator {
  private readonly cachedPrices = new Map<string, number>();

  /**
   * Generates next stochastic tick for any symbol.
   */
  public generateNextTick(symbol: string, overrideBase?: number): SimulatedPriceTick {
    const currentPrice =
      overrideBase ?? this.cachedPrices.get(symbol) ?? this.computeBaselinePrice(symbol);

    // Standard normal variable via Box-Muller transform
    const u1 = Math.max(BOX_MULLER_MIN_EPSILON, Math.random());
    const u2 = Math.random();
    const standardNormalZ = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Stochastic exponential drift shock: drift - (0.5 * sigma^2) + (sigma * Z)
    const driftTerm = GBM_DRIFT_FACTOR - 0.5 * Math.pow(GBM_VOLATILITY_FACTOR, 2);
    const diffusionTerm = GBM_VOLATILITY_FACTOR * standardNormalZ;
    const priceShock = driftTerm + diffusionTerm;

    const nextPrice = Number(
      (currentPrice * Math.exp(priceShock)).toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES),
    );
    this.cachedPrices.set(symbol, nextPrice);

    const baselinePrice = this.computeBaselinePrice(symbol);
    const change = Number((nextPrice - baselinePrice).toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES));
    const percentChange = Number(
      (((nextPrice - baselinePrice) / baselinePrice) * PERCENTAGE_MULTIPLIER).toFixed(
        DEFAULT_PERCENT_DECIMAL_PLACES,
      ),
    );

    return {
      symbol,
      price: nextPrice,
      change,
      percentChange,
      dayHigh: Number((Math.max(nextPrice, baselinePrice) * DAY_HIGH_SPREAD_MULTIPLIER).toFixed(2)),
      dayLow: Number((Math.min(nextPrice, baselinePrice) * DAY_LOW_SPREAD_MULTIPLIER).toFixed(2)),
      volume: Math.floor(100000 + Math.random() * 500000),
      currency: this.inferCurrency(symbol),
      exchange: this.inferExchange(symbol),
      instrumentType: this.inferInstrumentType(symbol),
      sparkline: this.generateSparkline(nextPrice),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Computes baseline price using hash entropy band mapping.
   */
  public computeBaselinePrice(symbol: string): number {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = (hash << 5) - hash + symbol.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);

    if (symbol.includes("CE") || symbol.includes("PE")) {
      return Number(((positiveHash % 400) + 50).toFixed(2));
    }
    if (symbol.includes("BTC") || symbol.includes("CRYPTO")) {
      return Number(((positiveHash % 40000) + 40000).toFixed(2));
    }
    if (symbol.startsWith("^") || symbol.includes("NIFTY")) {
      return Number(((positiveHash % 15000) + 15000).toFixed(2));
    }
    return Number(((positiveHash % 3000) + 500).toFixed(2));
  }

  private generateSparkline(centerPrice: number): readonly number[] {
    const points: number[] = [];
    let p = centerPrice * 0.99;
    for (let i = 0; i < SIMULATED_SPARKLINE_POINTS; i++) {
      p += (Math.random() - 0.49) * (centerPrice * 0.002);
      points.push(Number(p.toFixed(2)));
    }
    points[points.length - 1] = centerPrice;
    return points;
  }

  public inferCurrency(symbol: string): CurrencyCode {
    if (
      symbol.endsWith(ExchangeSuffix.NSE) ||
      symbol.includes("NIFTY") ||
      symbol.includes("SENSEX")
    ) {
      return CurrencyCode.INR;
    }
    return CurrencyCode.USD;
  }

  public inferExchange(symbol: string): ExchangeCode {
    if (
      symbol.endsWith(ExchangeSuffix.NSE) ||
      symbol.includes("NIFTY") ||
      symbol.includes("SENSEX")
    ) {
      return ExchangeCode.NSE;
    }
    if (symbol.includes(ExchangeSuffix.CRYPTO_USD)) {
      return ExchangeCode.CRYPTO;
    }
    return ExchangeCode.NASDAQ;
  }

  public inferInstrumentType(symbol: string): InstrumentTypeCode {
    if (symbol.includes("CE") || symbol.includes("PE")) {
      return InstrumentTypeCode.OPTION;
    }
    if (symbol.startsWith("^") || symbol.includes("NIFTY") || symbol.includes("SENSEX")) {
      return InstrumentTypeCode.INDEX;
    }
    return InstrumentTypeCode.EQUITY;
  }
}
