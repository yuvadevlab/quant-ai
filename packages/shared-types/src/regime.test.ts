import { describe, expect, it } from "vitest";
import { SignalRegime } from "./enums";
import { classifyMarketRegime } from "./regime";

describe("Market Regime Classification Engine", () => {
  it("classifies high volatility regime when ATR ratio spikes", () => {
    const result = classifyMarketRegime({
      currentPrice: 3000,
      emaFast: 2980,
      emaSlow: 2950,
      adx: 30,
      rsi: 60,
      isSqueezing: false,
      atrRatio: 2.2, // > 1.8 threshold
    });
    expect(result.regime).toBe(SignalRegime.HIGH_VOLATILITY);
    expect(result.confidence).toBeGreaterThan(80);
  });

  it("classifies bullish expansion regime when trend and momentum align", () => {
    const result = classifyMarketRegime({
      currentPrice: 3050,
      emaFast: 3020,
      emaSlow: 2980,
      adx: 32, // Strong trend
      rsi: 64, // Bullish momentum
      isSqueezing: false,
      atrRatio: 1.1,
    });
    expect(result.regime).toBe(SignalRegime.BULLISH_EXPANSION);
    expect(result.confidence).toBeGreaterThanOrEqual(70);
  });

  it("classifies bearish contraction regime when breakdowns occur", () => {
    const result = classifyMarketRegime({
      currentPrice: 2890,
      emaFast: 2920,
      emaSlow: 2960,
      adx: 28,
      rsi: 38, // Oversold / breakdown momentum
      isSqueezing: false,
      atrRatio: 1.2,
    });
    expect(result.regime).toBe(SignalRegime.BEARISH_CONTRACTION);
  });

  it("detects consolidation when market is squeezing or ADX is weak", () => {
    const result = classifyMarketRegime({
      currentPrice: 3000,
      emaFast: 2998,
      emaSlow: 3002,
      adx: 14, // Weak trend / chop
      rsi: 50,
      isSqueezing: true,
      atrRatio: 0.9,
    });
    expect(result.regime).toBe(SignalRegime.SIDEWAYS_CONSOLIDATION);
  });
});
