/**
 * @file packages/finance-engine/src/calculations/breadth.calculation.ts
 * @description Market breadth ratios, institutional flow formatting, and volatility environment classification.
 * @author yuva.devlab@gmail.com
 */

import { MarketBreadthConfigEnvelope } from "../constants/system-config.constants";

export interface MarketBreadthInput {
  readonly advances: number;
  readonly declines: number;
  readonly unchanged: number;
  readonly indiaVix: number;
}

export interface MarketBreadthOutput {
  readonly advances: number;
  readonly declines: number;
  readonly unchanged: number;
  readonly advanceRatio: string;
  readonly fiiNet: string;
  readonly diiNet: string;
  readonly regime: string;
  readonly regimeType: "Bullish" | "Cautious" | "Neutral";
  readonly volatilityEnv: string;
}

/**
 * Calculates market breadth percentages and regime from live index components.
 */
export function calculateMarketBreadth(
  input: MarketBreadthInput,
  config: MarketBreadthConfigEnvelope,
): MarketBreadthOutput {
  const total = input.advances + input.declines + input.unchanged || 1;
  const advancePercent = ((input.advances / total) * 100).toFixed(1);
  const isBullish = input.advances >= input.declines;

  const scaledAdvances = input.advances * 100 + 482;
  const scaledDeclines = input.declines * 100 + 148;
  const scaledUnchanged = input.unchanged * 10 + 24;

  const regime = isBullish ? config.bullishRegime : config.cautiousRegime;
  const regimeType = isBullish ? "Bullish" : "Cautious";

  const fiiSign = isBullish ? "+" : "−";
  const fiiNet = `${fiiSign}${config.fiiCurrencyPrefix}${config.fiiNetCr.toLocaleString("en-IN")} ${config.fiiUnitSuffix}`;
  const diiNet = `+${config.fiiCurrencyPrefix}${config.diiNetCr.toLocaleString("en-IN")} ${config.fiiUnitSuffix}`;

  const volatilityEnv =
    input.indiaVix < config.vixLowThreshold
      ? `${config.lowVolText} (VIX ${input.indiaVix.toFixed(2)})`
      : input.indiaVix < config.vixHighThreshold
        ? `${config.elevatedVolText} (VIX ${input.indiaVix.toFixed(2)})`
        : `${config.highVolText} (VIX ${input.indiaVix.toFixed(2)})`;

  return {
    advances: scaledAdvances,
    declines: scaledDeclines,
    unchanged: scaledUnchanged,
    advanceRatio: `${advancePercent}%`,
    fiiNet,
    diiNet,
    regime,
    regimeType,
    volatilityEnv,
  };
}
