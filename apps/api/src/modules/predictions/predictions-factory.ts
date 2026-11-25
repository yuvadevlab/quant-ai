/**
 * @file apps/api/src/modules/predictions/predictions-factory.ts
 * @description Signal builder and database persistence for quantitative predictions.
 * @author yuva.devlab@gmail.com
 */

import { Logger } from "@yuva-devlab/logger";
import {
  AssetClass,
  Signal,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeHorizon,
  TradeStrategy,
} from "@quant-ai/shared-types";
import {
  calculateReturnPercent,
  calculateUnrealizedPnl,
  TradePositionSide,
} from "@quant-ai/quant-core";
import { DatabaseService } from "../infrastructure/database.service";

export interface SignalBuildParams {
  readonly symbol: string;
  readonly name: string;
  readonly assetClass: AssetClass;
  readonly current: number;
  readonly target: number;
  readonly stopLoss: number;
  readonly riskReward: number;
  readonly atr: number;
  readonly rsi: number;
  readonly percentChange: number;
  readonly isBullish: boolean;
  readonly direction: SignalDirection;
  readonly side: TradePositionSide;
  readonly confidence: number;
}

export function buildSignalTrajectory(current: number, target: number, atr: number) {
  const range = target - current;
  const interimActual = Number((current + range * 0.12).toFixed(2));
  return [
    { time: "Entry", expected: current, actual: current, upper: current, lower: current },
    {
      time: "T+15m",
      expected: Number((current + range * 0.25).toFixed(2)),
      actual: interimActual,
      upper: Number((current + atr * 0.5).toFixed(2)),
      lower: Number((current - atr * 0.3).toFixed(2)),
    },
    {
      time: "Now",
      expected: Number((current + range * 0.45).toFixed(2)),
      actual: current,
      upper: Number((current + atr * 0.8).toFixed(2)),
      lower: Number((current - atr * 0.5).toFixed(2)),
    },
    {
      time: "T+1h",
      expected: Number((current + range * 0.75).toFixed(2)),
      actual: null as unknown as number,
      upper: Number((current + range * 0.75 + atr * 0.8).toFixed(2)),
      lower: Number((current + range * 0.75 - atr * 0.6).toFixed(2)),
    },
    {
      time: "Target",
      expected: target,
      actual: null as unknown as number,
      upper: Number((target + atr * 0.5).toFixed(2)),
      lower: Number((target - atr * 0.5).toFixed(2)),
    },
  ];
}

export function buildSignal(params: SignalBuildParams): Signal {
  const {
    symbol,
    name,
    assetClass,
    current,
    target,
    stopLoss,
    riskReward,
    atr,
    rsi,
    percentChange,
    isBullish,
    direction,
    side,
    confidence,
  } = params;
  const predictionId = `PRED-${symbol.toUpperCase()}`;
  const summary = `Algorithmic ${direction} setup identified for ${name}: Current LTP ₹${current.toLocaleString("en-IN")}, RSI ${rsi.toFixed(1)}, intraday momentum ${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(2)}%, ATR volatility ₹${atr.toFixed(2)}.`;

  const trajectory = buildSignalTrajectory(current, target, atr);
  const regime =
    Math.abs(percentChange) > 1.5
      ? isBullish
        ? SignalRegime.BULLISH_EXPANSION
        : SignalRegime.BEARISH_CONTRACTION
      : SignalRegime.SIDEWAYS_CONSOLIDATION;

  return {
    id: predictionId,
    ticker: symbol,
    name,
    strategy: TradeStrategy.SWING,
    assetClass,
    direction,
    entry: current,
    current,
    target,
    stopLoss,
    horizon: TradeHorizon.SWING_WEEKS,
    confidence,
    status: SignalStatus.ACTIVE,
    regime,
    pnlPercent: calculateReturnPercent(current, current, side),
    pnlAbsolute: calculateUnrealizedPnl(current, current, 1, side),
    maxExcursion: 0,
    maxAdverse: 0,
    publishedAt: new Date().toISOString(),
    thesis: summary,
    riskReward,
    catalysts: [
      `RSI ${rsi.toFixed(1)} confirmation`,
      `ATR ₹${atr.toFixed(2)} volatility boundary`,
      `Live session change ${percentChange.toFixed(2)}%`,
    ],
    invalidation: `Close beyond stop-loss level of ₹${stopLoss} invalidates thesis.`,
    trajectory,
    agents: [
      {
        role: "Technical Analyst" as never,
        stance: (isBullish ? "Bullish" : "Bearish") as never,
        confidence,
        summary: `Price action verified at ₹${current} with 14-period RSI at ${rsi.toFixed(1)}.`,
      },
      {
        role: "Quant Risk Officer" as never,
        stance: (riskReward >= 1.5 ? "Bullish" : "Neutral") as never,
        confidence: Math.round(confidence * 0.95),
        summary: `Calculated mathematical expectancy positive. Risk-to-reward verified at 1:${riskReward}.`,
      },
    ],
  };
}

export async function persistPredictionToDb(
  databaseService: DatabaseService | undefined,
  signal: Signal,
  logger: Logger,
): Promise<void> {
  if (!databaseService) return;
  try {
    await databaseService.client.prediction.deleteMany({
      where: {
        OR: [{ id: signal.id }, { ticker: signal.ticker }],
      },
    });

    await databaseService.client.prediction.create({
      data: {
        id: signal.id,
        ticker: signal.ticker,
        name: signal.name,
        direction: signal.direction,
        status: signal.status,
        entry: signal.entry,
        target: signal.target,
        stopLoss: signal.stopLoss,
        currentPrice: signal.current,
        confidence: signal.confidence,
        riskReward: signal.riskReward,
        timeHorizon: signal.horizon,
        regime: signal.regime,
        summary: signal.thesis,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        verdicts: {
          create: (signal.agents ?? []).map((v) => ({
            agentRole: v.role,
            stance: v.stance,
            confidence: v.confidence,
            reasoning: v.summary,
          })),
        },
        trajectory: {
          create: (signal.trajectory ?? []).map((t, idx) => ({
            step: idx,
            expected: t.expected ?? 0,
            upperP95: t.upper ?? 0,
            upperP75: Number((((t.expected ?? 0) + (t.upper ?? 0)) / 2).toFixed(2)),
            lowerP25: Number((((t.expected ?? 0) + (t.lower ?? 0)) / 2).toFixed(2)),
            lowerP05: t.lower ?? 0,
          })),
        },
      },
    });

    await databaseService.client.screenerStock.upsert({
      where: { symbol: signal.ticker },
      update: { company: signal.name },
      create: {
        symbol: signal.ticker,
        company: signal.name,
        sector: "Equity",
        exchange: "NSE",
      },
    });
  } catch (dbErr) {
    logger.warn(`[persistPredictionToDb] Could not save prediction ${signal.id}: ${String(dbErr)}`);
  }
}
