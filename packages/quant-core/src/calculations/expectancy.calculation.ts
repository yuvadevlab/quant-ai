/**
 * @file packages/finance-engine/src/calculations/expectancy.calculation.ts
 * @description Risk-to-reward ratio and mathematical trade expectancy formulas.
 * @author yuva.devlab@gmail.com
 */

import {
  DEFAULT_CURRENCY_DECIMAL_PLACES,
  PERCENTAGE_MULTIPLIER,
} from "../constants/technical.constants";

export interface TradeExpectancyParameters {
  readonly winProbabilityPercent: number;
  readonly entryPrice: number;
  readonly targetPrice: number;
  readonly stopLossPrice: number;
  readonly estimatedFrictionPercent?: number;
}

export interface TradeExpectancyResult {
  readonly riskRewardRatio: number;
  readonly mathematicalExpectancy: number;
  readonly potentialGain: number;
  readonly potentialLoss: number;
  readonly isStatisticallyViable: boolean;
}

/**
 * Calculates Risk-to-Reward ratio.
 *
 * Formula: Abs(Target - Entry) / Abs(Entry - StopLoss)
 */
export function calculateRiskRewardRatio(
  entryPrice: number,
  targetPrice: number,
  stopLossPrice: number,
): number {
  const potentialGain = Math.abs(targetPrice - entryPrice);
  const riskAmount = Math.max(0.01, Math.abs(entryPrice - stopLossPrice));

  return Number((potentialGain / riskAmount).toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES));
}

/**
 * Computes mathematical expectancy per dollar risked according to probability theory.
 *
 * Formula: E = (P_win * Gain) - (P_loss * Loss) - Friction
 */
export function calculateTradeExpectancy(params: TradeExpectancyParameters): TradeExpectancyResult {
  const potentialGain = Math.abs(params.targetPrice - params.entryPrice);
  const potentialLoss = Math.abs(params.entryPrice - params.stopLossPrice);
  const riskRewardRatio = calculateRiskRewardRatio(
    params.entryPrice,
    params.targetPrice,
    params.stopLossPrice,
  );

  const winProbability = params.winProbabilityPercent / PERCENTAGE_MULTIPLIER;
  const lossProbability = 1.0 - winProbability;
  const friction = params.estimatedFrictionPercent ?? 0.05;

  const rawExpectancy = winProbability * potentialGain - lossProbability * potentialLoss - friction;

  return {
    riskRewardRatio,
    mathematicalExpectancy: Number(rawExpectancy.toFixed(DEFAULT_CURRENCY_DECIMAL_PLACES)),
    potentialGain,
    potentialLoss,
    isStatisticallyViable: rawExpectancy > 0 && riskRewardRatio >= 2.0,
  };
}
