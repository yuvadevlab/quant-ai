/**
 * @file packages/ui/src/components/MonitorConeSection.tsx
 * @description Interactive real-time trajectory cone panel with timeframe controls and telemetry.
 * @author yuva.devlab@gmail.com
 */

import { Activity } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { TelemetryBar } from "./TelemetryBar";
import { TrajectoryConeChart, type TrajectoryPoint } from "./TrajectoryConeChart";

/**
 * Signal trajectory summary props for cone visualization.
 */
export interface TrajectorySignalSummary {
  readonly symbol: string;
  readonly entryPrice: number;
  readonly target1: string;
  readonly target2: string;
  readonly stop: string;
  readonly mfe: string;
  readonly mae: string;
}

/**
 * Props for the MonitorConeSection presentation component.
 */
export interface MonitorConeSectionProps {
  /** Signal price target parameters */
  readonly signal: TrajectorySignalSummary;
  /** Whether the signal is currently in-flight */
  readonly isActive: boolean;
  /** Active timeframe filter period (e.g. '1m', '5m', '15m') */
  readonly timeframe: string;
  /** Callback when timeframe period changes */
  readonly onTimeframeChange: (period: string) => void;
  /** Historical and simulated trajectory sample points */
  readonly samples: readonly TrajectoryPoint[];
  /** Panel title */
  readonly title?: string;
  /** Panel subtitle */
  readonly subtitle?: string;
}

/**
 * Interactive trajectory cone chart panel displaying actual price progress vs expected bounds.
 *
 * @param props - MonitorConeSectionProps containing signal and timeframe handlers.
 * @returns Rendered JSX MonitorConeSection element.
 */
export function MonitorConeSection({
  signal,
  isActive,
  timeframe,
  onTimeframeChange,
  samples,
  title = "REAL-TIME TRAJECTORY CONE",
  subtitle = "Probabilistic price path progression with expected path, 2-sigma variance cone, and excursion tracking.",
}: MonitorConeSectionProps) {
  return (
    <section className="desk-panel trajectory-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Activity size={18} className="panel-icon" />
          <div>
            <h2 className="panel-title">{title}</h2>
            <p className="panel-subtext">{subtitle}</p>
          </div>
        </div>
        <div className="chart-tools">
          <div className="tab-pill-group">
            {["1m", "5m", "15m"].map((period) => (
              <Button
                key={period}
                type="button"
                className={`tab-pill ${timeframe === period ? "active" : ""}`}
                onClick={() => onTimeframeChange(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-legend-row">
        <span className="legend-item">
          <span className="legend-dot dot-actual" /> Actual Path
        </span>
        <span className="legend-item">
          <span className="legend-dot dot-expected" /> Expected Path
        </span>
        <span className="legend-item">
          <span className="legend-box box-cone" /> 2σ Cone
        </span>
        <span className="legend-item">
          <span className="legend-line line-target" /> Target 1 ({signal.target1})
        </span>
        <span className="legend-item">
          <span className="legend-line line-stop" /> Stop Loss ({signal.stop})
        </span>
      </div>

      <TrajectoryConeChart
        symbol={signal.symbol}
        entryPrice={signal.entryPrice}
        target1={signal.target1}
        target2={signal.target2}
        stop={signal.stop}
        samples={samples}
        isActive={isActive}
      />

      <TelemetryBar
        stats={[
          {
            label: "MAX FAVORABLE EXCURSION",
            value: signal.mfe,
            subtext: "Peak unrealized upside",
            valueClass: "text-gain",
          },
          {
            label: "MAX ADVERSE EXCURSION",
            value: signal.mae,
            subtext: "Max intra-trade drawdown",
            valueClass: "text-loss",
          },
          {
            label: "TRAJECTORY ALIGNMENT",
            value: "94.2%",
            subtext: "Correlation with expected cone",
            valueClass: "text-gain",
          },
          {
            label: "PATH PROGRESSION",
            progressBarPercent: 68,
            subtext: "Target distance completed",
          },
        ]}
      />
    </section>
  );
}
