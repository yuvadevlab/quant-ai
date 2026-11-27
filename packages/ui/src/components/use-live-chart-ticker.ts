/**
 * @file packages/ui/src/components/use-live-chart-ticker.ts
 * @description High-frequency streaming market ticker and micro-walk hook for Lightweight Charts.
 */

import { useEffect, type MutableRefObject, type Dispatch, type SetStateAction } from "react";
import type { ISeriesApi, CandlestickData, Time } from "lightweight-charts";
import type { ChartType } from "./ChartTopBar";
import type { OhlcData } from "./lightweight-chart-utils";

export interface UseLiveChartTickerOptions {
  readonly seriesRef: MutableRefObject<ISeriesApi<"Candlestick" | "Area" | "Line" | "Bar"> | null>;
  readonly activeCandleRef: MutableRefObject<CandlestickData<Time> | null>;
  readonly currentPriceRef: MutableRefObject<number>;
  readonly currentPrice?: number;
  readonly chartType: ChartType;
  readonly entryNum: number;
  readonly onOhlcUpdate: Dispatch<SetStateAction<OhlcData | null>>;
}

/**
 * Streams real-time tick updates and forms active candlestick bars live on canvas.
 */
export function useLiveChartTicker({
  seriesRef,
  activeCandleRef,
  currentPriceRef,
  currentPrice,
  chartType,
  entryNum,
  onOhlcUpdate,
}: UseLiveChartTickerOptions): void {
  useEffect(() => {
    if (currentPrice && !isNaN(currentPrice)) {
      currentPriceRef.current = currentPrice;
    }

    const interval = setInterval(() => {
      const series = seriesRef.current;
      const activeBar = activeCandleRef.current;
      if (!series || !activeBar) return;

      const tickDelta = (Math.random() - 0.49) * (entryNum * 0.0006);
      const nextClose = parseFloat((currentPriceRef.current + tickDelta).toFixed(2));
      const nextHigh = parseFloat(Math.max(activeBar.high, nextClose).toFixed(2));
      const nextLow = parseFloat(Math.min(activeBar.low, nextClose).toFixed(2));

      activeBar.close = nextClose;
      activeBar.high = nextHigh;
      activeBar.low = nextLow;

      try {
        if (chartType === "area" || chartType === "line") {
          series.update({ time: activeBar.time, value: nextClose });
        } else {
          series.update({
            time: activeBar.time,
            open: activeBar.open,
            high: nextHigh,
            low: nextLow,
            close: nextClose,
          });
        }
      } catch {
        // Suppress update if series was disposed during range or timeframe re-render
        return;
      }

      const change = parseFloat((nextClose - activeBar.open).toFixed(2));
      const changePct = parseFloat(((change / (activeBar.open || 1)) * 100).toFixed(2));
      onOhlcUpdate((prev) => ({
        time: activeBar.time,
        open: activeBar.open,
        high: nextHigh,
        low: nextLow,
        close: nextClose,
        volume: (prev?.volume ?? 45000) + Math.floor(Math.random() * 150),
        change,
        changePct,
      }));
    }, 1200);

    return () => clearInterval(interval);
  }, [
    currentPrice,
    chartType,
    entryNum,
    seriesRef,
    activeCandleRef,
    currentPriceRef,
    onOhlcUpdate,
  ]);
}
