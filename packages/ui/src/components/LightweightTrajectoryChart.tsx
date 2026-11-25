/**
 * @file packages/ui/src/components/LightweightTrajectoryChart.tsx
 * @description TradingView / Zerodha Kite institutional workstation chart with interactive toolbars and multi-period range selector.
 * @author yuva.devlab@gmail.com
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from "lightweight-charts";
import { cn } from "@yuva-devlab/ui";
import type { TrajectoryPoint } from "./trajectory-math";
import {
  parseChartPrice,
  prepareLightweightSeries,
  type OhlcData,
} from "./lightweight-chart-utils";
import { ChartTopBar, type ChartType } from "./ChartTopBar";
import { ChartToolsSidebar } from "./ChartToolsSidebar";
import { ChartOhlcLegend } from "./ChartOhlcLegend";
import { ChartRangeBar, type ChartRange } from "./ChartRangeBar";
import { formatChartTick, formatChartTime, resolveRangeConfig } from "./chart-history-synthesizer";
import { attachChartSeries } from "./chart-series-builder";
import { useLiveChartTicker } from "./use-live-chart-ticker";

export interface LightweightTrajectoryChartProps {
  readonly symbol: string;
  readonly entryPrice: number | string;
  readonly target1: number | string;
  readonly target2: number | string;
  readonly stop: number | string;
  readonly currentPrice?: number;
  readonly samples?: readonly TrajectoryPoint[];
  readonly trajectory?: readonly TrajectoryPoint[];
  readonly timeframe?: string;
  readonly isActive?: boolean;
  readonly className?: string;
  readonly height?: number;
}

export function LightweightTrajectoryChart({
  symbol,
  entryPrice,
  target1,
  target2,
  stop,
  currentPrice,
  samples = [],
  trajectory = [],
  timeframe: initialTf = "15m",
  className = "",
  height = 420,
}: LightweightTrajectoryChartProps) {
  const entryNum = parseChartPrice(entryPrice, 100);
  const t1Num = parseChartPrice(target1, entryNum * 1.03);
  const t2Num = parseChartPrice(target2, entryNum * 1.05);
  const stopNum = parseChartPrice(stop, entryNum * 0.98);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick" | "Area" | "Line" | "Bar"> | null>(null);
  const activeCandleRef = useRef<CandlestickData<Time> | null>(null);
  const currentPriceRef = useRef<number>(currentPrice ?? entryNum);

  const [activeTf, setActiveTf] = useState<string>(initialTf);
  const [activeRange, setActiveRange] = useState<ChartRange>("1D");
  const [chartType, setChartType] = useState<ChartType>("candles");
  const [indicators, setIndicators] = useState({ ema: true, volume: true, trajectory: true });
  const [hoveredOhlc, setHoveredOhlc] = useState<OhlcData | null>(null);
  const [hoveredEma20, setHoveredEma20] = useState<number | undefined>();
  const [hoveredEma50, setHoveredEma50] = useState<number | undefined>();

  const handleToggleIndicator = useCallback((key: "ema" | "volume" | "trajectory") => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleResetView = useCallback(() => {
    chartRef.current?.timeScale().fitContent();
  }, []);

  const handleRangeSelect = useCallback((range: ChartRange) => {
    setActiveRange(range);
    setActiveTf(resolveRangeConfig(range).defaultTimeframe);
  }, []);

  const handleTimeframeSelect = useCallback((tf: string) => {
    setActiveTf(tf);
    const rangeMap: Record<string, ChartRange> = {
      "1m": "1D",
      "5m": "1D",
      "15m": "5D",
      "1h": "1M",
      "1D": "1Y",
    };
    if (rangeMap[tf]) setActiveRange(rangeMap[tf]);
  }, []);

  const handleZoom = useCallback((direction: "in" | "out") => {
    const ts = chartRef.current?.timeScale();
    if (!ts) return;
    const range = ts.getVisibleLogicalRange();
    if (range) {
      const delta = (range.to - range.from) * (direction === "in" ? 0.2 : -0.2);
      ts.setVisibleLogicalRange({ from: range.from + delta, to: range.to - delta });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#0b0f19" },
        textColor: "#cbd5e1",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(30, 41, 59, 0.45)" },
        horzLines: { color: "rgba(30, 41, 59, 0.45)" },
      },
      crosshair: {
        vertLine: { color: "rgba(148, 163, 184, 0.6)", width: 1, style: LineStyle.Dotted },
        horzLine: { color: "rgba(148, 163, 184, 0.6)", width: 1, style: LineStyle.Dotted },
      },
      timeScale: {
        borderColor: "#1e293b",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (ts: number) => formatChartTick(ts, activeRange),
      },
      localization: {
        locale: "en-IN",
        dateFormat: "dd MMM yyyy",
        timeFormatter: (ts: number) => formatChartTime(ts, activeRange),
      },
      rightPriceScale: { borderColor: "#1e293b", scaleMargins: { top: 0.1, bottom: 0.22 } },
    });
    chartRef.current = chart;

    const data = prepareLightweightSeries(
      samples,
      trajectory,
      entryNum,
      t1Num,
      activeTf,
      currentPriceRef.current,
      activeRange,
    );
    setHoveredOhlc(data.latestOhlc);

    const lastE20 = data.ema20[data.ema20.length - 1];
    const lastE50 = data.ema50[data.ema50.length - 1];
    if (lastE20) setHoveredEma20(lastE20.value);
    if (lastE50) setHoveredEma50(lastE50.value);

    const { mainSeries, lastCandle } = attachChartSeries({
      chart,
      data,
      chartType,
      indicators,
      entryNum,
      t1Num,
      t2Num,
      stopNum,
      onCrosshairBar: setHoveredOhlc,
      onCrosshairReset: () => setHoveredOhlc(data.latestOhlc),
    });
    mainSeriesRef.current = mainSeries;
    activeCandleRef.current = lastCandle ? { ...lastCandle } : null;
    currentPriceRef.current = currentPrice ?? (lastCandle ? lastCandle.close : entryNum);

    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      if (container && chart) chart.applyOptions({ width: container.clientWidth });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = mainSeriesRef.current = activeCandleRef.current = null;
    };
  }, [
    samples,
    trajectory,
    entryNum,
    t1Num,
    t2Num,
    stopNum,
    activeTf,
    activeRange,
    chartType,
    indicators,
    height,
  ]);

  // Real-time market tick streamer & micro-walk engine
  useLiveChartTicker({
    seriesRef: mainSeriesRef,
    activeCandleRef,
    currentPriceRef,
    currentPrice,
    chartType,
    entryNum,
    onOhlcUpdate: setHoveredOhlc,
  });

  return (
    <div className={cn("tv-workstation-wrapper", className)}>
      <ChartTopBar
        symbol={symbol}
        timeframe={activeTf}
        onTimeframeSelect={handleTimeframeSelect}
        chartType={chartType}
        onChartTypeChange={setChartType}
        indicators={indicators}
        onToggleIndicator={handleToggleIndicator}
        onResetView={handleResetView}
      />
      <div className="tv-chart-body">
        <ChartToolsSidebar
          onZoomIn={() => handleZoom("in")}
          onZoomOut={() => handleZoom("out")}
          onClearDrawings={handleResetView}
        />
        <div className="tv-viewport-container">
          <ChartOhlcLegend
            symbol={symbol}
            timeframe={activeTf}
            ohlc={hoveredOhlc}
            ema20Val={hoveredEma20}
            ema50Val={hoveredEma50}
            target1={target1}
            isMultiDay={activeRange !== "1D"}
            visibleIndicators={indicators}
          />
          <div
            ref={containerRef}
            className="tv-canvas-viewport"
            style={{ height: `${height}px` }}
          />
          <ChartRangeBar activeRange={activeRange} onSelectRange={handleRangeSelect} />
        </div>
      </div>
    </div>
  );
}
