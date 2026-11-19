/**
 * @file src/features/monitor/components/MonitorConeSection.tsx
 * @description Interactive real-time trajectory cone panel with timeframe controls and telemetry.
 */

import { useState } from "react";
import { TelemetryBar, TrajectoryConeChart } from "@quant-ai/ui";
import { Activity } from "lucide-react";
import { chartSamples } from "@/components/quantai/chart-samples";
import type { Signal } from "@/components/quantai/data";

export interface MonitorConeSectionProps {
  readonly signal: Signal;
  readonly isActive: boolean;
}

export function MonitorConeSection({ signal, isActive }: MonitorConeSectionProps) {
  const [timeframe, setTimeframe] = useState("1m");

  return (
    <section className="desk-panel trajectory-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Activity size={18} className="panel-icon" />
          <div>
            <h2 className="panel-title">Real-time Predictive Trajectory Cone</h2>
            <p className="panel-subtext">
              Actual price path vs. predicted confidence bounds and expected path to Target 1.
            </p>
          </div>
        </div>
        <div className="chart-tools">
          <div className="tab-pill-group">
            {["1m", "5m", "15m"].map((period) => (
              <button
                key={period}
                type="button"
                className={`tab-pill ${timeframe === period ? "active" : ""}`}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-legend-row">
        <span className="legend-item">
          <span className="legend-dot dot-actual" /> Actual Price
        </span>
        <span className="legend-item">
          <span className="legend-dot dot-expected" /> Expected Path
        </span>
        <span className="legend-item">
          <span className="legend-box box-cone" /> Predictive Cone
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
        samples={chartSamples}
        isActive={isActive}
      />

      <TelemetryBar
        stats={[
          {
            label: "MAX FAVORABLE EXCURSION (MFE)",
            value: signal.mfe,
            subtext: "Peak ₹2,449.60",
            valueClass: "text-gain",
          },
          {
            label: "MAX ADVERSE EXCURSION (MAE)",
            value: signal.mae,
            subtext: "Trough ₹2,417.10",
            valueClass: "text-loss",
          },
          {
            label: "TRAJECTORY ALIGNMENT",
            value: "94.2%",
            subtext: "Within Upper Cone",
            valueClass: "text-gain",
          },
          {
            label: "PROGRESS TO TARGET 1",
            progressBarPercent: 68,
            subtext: "68% completed",
          },
        ]}
      />
    </section>
  );
}
