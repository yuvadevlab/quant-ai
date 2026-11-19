/**
 * @fileoverview Unit tests for deterministic quantitative math formulas. */

import { describe, expect, it } from "vitest";
import { SignalDirection } from "./enums";
import { calculateBrierScore, calculateMae, calculateMfe } from "./math";

describe("Quantitative Financial Math", () => {
  it("calculates MFE correctly for LONG signals", () => {
    const mfe = calculateMfe(100, 125, 95, SignalDirection.LONG);
    expect(mfe).toBe(25);
  });

  it("calculates MAE correctly for LONG signals", () => {
    const mae = calculateMae(100, 125, 95, SignalDirection.LONG);
    expect(mae).toBe(5);
  });

  it("calculates MFE correctly for SHORT signals", () => {
    const mfe = calculateMfe(100, 105, 75, SignalDirection.SHORT);
    expect(mfe).toBe(25);
  });

  it("calculates MAE correctly for SHORT signals", () => {
    const mae = calculateMae(100, 105, 75, SignalDirection.SHORT);
    expect(mae).toBe(5);
  });

  it("computes Brier score for well-calibrated predictions", () => {
    const forecasts = [0.8, 0.7, 0.9, 0.2];
    const outcomes: (0 | 1)[] = [1, 1, 1, 0];
    const score = calculateBrierScore(forecasts, outcomes);
    expect(score).toBeLessThan(0.05);
  });
});
