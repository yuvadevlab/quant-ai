/**
 * @file src/test/telemetry.util.test.ts
 * @description Unit tests for dynamic mathematical telemetry and signal ledger calculations.
 * @author yuva.devlab@gmail.com
 */

import { describe, it, expect } from "vitest";
import { calculateSignalsTelemetry } from "@/hooks/telemetry.util";
import type { Signal } from "@/components/quantai/data";
import { UiSignalStatus } from "@/components/quantai/data";

function createMockSignal(overrides: Partial<Signal>): Signal {
  return {
    id: "SIG-001",
    symbol: "TCS",
    companyName: "Tata Consultancy Services",
    instrument: "NSE · Cash",
    direction: "BUY",
    horizon: "Intraday",
    entry: "₹3,500",
    entryPrice: 3500,
    target1: "₹3,600",
    target2: "₹3,650",
    stop: "₹3,450",
    last: "₹3,550",
    change: "+1.4%",
    mfe: "+2.0%",
    mae: "−0.5%",
    status: UiSignalStatus.ACTIVE,
    time: "Live Feed",
    confidence: "85%",
    riskReward: "1:2.0",
    catalysts: ["Breakout"],
    agents: {
      technical: { score: 85, verdict: "Bullish" },
      quant: { score: 82, verdict: "Positive expectancy" },
      optionsFlow: { score: 80, verdict: "Call build" },
      riskGuardian: { score: 84, verdict: "Risk defined" },
    },
    ...overrides,
  };
}

describe("calculateSignalsTelemetry", () => {
  it("provides valid zero-state metrics when no signals exist", () => {
    const result = calculateSignalsTelemetry([]);
    expect(result.totalSignals).toBe(0);
    expect(result.activeCount).toBe(0);
    expect(result.targetHitCount).toBe(0);
    expect(result.stopHitCount).toBe(0);
    expect(result.winRatePercent).toBe("—");
    expect(result.winRateBadge).toBe("0 settled");
    expect(result.profitFactor).toBe("—");
    expect(result.riskReward).toBe("—");
    expect(result.avgGainText).toBe("+0.0% avg gain");
    expect(result.avgLossText).toBe("−0.0% avg loss");
    expect(result.holdingHint).toBe("Horizon: Intraday · Swing");
  });

  it("calculates accurate win-rate, profit factor, and holding hint dynamically", () => {
    const signals: Signal[] = [
      createMockSignal({
        id: "SIG-1",
        status: UiSignalStatus.TARGET_HIT,
        metricEligible: true,
        outcomePrice: 110,
        entryPrice: 100,
        horizon: "Intraday",
        entry: "₹100",
        target1: "₹110",
        stop: "₹95",
      }),
      createMockSignal({
        id: "SIG-2",
        status: UiSignalStatus.TARGET_HIT,
        metricEligible: true,
        outcomePrice: 2625,
        entryPrice: 2500,
        horizon: "Intraday",
        entry: "₹2,500",
        target1: "₹2,625",
        stop: "₹2,425",
      }),
      createMockSignal({
        id: "SIG-3",
        status: UiSignalStatus.STOP_HIT,
        metricEligible: true,
        outcomePrice: 190,
        entryPrice: 200,
        horizon: "Swing",
        target1: "220",
        stop: "190",
      }),
      createMockSignal({
        id: "SIG-4",
        status: UiSignalStatus.ACTIVE,
        horizon: "Options",
        entryPrice: 50,
        target1: "60",
        stop: "45",
      }),
    ];

    const telemetry = calculateSignalsTelemetry(signals);

    expect(telemetry.totalSignals).toBe(4);
    expect(telemetry.activeCount).toBe(1);
    expect(telemetry.targetHitCount).toBe(2);
    expect(telemetry.stopHitCount).toBe(1);

    // Two eligible target outcomes out of three completed outcomes.
    expect(telemetry.winRatePercent).toBe("66.7%");
    expect(telemetry.winRateBadge).toBe("3 settled");

    // Dynamic holding hint reflecting actual active distributions
    expect(telemetry.holdingHint).toBe("Active: 2 Intraday · 1 Swing · 1 Options");
    expect(telemetry.profitFactor).toBe("3.00");
  });

  it("excludes unverified outcomes from performance calculations", () => {
    const telemetry = calculateSignalsTelemetry([
      createMockSignal({
        status: UiSignalStatus.TARGET_HIT,
        outcomePrice: 110,
        metricEligible: false,
      }),
    ]);

    expect(telemetry.winRatePercent).toBe("—");
    expect(telemetry.winRateBadge).toBe("0 settled");
    expect(telemetry.profitFactor).toBe("—");
    expect(telemetry.targetHitCount).toBe(0);
    expect(telemetry.stopHitCount).toBe(0);
  });
});
