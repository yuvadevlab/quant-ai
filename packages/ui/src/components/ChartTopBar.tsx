/**
 * @file packages/ui/src/components/ChartTopBar.tsx
 * @description TradingView / Zerodha Kite institutional top toolbar for timeframe, indicators and style.
 * @author yuva.devlab@gmail.com
 */

import {
  CandlestickChart,
  LineChart,
  AreaChart,
  BarChart2,
  Sliders,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@yuva-devlab/ui";

export type ChartType = "candles" | "area" | "line" | "bars";

export interface ChartTopBarProps {
  readonly symbol: string;
  readonly exchange?: string;
  readonly timeframe: string;
  readonly onTimeframeSelect: (tf: string) => void;
  readonly chartType: ChartType;
  readonly onChartTypeChange: (type: ChartType) => void;
  readonly indicators: {
    readonly ema: boolean;
    readonly volume: boolean;
    readonly trajectory: boolean;
  };
  readonly onToggleIndicator: (key: "ema" | "volume" | "trajectory") => void;
  readonly onResetView: () => void;
}

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "1D"] as const;

export function ChartTopBar({
  symbol,
  exchange = "NSE",
  timeframe,
  onTimeframeSelect,
  chartType,
  onChartTypeChange,
  indicators,
  onToggleIndicator,
  onResetView,
}: ChartTopBarProps) {
  return (
    <div className="tv-topbar">
      {/* 1. Symbol & Exchange */}
      <div className="tv-topbar-symbol">
        <span className="tv-symbol-name">{symbol}</span>
        <span className="tv-exchange-tag">{exchange}</span>
        <span className="tv-market-live-pill">
          <span className="tv-live-beacon" /> LIVE
        </span>
      </div>

      <div className="tv-topbar-divider" />

      {/* 2. Timeframe Selector (Kite / TradingView style) */}
      <div className="tv-timeframe-group">
        {TIMEFRAMES.map((tf) => (
          <Button
            key={tf}
            type="button"
            variant="ghost"
            size="sm"
            className={`tv-btn tv-tf-btn ${timeframe === tf ? "active" : ""}`}
            onClick={() => onTimeframeSelect(tf)}
          >
            {tf}
          </Button>
        ))}
      </div>

      <div className="tv-topbar-divider" />

      {/* 3. Chart Type Switcher */}
      <div className="tv-chart-type-group">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-btn tv-type-btn ${chartType === "candles" ? "active" : ""}`}
          title="Candlesticks"
          onClick={() => onChartTypeChange("candles")}
        >
          <CandlestickChart size={14} />
          <span className="tv-btn-label">Candles</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-btn tv-type-btn ${chartType === "area" ? "active" : ""}`}
          title="Area Chart"
          onClick={() => onChartTypeChange("area")}
        >
          <AreaChart size={14} />
          <span className="tv-btn-label">Area</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-btn tv-type-btn ${chartType === "line" ? "active" : ""}`}
          title="Line Chart"
          onClick={() => onChartTypeChange("line")}
        >
          <LineChart size={14} />
          <span className="tv-btn-label">Line</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-btn tv-type-btn ${chartType === "bars" ? "active" : ""}`}
          title="Bar Ticks"
          onClick={() => onChartTypeChange("bars")}
        >
          <BarChart2 size={14} />
          <span className="tv-btn-label">Bars</span>
        </Button>
      </div>

      <div className="tv-topbar-divider" />

      {/* 4. Indicators Toggle */}
      <div className="tv-indicators-group">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-btn tv-ind-btn ${indicators.ema ? "active" : ""}`}
          onClick={() => onToggleIndicator("ema")}
        >
          <Sliders size={13} />
          <span>EMA (20/50)</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-btn tv-ind-btn ${indicators.volume ? "active" : ""}`}
          onClick={() => onToggleIndicator("volume")}
        >
          <BarChart2 size={13} />
          <span>Volume</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-btn tv-ind-btn tv-trajectory-btn ${indicators.trajectory ? "active" : ""}`}
          onClick={() => onToggleIndicator("trajectory")}
        >
          <Sparkles size={13} />
          <span>AI Trajectory</span>
        </Button>
      </div>

      {/* 5. Utility Controls */}
      <div className="tv-topbar-actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="tv-btn tv-action-btn"
          title="Reset Zoom & Auto-Fit"
          onClick={onResetView}
        >
          <RotateCcw size={13} />
          <span className="tv-action-label">Fit</span>
        </Button>
      </div>
    </div>
  );
}
