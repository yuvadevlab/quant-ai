/**
 * @file packages/ui/src/components/lightweight-chart-utils.ts
 * @description Data transformers, EMA calculators and series converters for Kite/TradingView chart.
 * @author yuva.devlab@gmail.com
 */

import type {
  CandlestickData,
  HistogramData,
  LineData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import type { TrajectoryPoint } from "./trajectory-math";
import type { ChartRange } from "./ChartRangeBar";
import { synthesizeHistoryData } from "./chart-history-synthesizer";

export interface OhlcData {
  readonly time: Time;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly change: number;
  readonly changePct: number;
}

export interface PreparedChartData {
  readonly candles: readonly CandlestickData<Time>[];
  readonly volume: readonly HistogramData<Time>[];
  readonly ema20: readonly LineData<Time>[];
  readonly ema50: readonly LineData<Time>[];
  readonly trajectory: readonly LineData<Time>[];
  readonly upperCone: readonly LineData<Time>[];
  readonly lowerCone: readonly LineData<Time>[];
  readonly latestOhlc: OhlcData;
  readonly isMultiDay: boolean;
}

export function parseChartPrice(val: number | string | undefined, fallback: number): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (!val) return fallback;
  const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
  return isNaN(parsed) ? fallback : parsed;
}

export function calculateEma(
  candles: readonly CandlestickData<Time>[],
  period: number,
): LineData<Time>[] {
  const result: LineData<Time>[] = [];
  if (candles.length < period) return result;
  const multiplier = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += candles[i].close;
  let currentEma = sum / period;
  result.push({ time: candles[period - 1].time, value: currentEma });
  for (let i = period; i < candles.length; i++) {
    currentEma = candles[i].close * multiplier + currentEma * (1 - multiplier);
    result.push({ time: candles[i].time, value: parseFloat(currentEma.toFixed(2)) });
  }
  return result;
}

export function resolveTimeframeSeconds(timeframe: string): number {
  switch (timeframe) {
    case "1m":
      return 60;
    case "5m":
      return 300;
    case "15m":
      return 900;
    case "1h":
      return 3600;
    case "1D":
      return 86400;
    default:
      return 900;
  }
}

/**
 * Transforms historical sample points and trajectory projections into lightweight-charts series data.
 */
export function prepareLightweightSeries(
  _samples: readonly TrajectoryPoint[] = [],
  trajectory: readonly TrajectoryPoint[] = [],
  entryPrice: number,
  targetPrice: number,
  _timeframe = "15m",
  currentPrice?: number,
  range: ChartRange = "1D",
): PreparedChartData {
  const targetLtp = currentPrice && !isNaN(currentPrice) ? currentPrice : entryPrice;

  const synth = synthesizeHistoryData({
    range,
    entryPrice,
    targetLtp,
    targetPrice,
    trajectory,
  });

  const ema20 = calculateEma(synth.candles, 12);
  const ema50 = calculateEma(synth.candles, 20);

  const prevBar = synth.candles[synth.candles.length - 2] ?? synth.candles[0];
  const latestBar = synth.candles[synth.candles.length - 1] ?? {
    time: synth.roundedNowSec as UTCTimestamp,
    open: targetLtp,
    high: targetLtp,
    low: targetLtp,
    close: targetLtp,
  };

  const prevClose = prevBar?.close ?? latestBar.open;
  const change = parseFloat((latestBar.close - prevClose).toFixed(2));
  const changePct = parseFloat(((change / (prevClose || 1)) * 100).toFixed(2));
  const lastVol = synth.volume[synth.volume.length - 1]?.value ?? 0;

  const latestOhlc: OhlcData = {
    time: latestBar.time,
    open: latestBar.open,
    high: latestBar.high,
    low: latestBar.low,
    close: latestBar.close,
    volume: lastVol,
    change,
    changePct,
  };

  return {
    candles: synth.candles,
    volume: synth.volume,
    ema20,
    ema50,
    trajectory: synth.trajectorySeries,
    upperCone: synth.upperConeSeries,
    lowerCone: synth.lowerConeSeries,
    latestOhlc,
    isMultiDay: synth.isMultiDay,
  };
}
