/**
 * @file packages/finance-engine/test/finance-engine.test.ts
 * @description Comprehensive test suite for deterministic quantitative finance calculations.
 * @author yuva.devlab@gmail.com
 */

import { describe, expect, it } from "vitest";
import {
  calculateRsiFromSparkline,
  calculateReturnPercent,
  calculateUnrealizedPnl,
  calculateWinRate,
  calculateTradeExpectancy,
  calculateRiskRewardRatio,
  calculateMarketBreadth,
  classifySectorMomentum,
  calculatePortfolioValuations,
  StochasticPriceSimulator,
  TradePositionSide,
  RSI_DEFAULT_NEUTRAL,
  RSI_ZERO_LOSS_CEILING,
} from "../src";

describe("Deterministic Quantitative Finance Engine", () => {
  describe("RSI Calculations", () => {
    it("returns neutral RSI when sparkline is empty or single-point", () => {
      expect(calculateRsiFromSparkline([])).toBe(RSI_DEFAULT_NEUTRAL);
      expect(calculateRsiFromSparkline([100])).toBe(RSI_DEFAULT_NEUTRAL);
    });

    it("returns ceiling RSI when price monotonically increases (zero losses)", () => {
      const upwardSeries = [100, 102, 105, 108, 112];
      expect(calculateRsiFromSparkline(upwardSeries)).toBe(RSI_ZERO_LOSS_CEILING);
    });

    it("correctly computes standard RSI when both gains and losses occur", () => {
      const series = [100, 105, 102, 108, 104, 110];
      const rsi = calculateRsiFromSparkline(series);
      expect(rsi).toBeGreaterThan(50);
      expect(rsi).toBeLessThan(100);
    });
  });

  describe("PnL and Win Rate Calculations", () => {
    it("calculates long position unrealized PnL and return %", () => {
      const pnl = calculateUnrealizedPnl(100, 110, 50, TradePositionSide.LONG);
      const ret = calculateReturnPercent(100, 110, TradePositionSide.LONG);
      expect(pnl).toBe(500);
      expect(ret).toBe(10);
    });

    it("calculates short position unrealized PnL and return %", () => {
      const pnl = calculateUnrealizedPnl(100, 90, 50, TradePositionSide.SHORT);
      const ret = calculateReturnPercent(100, 90, TradePositionSide.SHORT);
      expect(pnl).toBe(500);
      expect(ret).toBe(10);
    });

    it("computes dynamic win rate string from closed executions", () => {
      expect(calculateWinRate(0, 0)).toBe("0.0%");
      expect(calculateWinRate(7, 10)).toBe("70.0%");
      expect(calculateWinRate(142, 181)).toBe("78.5%");
    });
  });

  describe("Trade Expectancy and Risk:Reward", () => {
    it("calculates exact Risk:Reward ratio", () => {
      const rr = calculateRiskRewardRatio(100, 110, 95);
      expect(rr).toBe(2.0);
    });

    it("computes probability-weighted mathematical expectancy", () => {
      const res = calculateTradeExpectancy({
        entryPrice: 100,
        targetPrice: 110,
        stopLossPrice: 95,
        winProbabilityPercent: 60,
        estimatedFrictionPercent: 0.1,
      });

      expect(res.riskRewardRatio).toBe(2.0);
      // Win: 0.6 * 10 = 6.0, Loss: 0.4 * 5 = 2.0, Net = 6.0 - 2.0 - 0.1 = 3.9
      expect(res.mathematicalExpectancy).toBe(3.9);
      expect(res.isStatisticallyViable).toBe(true);
    });
  });

  describe("Portfolio Valuations", () => {
    it("computes equity, margin used, and available margin with precision", () => {
      const valuations = calculatePortfolioValuations(1000000, 50000, [
        { entryPrice: 1000, qty: 100, pnl: 5000 },
        { entryPrice: 500, qty: 200, pnl: -2000 },
      ]);

      // totalEquity = 1,000,000 + 50,000 + (5000 - 2000) = 1,053,000
      expect(valuations.totalEquity).toBe(1053000);
      expect(valuations.unrealizedPnl).toBe(3000);
      // marginUsed = 1000*100 + 500*200 = 200,000
      expect(valuations.marginUsed).toBe(200000);
      // availableMargin = 1,053,000 - 200,000 = 853,000
      expect(valuations.availableMargin).toBe(853000);
    });
  });

  describe("Breadth and Sector Momentum", () => {
    const breadthConfig = {
      totalUniverseCount: 2000,
      fiiNetCr: 2145,
      diiNetCr: 1280,
      fiiCurrencyPrefix: "₹",
      fiiUnitSuffix: "Cr",
      vixLowThreshold: 15.0,
      vixHighThreshold: 22.0,
      bullishRegime: "Institutional Accumulation",
      cautiousRegime: "Distribution",
      neutralRegime: "Consolidation",
      lowVolText: "Low Volatility",
      elevatedVolText: "Elevated Volatility",
      highVolText: "Extreme Volatility",
    };

    it("evaluates breadth and classifies volatility regime", () => {
      const output = calculateMarketBreadth(
        { advances: 1200, declines: 600, unchanged: 200, indiaVix: 13.5 },
        breadthConfig,
      );
      expect(output.regimeType).toBe("Bullish");
      expect(output.volatilityEnv).toContain("Low Volatility");
      expect(output.fiiNet).toContain("+₹2,145 Cr");
    });

    it("classifies sector momentum based on thresholds", () => {
      const sectorConfig = {
        strongThreshold: 1.5,
        moderateThreshold: 0.5,
        weakThreshold: -1.0,
      };

      expect(classifySectorMomentum(2.1, sectorConfig)).toBe("Strong");
      expect(classifySectorMomentum(0.8, sectorConfig)).toBe("Moderate");
      expect(classifySectorMomentum(0.1, sectorConfig)).toBe("Neutral");
      expect(classifySectorMomentum(-1.5, sectorConfig)).toBe("Weak");
    });
  });

  describe("Stochastic Simulator", () => {
    it("generates deterministic entropy baselines without static price tables", () => {
      const sim = new StochasticPriceSimulator();
      const base1 = sim.computeBaselinePrice("NIFTY 50");
      const base2 = sim.computeBaselinePrice("NIFTY 50");
      expect(base1).toBe(base2);
      expect(base1).toBeGreaterThan(10000);

      const tick = sim.generateNextTick("RELIANCE.NS");
      expect(tick.symbol).toBe("RELIANCE.NS");
      expect(tick.price).toBeGreaterThan(0);
      expect(tick.sparkline.length).toBe(20);
    });
  });
});
