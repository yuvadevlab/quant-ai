/**
 * @file packages/ui/src/components/chart-series-builder.ts
 * @description Series mounting, indicators attachment and price milestone overlays for TradingView chart.
 * @author yuva.devlab@gmail.com
 */

import {
  LineStyle,
  LineType,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
  BarSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from "lightweight-charts";
import type { ChartType } from "./ChartTopBar";
import type { PreparedChartData, OhlcData } from "./lightweight-chart-utils";

export interface AttachSeriesResult {
  readonly mainSeries: ISeriesApi<"Candlestick" | "Area" | "Line" | "Bar">;
  readonly lastCandle?: CandlestickData<Time>;
}

export interface AttachSeriesOptions {
  readonly chart: IChartApi;
  readonly data: PreparedChartData;
  readonly chartType: ChartType;
  readonly indicators: {
    readonly ema: boolean;
    readonly volume: boolean;
    readonly trajectory: boolean;
  };
  readonly entryNum: number;
  readonly t1Num: number;
  readonly t2Num: number;
  readonly stopNum: number;
  readonly onCrosshairBar: (bar: OhlcData) => void;
  readonly onCrosshairReset: () => void;
}

export function attachChartSeries(opts: AttachSeriesOptions): AttachSeriesResult {
  const {
    chart,
    data,
    chartType,
    indicators,
    entryNum,
    t1Num,
    t2Num,
    stopNum,
    onCrosshairBar,
    onCrosshairReset,
  } = opts;

  // 1. Primary Series
  let mainSeries: ISeriesApi<"Candlestick" | "Area" | "Line" | "Bar">;
  if (chartType === "area") {
    mainSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962ff",
      topColor: "rgba(41, 98, 255, 0.25)",
      bottomColor: "rgba(41, 98, 255, 0.0)",
      lineWidth: 2,
    });
    mainSeries.setData(data.candles.map((c) => ({ time: c.time, value: c.close })));
  } else if (chartType === "line") {
    mainSeries = chart.addSeries(LineSeries, { color: "#2962ff", lineWidth: 2 });
    mainSeries.setData(data.candles.map((c) => ({ time: c.time, value: c.close })));
  } else if (chartType === "bars") {
    mainSeries = chart.addSeries(BarSeries, { upColor: "#10b981", downColor: "#f43f5e" });
    mainSeries.setData([...data.candles]);
  } else {
    mainSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderUpColor: "#10b981",
      borderDownColor: "#f43f5e",
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    });
    mainSeries.setData([...data.candles]);
  }

  // 2. Volume Series
  if (indicators.volume) {
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
    volumeSeries.setData([...data.volume]);
  }

  // 3. EMA Series
  if (indicators.ema) {
    const ema20 = chart.addSeries(LineSeries, {
      color: "#fbbf24",
      lineWidth: 1,
      priceLineVisible: false,
    });
    ema20.setData([...data.ema20]);
    const ema50 = chart.addSeries(LineSeries, {
      color: "#60a5fa",
      lineWidth: 1,
      priceLineVisible: false,
    });
    ema50.setData([...data.ema50]);
  }

  // 4. Trajectory Cone
  if (indicators.trajectory) {
    const traj = chart.addSeries(LineSeries, {
      color: "#38bdf8",
      lineWidth: 2,
      lineType: LineType.Curved,
      priceLineVisible: false,
    });
    traj.setData([...data.trajectory]);

    const upper = chart.addSeries(LineSeries, {
      color: "rgba(56, 189, 248, 0.45)",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      lineType: LineType.Curved,
      priceLineVisible: false,
    });
    upper.setData([...data.upperCone]);

    const lower = chart.addSeries(LineSeries, {
      color: "rgba(56, 189, 248, 0.45)",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      lineType: LineType.Curved,
      priceLineVisible: false,
    });
    lower.setData([...data.lowerCone]);
  }

  // 5. Price Milestones
  mainSeries.createPriceLine({
    price: entryNum,
    color: "#38bdf8",
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    axisLabelVisible: true,
    title: "ENTRY",
  });
  mainSeries.createPriceLine({
    price: t1Num,
    color: "#10b981",
    lineWidth: 2,
    lineStyle: LineStyle.Solid,
    axisLabelVisible: true,
    title: "T1",
  });
  mainSeries.createPriceLine({
    price: t2Num,
    color: "#818cf8",
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    axisLabelVisible: true,
    title: "T2",
  });
  mainSeries.createPriceLine({
    price: stopNum,
    color: "#f43f5e",
    lineWidth: 2,
    lineStyle: LineStyle.Solid,
    axisLabelVisible: true,
    title: "STOP",
  });

  // 6. Crosshair Listener
  chart.subscribeCrosshairMove((param) => {
    if (!param.time || !param.seriesData) {
      onCrosshairReset();
      return;
    }
    const bar = param.seriesData.get(mainSeries) as
      { open?: number; high?: number; low?: number; close?: number; value?: number } | undefined;
    if (bar) {
      const open = bar.open ?? bar.value ?? 0;
      const close = bar.close ?? bar.value ?? 0;
      const high = bar.high ?? Math.max(open, close);
      const low = bar.low ?? Math.min(open, close);
      const change = parseFloat((close - open).toFixed(2));
      const changePct = parseFloat(((change / (open || 1)) * 100).toFixed(2));
      onCrosshairBar({
        time: param.time,
        open,
        high,
        low,
        close,
        volume: data.latestOhlc.volume,
        change,
        changePct,
      });
    }
  });

  return {
    mainSeries,
    lastCandle: data.candles[data.candles.length - 1],
  };
}
