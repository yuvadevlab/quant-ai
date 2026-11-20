/**
 * @file src/features/monitor/components/MonitorConeSection.tsx
 * @description Interactive real-time trajectory cone panel with timeframe controls and telemetry.
 * @author yuva.devlab@gmail.com
 */

import { useState } from "react";
import { Button, TelemetryBar, TrajectoryConeChart } from "@quant-ai/ui";
import { Activity } from "lucide-react";
import { chartSamples } from "@/components/quantai/chart-samples";
import type { Signal } from "@/components/quantai/data";
import { MONITOR_COPY } from "@/lib/ui-copy/monitor.copy";

export interface MonitorConeSectionProps {
  readonly signal: Signal;
  readonly isActive: boolean;
}

export function MonitorConeSection({ signal, isActive }: MonitorConeSectionProps) {
  const [timeframe, setTimeframe] = useState("1m");
  const copy = MONITOR_COPY.CONE;

  return (
    <section className="desk-panel trajectory-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Activity size={18} className="panel-icon" />
          <div>
            <h2 className="panel-title">{copy.TITLE}</h2>
            <p className="panel-subtext">{copy.SUBTITLE}</p>
          </div>
        </div>
        <div className="chart-tools">
          <div className="tab-pill-group">
            {["1m", "5m", "15m"].map((period) => (
              <Button
                key={period}
                type="button"
                className={`tab-pill ${timeframe === period ? "active" : ""}`}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-legend-row">
        <span className="legend-item">
          <span className="legend-dot dot-actual" /> {copy.LEGEND_ACTUAL}
        </span>
        <span className="legend-item">
          <span className="legend-dot dot-expected" /> {copy.LEGEND_EXPECTED}
        </span>
        <span className="legend-item">
          <span className="legend-box box-cone" /> {copy.LEGEND_CONE}
        </span>
        <span className="legend-item">
          <span className="legend-line line-target" /> {copy.LEGEND_TARGET} ({signal.target1})
        </span>
        <span className="legend-item">
          <span className="legend-line line-stop" /> {copy.LEGEND_STOP} ({signal.stop})
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
            label: copy.MFE_LABEL,
            value: signal.mfe,
            subtext: copy.MFE_SUBTEXT,
            valueClass: "text-gain",
          },
          {
            label: copy.MAE_LABEL,
            value: signal.mae,
            subtext: copy.MAE_SUBTEXT,
            valueClass: "text-loss",
          },
          {
            label: copy.ALIGNMENT_LABEL,
            value: "94.2%",
            subtext: copy.ALIGNMENT_SUBTEXT,
            valueClass: "text-gain",
          },
          {
            label: copy.PROGRESS_LABEL,
            progressBarPercent: 68,
            subtext: copy.PROGRESS_SUBTEXT,
          },
        ]}
      />
    </section>
  );
}
