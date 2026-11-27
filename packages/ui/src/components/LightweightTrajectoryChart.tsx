/**
 * @file packages/ui/src/components/LightweightTrajectoryChart.tsx
 * @description Chart placeholder until provider-supplied OHLC data is available.
 */

import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";
import type { TrajectoryPoint } from "./trajectory-math";

/**
 * Props retained for consumers of the former synthetic chart component.
 */
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

/**
 * Shows why a price chart is unavailable instead of synthesizing candles or live ticks.
 */
export function LightweightTrajectoryChart({
  symbol,
  className = "",
}: LightweightTrajectoryChartProps) {
  const copy = UI_COPY_CONSTANTS.MONITOR_CHART;

  return (
    <section
      className={`trajectory-panel chart-unavailable ${className}`}
      aria-label={`${copy.TITLE}: ${symbol}`}
    >
      <h2 className="panel-title">{copy.TITLE}</h2>
      <p className="chart-unavailable-note">{copy.UNAVAILABLE}</p>
    </section>
  );
}
