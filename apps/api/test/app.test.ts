import { describe, expect, it } from "vitest";
import { Candle, SignalRegime } from "@quant-ai/contracts";
import { MarketService } from "../src/modules/market/market.service";
import { PredictionsService } from "../src/modules/predictions/predictions.service";
import { MarketRegimeService } from "../src/modules/quant-analysis/market-regime.service";
import { MultiAgentDeliberationService } from "../src/modules/quant-analysis/multi-agent-deliberation.service";
import { TechnicalAnalysisService } from "../src/modules/quant-analysis/technical-analysis.service";
import { ScreenerService } from "../src/modules/screener/screener.service";

describe("NestJS Domain Services", () => {
  it("MarketService provides benchmark indices with sparklines", () => {
    const service = new MarketService();
    const indices = service.getBenchmarkIndices();
    expect(indices.length).toBeGreaterThanOrEqual(4);
    expect(indices[0]?.sparkline.length).toBeGreaterThan(0);
  });

  it("PredictionsService returns active prediction PRED-8942 and trajectory cone", () => {
    const service = new PredictionsService();
    const prediction = service.findById("PRED-8942");
    expect(prediction.ticker).toBe("RELIANCE");
    expect(prediction.entry).toBe(2985);

    const trajectory = service.getTrajectory("PRED-8942");
    expect(trajectory.length).toBeGreaterThan(0);
    expect(trajectory[0]!.expected).toBe(2985);
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

  it("TechnicalAnalysisService computes complete technical matrix over candle series", () => {
    const service = new TechnicalAnalysisService();
    const candles: Candle[] = Array.from({ length: 30 }, (_, i) => ({
      timestamp: 1700000000000 + i * 86400000,
      open: 100 + i,
      high: 105 + i,
      low: 98 + i,
      close: 102 + i,
      volume: 10000 + i * 500,
    }));

    const matrix = service.computeMatrix(candles);
    expect(matrix.latestClose).toBe(131);
    expect(matrix.rsi).toBeGreaterThan(0);
    expect(matrix.atr).toBeGreaterThan(0);
    expect(matrix.ema9).toBeGreaterThan(100);
    expect(matrix.bollingerBandwidth).toBeGreaterThanOrEqual(0);
  });

  it("MarketRegimeService deterministically classifies market conditions", () => {
    const service = new MarketRegimeService();
    const result = service.classify({
      currentPrice: 105,
      emaFast: 100,
      emaSlow: 95,
      adx: 32,
      rsi: 65,
      atrRatio: 1.0,
      isSqueezing: false,
    });
    expect(result.regime).toBe(SignalRegime.BULLISH_EXPANSION);
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("MultiAgentDeliberationService evaluates trade expectancy and consensus veto", () => {
    const service = new MultiAgentDeliberationService();
    const expectancy = service.evaluateExpectancy({
      entryPrice: 100,
      targetPrice: 130,
      stopLossPrice: 90,
      winProbability: 0.6,
    });
    expect(expectancy.isApproved).toBe(true);
    expect(expectancy.riskRewardRatio).toBe(3.0);
    expect(expectancy.mathematicalExpectancy).toBeGreaterThan(0);

    const debate = service.generateBreakoutDebate("RELIANCE", 64, 3.0);
    expect(debate).toHaveLength(3);
    const consensus = service.synthesizeConsensus(debate);
    expect(consensus.isVetoedBySkeptic).toBe(false);
  });
});
