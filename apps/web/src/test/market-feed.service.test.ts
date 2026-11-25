/**
 * @fileoverview Prevents simulated benchmark values from appearing as market quotes.
 */

import { describe, expect, it } from "vitest";
import { IndexCategory, MarketDataStatus } from "@quant-ai/shared-types";
import { mapIndexQuoteToTick } from "@/services/market-feed.service";

describe("mapIndexQuoteToTick", () => {
  const quote = {
    symbol: "NIFTY 50",
    category: IndexCategory.BROAD_MARKET,
    price: 22_904.15,
    change: 12.5,
    changePercent: 0.1,
    sparkline: [22_890, 22_904.15],
    dataSource: "Synthetic simulator",
  };

  it("hides simulator values instead of styling them as live prices", () => {
    const tick = mapIndexQuoteToTick({
      ...quote,
      dataStatus: MarketDataStatus.SIMULATED,
    });

    expect(tick.price).toBe("—");
    expect(tick.change).toBe("—");
    expect(tick.path).toBe("");
  });

  it("keeps a provider closing snapshot visible with its provenance", () => {
    const tick = mapIndexQuoteToTick({
      ...quote,
      price: 25_819.25,
      dataStatus: MarketDataStatus.MARKET_CLOSED,
      observedAt: "2026-11-25T10:01:00.000Z",
    });

    expect(tick.price).toBe("25,819.25");
    expect(tick.dataStatus).toBe(MarketDataStatus.MARKET_CLOSED);
    expect(tick.observedAt).toBe("2026-11-25T10:01:00.000Z");
  });
});
