/**
 * @file apps/api/src/modules/market/feed/stochastic-market.simulator.ts
 * @description Stochastic market tick generator using Geometric Brownian Motion (GBM).
 * Computes dynamic baseline prices dynamically from symbol entropy without static price tables.
 */

import { Injectable } from "@nestjs/common";
import { MarketDataStatus } from "@quant-ai/shared-types";
import type { LiveMarketQuote } from "./market-feed.types";

/**
 * Institutional stochastic price simulator for testing and offline execution.
 */
@Injectable()
export class StochasticMarketSimulator {
  private readonly cachedPrices = new Map<string, number>();

  /**
   * Generates next stochastic tick for any symbol.
   *
   * @param symbol Universal instrument ticker or contract string.
   * @param overrideBase Optional starting price.
   * @returns Synthesized LiveMarketQuote.
   */
  public generateNextQuote(symbol: string, overrideBase?: number): LiveMarketQuote {
    const currentPrice =
      overrideBase ?? this.cachedPrices.get(symbol) ?? this.computeDynamicBaseline(symbol);

    // Standard normal via Box-Muller transform
    const u1 = Math.max(1e-6, Math.random());
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Annualized parameters scaled to 1-second drift
    const drift = 0.00001;
    const volatility = 0.0012;
    const shock = drift - 0.5 * volatility * volatility + volatility * z;

    const nextPrice = Number((currentPrice * Math.exp(shock)).toFixed(2));
    this.cachedPrices.set(symbol, nextPrice);

    const basePrice = this.computeDynamicBaseline(symbol);
    const change = Number((nextPrice - basePrice).toFixed(2));
    const percentChange = Number(((change / basePrice) * 100).toFixed(2));

    const sparkline = this.generateSyntheticSparkline(nextPrice);

    return {
      symbol,
      displayName: symbol,
      price: nextPrice,
      change,
      percentChange,
      dayHigh: Number((Math.max(nextPrice, basePrice) * 1.008).toFixed(2)),
      dayLow: Number((Math.min(nextPrice, basePrice) * 0.992).toFixed(2)),
      volume: Math.floor(100000 + Math.random() * 500000),
      currency: this.inferCurrency(symbol),
      exchange: this.inferExchange(symbol),
      instrumentType: this.inferInstrumentType(symbol),
      sparkline,
      source: "Synthetic simulator",
      dataStatus: MarketDataStatus.SIMULATED,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Derives a deterministic positive base price from symbol entropy.
   */
  public computeDynamicBaseline(symbol: string): number {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = (hash << 5) - hash + symbol.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);

    // Map into realistic financial price bands
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

  private generateSyntheticSparkline(centerPrice: number): readonly number[] {
    const points: number[] = [];
    let p = centerPrice * 0.99;
    for (let i = 0; i < 20; i++) {
      p += (Math.random() - 0.49) * (centerPrice * 0.002);
      points.push(Number(p.toFixed(2)));
    }
    points[points.length - 1] = centerPrice;
    return points;
  }

  private inferCurrency(symbol: string): string {
    if (symbol.endsWith(".NS") || symbol.includes("NIFTY") || symbol.includes("SENSEX")) {
      return "INR";
    }
    return "USD";
  }

  private inferExchange(symbol: string): string {
    if (symbol.endsWith(".NS") || symbol.includes("NIFTY") || symbol.includes("SENSEX")) {
      return "NSE";
    }
    if (symbol.includes("-USD")) {
      return "CRYPTO";
    }
    return "NASDAQ";
  }

  private inferInstrumentType(symbol: string): string {
    if (symbol.includes("CE") || symbol.includes("PE")) {
      return "OPTION";
    }
    if (symbol.startsWith("^") || symbol.includes("NIFTY") || symbol.includes("SENSEX")) {
      return "INDEX";
    }
    return "EQUITY";
  }
}
