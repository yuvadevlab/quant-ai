/**
 * @file packages/ui/src/components/chart-history-synthesizer.ts
 * @description Multi-period historical candlestick and trajectory projection synthesizer (1D, 5D, 1M, 6M, 1Y, ALL).
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

export interface RangeConfig {
  readonly intervalSec: number;
  readonly sampleCount: number;
  readonly isMultiDay: boolean;
  readonly defaultTimeframe: string;
  readonly forwardBars: number;
}

export function resolveRangeConfig(range: ChartRange): RangeConfig {
  switch (range) {
    case "1D":
      return {
        intervalSec: 300,
        sampleCount: 65,
        isMultiDay: false,
        defaultTimeframe: "5m",
        forwardBars: 12,
      };
    case "5D":
      return {
        intervalSec: 900,
        sampleCount: 110,
        isMultiDay: true,
        defaultTimeframe: "15m",
        forwardBars: 16,
      };
    case "1M":
      return {
        intervalSec: 86400,
        sampleCount: 30,
        isMultiDay: true,
        defaultTimeframe: "1D",
        forwardBars: 10,
      };
    case "6M":
      return {
        intervalSec: 86400,
        sampleCount: 130,
        isMultiDay: true,
        defaultTimeframe: "1D",
        forwardBars: 15,
      };
    case "1Y":
      return {
        intervalSec: 86400,
        sampleCount: 250,
        isMultiDay: true,
        defaultTimeframe: "1D",
        forwardBars: 20,
      };
    case "ALL":
      return {
        intervalSec: 604800,
        sampleCount: 156,
        isMultiDay: true,
        defaultTimeframe: "1W",
        forwardBars: 16,
      };
    default:
      return {
        intervalSec: 900,
        sampleCount: 24,
        isMultiDay: false,
        defaultTimeframe: "15m",
        forwardBars: 12,
      };
  }
}

export interface SynthesizeHistoryParams {
  readonly range: ChartRange;
  readonly entryPrice: number;
  readonly targetLtp: number;
  readonly targetPrice: number;
  readonly trajectory?: readonly TrajectoryPoint[];
}

export interface SynthesizedHistoryResult {
  readonly candles: CandlestickData<Time>[];
  readonly volume: HistogramData<Time>[];
  readonly trajectorySeries: LineData<Time>[];
  readonly upperConeSeries: LineData<Time>[];
  readonly lowerConeSeries: LineData<Time>[];
  readonly roundedNowSec: number;
  readonly intervalSec: number;
  readonly isMultiDay: boolean;
}

export function synthesizeHistoryData(params: SynthesizeHistoryParams): SynthesizedHistoryResult {
  const { range, entryPrice, targetLtp, targetPrice, trajectory = [] } = params;
  const cfg = resolveRangeConfig(range);
  const nowSec = Math.floor(Date.now() / 1000);
  const roundedNowSec = Math.floor(nowSec / cfg.intervalSec) * cfg.intervalSec;
  const startSec = roundedNowSec - (cfg.sampleCount - 1) * cfg.intervalSec;

  const candles: CandlestickData<Time>[] = [];
  const volume: HistogramData<Time>[] = [];
  const trajectorySeries: LineData<Time>[] = [];
  const upperConeSeries: LineData<Time>[] = [];
  const lowerConeSeries: LineData<Time>[] = [];

  const startBase = cfg.isMultiDay && range !== "5D" ? entryPrice * 0.91 : entryPrice * 0.992;
  let runningClose = startBase;

  for (let i = 0; i < cfg.sampleCount; i++) {
    const time = (startSec + i * cfg.intervalSec) as UTCTimestamp;
    const progress = i / Math.max(1, cfg.sampleCount - 1);
    const trendBase = startBase + (targetLtp - startBase) * progress;
    const waveCycles = cfg.isMultiDay ? 4 : 2;
    const wave = Math.sin(progress * waveCycles * Math.PI) * (entryPrice * 0.008);
    const noise = (Math.random() - 0.49) * (entryPrice * 0.004);

    const isFinal = i === cfg.sampleCount - 1;
    const close = isFinal
      ? parseFloat(targetLtp.toFixed(2))
      : parseFloat((trendBase + wave + noise).toFixed(2));
    const open = i === 0 ? parseFloat(startBase.toFixed(2)) : runningClose;
    const barRange = Math.abs(close - open);
    const wickHigh = (Math.random() * 0.4 + 0.15) * barRange + close * 0.001;
    const wickLow = (Math.random() * 0.4 + 0.15) * barRange + close * 0.001;
    const high = parseFloat((Math.max(open, close) + wickHigh).toFixed(2));
    const low = parseFloat((Math.min(open, close) - wickLow).toFixed(2));

    candles.push({ time, open, high, low, close });

    const isUp = close >= open;
    const baseVol = 40000 + Math.sin(progress * Math.PI) * 25000;
    const volVal = Math.round(baseVol + Math.random() * 45000 + (isFinal ? 50000 : 0));
    volume.push({
      time,
      value: volVal,
      color: isUp ? "rgba(16, 185, 129, 0.6)" : "rgba(244, 63, 94, 0.6)",
    });

    runningClose = close;
  }

  // Forward expected trajectory and probability cone
  const forwardCount = Math.max(trajectory.length, cfg.forwardBars);
  for (let idx = 0; idx < forwardCount; idx++) {
    const time = (roundedNowSec + (idx + 1) * cfg.intervalSec) as UTCTimestamp;
    const fProgress = (idx + 1) / forwardCount;
    const pt = trajectory[idx];
    const expected = parseFloat(
      (pt?.expected ?? targetLtp + (targetPrice - targetLtp) * fProgress).toFixed(2),
    );
    const spread =
      Math.abs(targetPrice - targetLtp) * 0.22 * Math.sqrt(fProgress) + targetLtp * 0.004;
    const upper = parseFloat((pt?.upper ?? expected + spread).toFixed(2));
    const lower = parseFloat((pt?.lower ?? Math.max(1, expected - spread)).toFixed(2));

    trajectorySeries.push({ time, value: expected });
    upperConeSeries.push({ time, value: upper });
    lowerConeSeries.push({ time, value: lower });
  }

  return {
    candles,
    volume,
    trajectorySeries,
    upperConeSeries,
    lowerConeSeries,
    roundedNowSec,
    intervalSec: cfg.intervalSec,
    isMultiDay: cfg.isMultiDay,
  };
}

export function formatChartTick(ts: number, range: ChartRange): string {
  const d = new Date(ts * 1000);
  if (range === "1Y" || range === "ALL") {
    return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  }
  if (range === "5D" || range === "1M" || range === "6M") {
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  }
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatChartTime(ts: number, range: ChartRange): string {
  const d = new Date(ts * 1000);
  if (range === "1D") {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
