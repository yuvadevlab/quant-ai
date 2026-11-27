/**
 * @file packages/ui/src/components/ChartRangeBar.tsx
 * @description TradingView / Zerodha Kite institutional bottom date range selector (1D, 5D, 1M, 6M, 1Y, ALL).
 */

import { Button } from "@yuva-devlab/ui";

export type ChartRange = "1D" | "5D" | "1M" | "6M" | "1Y" | "ALL";

export interface ChartRangeBarProps {
  readonly activeRange: ChartRange;
  readonly onSelectRange: (range: ChartRange) => void;
  readonly className?: string;
}

export const CHART_RANGES: readonly ChartRange[] = ["1D", "5D", "1M", "6M", "1Y", "ALL"] as const;

export function ChartRangeBar({ activeRange, onSelectRange, className = "" }: ChartRangeBarProps) {
  return (
    <div className={`tv-bottom-range-bar ${className}`}>
      <span className="tv-range-label">Range:</span>
      <div className="tv-range-group">
        {CHART_RANGES.map((range) => {
          const isActive = activeRange === range;
          return (
            <Button
              key={range}
              type="button"
              variant="ghost"
              size="sm"
              className={`tv-range-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectRange(range)}
              aria-pressed={isActive}
            >
              {range}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
