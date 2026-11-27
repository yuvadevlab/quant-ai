/**
 * @fileoverview Tests Indian-session market quote freshness classification.
 */

import { describe, expect, it } from "vitest";
import { MarketDataStatus } from "@quant-ai/shared-types";
import {
  classifyMarketDataStatus,
  isUsableMarketDataStatus,
} from "../src/modules/market/feed/market-data-status";

describe("classifyMarketDataStatus", () => {
  it("accepts a same-day NSE closing snapshot after the session closes", () => {
    const observedAt = new Date("2026-11-25T10:01:00.000Z");
    const now = new Date("2026-11-25T11:30:00.000Z");

    expect(classifyMarketDataStatus(observedAt, now)).toBe(MarketDataStatus.MARKET_CLOSED);
  });

  it("marks a recent in-session quote as provider-unverified", () => {
    const observedAt = new Date("2026-11-25T08:30:00.000Z");
    const now = new Date("2026-11-25T08:40:00.000Z");

    expect(classifyMarketDataStatus(observedAt, now)).toBe(MarketDataStatus.PROVIDER_UNVERIFIED);
  });

  it("does not treat a weekend observation as an NSE closing snapshot", () => {
    const observedAt = new Date("2026-11-28T10:01:00.000Z");
    const now = new Date("2026-11-28T11:30:00.000Z");

    expect(classifyMarketDataStatus(observedAt, now)).toBe(MarketDataStatus.STALE);
  });

  it("rejects future-dated provider observations", () => {
    const observedAt = new Date("2026-11-25T12:00:00.000Z");
    const now = new Date("2026-11-25T11:30:00.000Z");

    expect(classifyMarketDataStatus(observedAt, now)).toBe(MarketDataStatus.STALE);
  });

  it("allows only provider-backed statuses for price analysis", () => {
    expect(isUsableMarketDataStatus(MarketDataStatus.MARKET_CLOSED)).toBe(true);
    expect(isUsableMarketDataStatus(MarketDataStatus.SIMULATED)).toBe(false);
    expect(isUsableMarketDataStatus(MarketDataStatus.STALE)).toBe(false);
    expect(isUsableMarketDataStatus(MarketDataStatus.UNAVAILABLE)).toBe(false);
  });
});
