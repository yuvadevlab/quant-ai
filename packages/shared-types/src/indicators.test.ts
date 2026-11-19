import { describe, expect, it } from "vitest";
import {
  calculateAtr,
  calculateBollingerBands,
  calculateEma,
  calculateKeltnerChannels,
  calculateRsi,
  calculateSma,
  calculateVwap,
  detectVolatilitySqueeze,
} from "./indicators";

describe("Configurable Quantitative Indicators", () => {
  const samplePrices = [100, 102, 104, 103, 105, 107, 106, 108, 110, 112, 111, 113, 115, 114, 116];
  const sampleHighs = [101, 103, 105, 104, 106, 108, 107, 109, 111, 113, 112, 114, 116, 115, 117];
  const sampleLows = [99, 101, 103, 102, 104, 106, 105, 107, 109, 111, 110, 112, 114, 113, 115];
  const sampleVolumes = [
    1000, 1200, 1100, 1500, 1300, 1400, 1600, 1800, 2000, 2100, 1900, 2200, 2500, 2400, 2600,
  ];

  it("calculates SMA accurately for custom periods", () => {
    const sma5 = calculateSma(samplePrices, 5);
    expect(sma5.length).toBe(11);
    expect(sma5[0]).toBe(102.8);
  });

  it("calculates EMA with Wilder/exponential multiplier", () => {
    const ema5 = calculateEma(samplePrices, 5);
    expect(ema5.length).toBe(11);
    expect(ema5[0]).toBe(102.8);
    expect(ema5[1]).toBe(104.2);
  });

  it("calculates RSI with configurable threshold overrides", () => {
    const rsi = calculateRsi(samplePrices, { period: 5 });
    expect(rsi.length).toBeGreaterThan(0);
    const latestRsi = rsi[rsi.length - 1]!;
    expect(latestRsi).toBeGreaterThan(60);
    expect(latestRsi).toBeLessThanOrEqual(100);
  });

  it("calculates ATR reflecting price volatility", () => {
    const atr = calculateAtr(sampleHighs, sampleLows, samplePrices, { period: 5 });
    expect(atr.length).toBeGreaterThan(0);
    expect(atr[0]).toBeGreaterThan(0);
  });

  it("calculates Bollinger Bands with dynamic bandwidth", () => {
    const bb = calculateBollingerBands(samplePrices, { period: 5, stdDevMultiplier: 2.0 });
    expect(bb.middle.length).toBe(11);
    expect(bb.upper.length).toBe(11);
    expect(bb.lower.length).toBe(11);
    expect(bb.upper[0]).toBeGreaterThan(bb.middle[0]!);
    expect(bb.lower[0]).toBeLessThan(bb.middle[0]!);
  });

  it("calculates Keltner Channels envelope", () => {
    const kc = calculateKeltnerChannels(sampleHighs, sampleLows, samplePrices, {
      emaPeriod: 5,
      atrPeriod: 5,
      multiplier: 1.5,
    });
    expect(kc.middle.length).toBeGreaterThan(0);
    expect(kc.upper[0]).toBeGreaterThan(kc.lower[0]!);
  });

  it("detects Volatility Squeeze state correctly", () => {
    const squeeze = detectVolatilitySqueeze(
      sampleHighs,
      sampleLows,
      samplePrices,
      { period: 5 },
      {
        emaPeriod: 5,
        atrPeriod: 5,
        multiplier: 3.0, // Wider keltner to force squeeze
      },
    );
    expect(squeeze.isSqueezing).toBe(true);
    expect(squeeze.squeezePeriods).toBeGreaterThan(0);
  });

  it("calculates VWAP and multi-sigma bands", () => {
    const vwap = calculateVwap(sampleHighs, sampleLows, samplePrices, sampleVolumes, {
      stdDevMultipliers: [1.0, 2.0],
    });
    expect(vwap.vwap.length).toBe(samplePrices.length);
    expect(vwap.upperBands.length).toBe(2);
    expect(vwap.lowerBands.length).toBe(2);
    expect(vwap.upperBands[0]![5]).toBeGreaterThan(vwap.vwap[5]!);
    expect(vwap.lowerBands[0]![5]).toBeLessThan(vwap.vwap[5]!);
  });
});
