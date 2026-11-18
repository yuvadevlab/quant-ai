import { describe, expect, it } from "vitest";
import { MarketService } from "../src/modules/market/market.service";
import { PredictionsService } from "../src/modules/predictions/predictions.service";
import { ScreenerService } from "../src/modules/screener/screener.service";

describe("NestJS Domain Services", () => {
  it("MarketService provides benchmark indices with sparklines", () => {
    const service = new MarketService();
    const indices = service.getBenchmarkIndices();
    expect(indices.length).toBeGreaterThanOrEqual(4);
    expect(indices[0]?.sparkline.length).toBeGreaterThan(0);
  });

  it("PredictionsService returns active prediction PRED-8942", () => {
    const service = new PredictionsService();
    const prediction = service.findById("PRED-8942");
    expect(prediction.ticker).toBe("RELIANCE");
    expect(prediction.entry).toBe(2985);
  });

  it("ScreenerService filters volume surges and breakout candidates", () => {
    const service = new ScreenerService();
    const breakouts = service.findBreakouts();
    expect(breakouts.length).toBeGreaterThanOrEqual(2);
    expect(breakouts.some((b) => b.symbol === "RELIANCE")).toBe(true);

    const surges = service.findVolumeSurges();
    expect(surges.length).toBeGreaterThanOrEqual(2);
    expect(surges.every((s) => s.volumeRatio >= 2.0)).toBe(true);
  });
});
