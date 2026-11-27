/**
 * @file packages/ui/src/components/TrajectoryConeChart.tsx
 * @description Chart placeholder until verified market history is available.
 */

import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";
import type { TrajectoryPoint } from "./trajectory-math";

export type { TrajectoryPoint };

/**
 * Inputs retained for trajectory chart consumers while provider history is unavailable.
 */
export interface TrajectoryConeChartProps {
  readonly symbol: string;
  readonly entryPrice: number | string;
  readonly target1: string;
  readonly target2: string;
  readonly stop: string;
  readonly samples?: readonly TrajectoryPoint[];
  readonly trajectory?: readonly TrajectoryPoint[];
  readonly isActive?: boolean;
  readonly className?: string;
}

/**
 * Shows the data limitation instead of displaying synthetic realized prices or confidence cones.
 */
export function TrajectoryConeChart({ symbol, className = "" }: TrajectoryConeChartProps) {
  const copy = UI_COPY_CONSTANTS.MONITOR_CHART;

  return (
    <section
      className={`trajectory-chart-viewport chart-unavailable ${className}`}
      role="group"
      aria-label={`${copy.TITLE}: ${symbol}`}
    >
      <h2 className="panel-title">{copy.TITLE}</h2>
      <p className="chart-unavailable-note">{copy.UNAVAILABLE}</p>
    </section>
  );
}
