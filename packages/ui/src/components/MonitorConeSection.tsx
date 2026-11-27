/**
 * @file packages/ui/src/components/MonitorConeSection.tsx
 * @description Transparent state for unavailable provider-supplied price history.
 */

import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";

/**
 * Signal identity displayed in the chart-history panel.
 */
export interface TrajectorySignalSummary {
  readonly symbol: string;
}

/**
 * Props for the monitor chart-history panel.
 */
export interface MonitorConeSectionProps {
  readonly signal: TrajectorySignalSummary;
}

/**
 * Explains when provider-supplied price history is unavailable instead of displaying synthetic prices.
 *
 * @param props - Signal identity for the monitor panel.
 * @returns A chart-unavailable state.
 */
export function MonitorConeSection({ signal }: MonitorConeSectionProps) {
  const copy = UI_COPY_CONSTANTS.MONITOR_CHART;

  return (
    <section className="desk-panel trajectory-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <div>
            <h2 className="panel-title">{copy.TITLE}</h2>
            <p className="panel-subtext">{signal.symbol}</p>
          </div>
        </div>
      </div>
      <p className="chart-unavailable-note">{copy.UNAVAILABLE}</p>
    </section>
  );
}
