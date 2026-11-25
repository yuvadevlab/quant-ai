/**
 * @file packages/ui/src/components/ChartOhlcLegend.tsx
 * @description Floating TradingView / Zerodha Kite OHLC and multi-indicator crosshair legend.
 * @author yuva.devlab@gmail.com
 */

import type { OhlcData } from "./lightweight-chart-utils";

export interface ChartOhlcLegendProps {
  readonly symbol: string;
  readonly timeframe: string;
  readonly exchange?: string;
  readonly ohlc: OhlcData | null;
  readonly ema20Val?: number | undefined;
  readonly ema50Val?: number | undefined;
  readonly target1?: number | string | undefined;
  readonly isMultiDay?: boolean | undefined;
  readonly visibleIndicators: {
    readonly ema: boolean;
    readonly volume: boolean;
    readonly trajectory: boolean;
  };
}

/**
 * Formats large volume numbers into K/M notation.
 */
function formatVolume(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toString();
}

function formatOhlcTime(time: unknown, isMultiDay?: boolean): string {
  if (typeof time === "number") {
    const d = new Date(time * 1000);
    if (isMultiDay) {
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return String(time || "");
}

export function ChartOhlcLegend({
  symbol,
  timeframe,
  exchange = "NSE",
  ohlc,
  ema20Val,
  ema50Val,
  target1,
  isMultiDay,
  visibleIndicators,
}: ChartOhlcLegendProps) {
  if (!ohlc) return null;

  const isUp = ohlc.close >= ohlc.open;
  const priceColorClass = isUp ? "tv-legend-bull" : "tv-legend-bear";

  return (
    <div className="tv-ohlc-legend">
      <div className="tv-legend-row tv-legend-main">
        <span className="tv-legend-tag">
          <strong>{symbol}</strong>
          <span className="tv-legend-dim">
            · {timeframe} · {exchange}{" "}
            {ohlc.time ? `· ${formatOhlcTime(ohlc.time, isMultiDay)}` : ""}
          </span>
        </span>

        <span className="tv-legend-metric">
          <span className="tv-legend-lbl">O</span>
          <span className={priceColorClass}>{ohlc.open.toFixed(2)}</span>
        </span>
        <span className="tv-legend-metric">
          <span className="tv-legend-lbl">H</span>
          <span className={priceColorClass}>{ohlc.high.toFixed(2)}</span>
        </span>
        <span className="tv-legend-metric">
          <span className="tv-legend-lbl">L</span>
          <span className={priceColorClass}>{ohlc.low.toFixed(2)}</span>
        </span>
        <span className="tv-legend-metric">
          <span className="tv-legend-lbl">C</span>
          <span className={priceColorClass}>{ohlc.close.toFixed(2)}</span>
        </span>

        <span className="tv-legend-metric">
          <span className="tv-legend-lbl">Chg</span>
          <span className={priceColorClass}>
            {ohlc.change >= 0 ? `+${ohlc.change.toFixed(2)}` : ohlc.change.toFixed(2)} (
            {ohlc.changePct >= 0
              ? `+${ohlc.changePct.toFixed(2)}%`
              : `${ohlc.changePct.toFixed(2)}%`}
            )
          </span>
        </span>

        {visibleIndicators.volume && (
          <span className="tv-legend-metric">
            <span className="tv-legend-lbl">Vol</span>
            <span className="tv-legend-val">{formatVolume(ohlc.volume)}</span>
          </span>
        )}
      </div>

      <div className="tv-legend-row tv-legend-sub">
        {visibleIndicators.ema && ema20Val !== undefined && (
          <span className="tv-indicator-tag tv-indicator-ema20">
            <span className="tv-ind-dot dot-ema20" /> EMA 20: <strong>{ema20Val.toFixed(2)}</strong>
          </span>
        )}
        {visibleIndicators.ema && ema50Val !== undefined && (
          <span className="tv-indicator-tag tv-indicator-ema50">
            <span className="tv-ind-dot dot-ema50" /> EMA 50: <strong>{ema50Val.toFixed(2)}</strong>
          </span>
        )}
        {visibleIndicators.trajectory && target1 !== undefined && (
          <span className="tv-indicator-tag tv-indicator-target">
            <span className="tv-ind-dot dot-target" /> Target 1:{" "}
            <strong>{String(target1).startsWith("₹") ? target1 : `₹${target1}`}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
