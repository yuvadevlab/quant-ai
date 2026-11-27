/**
 * @file packages/ui/src/components/MonitorKpiGrid.tsx
 * @description Prediction monitor summary for recorded entry, quotes, targets, and model confidence.
 */

import { cn } from "@yuva-devlab/ui";
import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";
import { KpiMetricCard } from "./KpiMetricCard";

/**
 * Props for the MonitorKpiGrid component.
 */
export interface MonitorKpiGridProps {
  /** Entry price zone */
  readonly entry: string;
  /** Recorded entry price */
  readonly entryPrice: number | string;
  /** Last price recorded with the prediction */
  readonly last: string;
  /** Primary target level */
  readonly target1: string;
  /** Extended target level, when recorded */
  readonly target2?: string;
  /** Stop loss price */
  readonly stop: string;
  /** Model confidence */
  readonly confidence: string;
  /** Calculated risk-to-reward ratio */
  readonly riskReward: string;
  /** Custom CSS classes */
  readonly className?: string;
}

/**
 * Renders the 6-card quote and level execution grid for active signal tracking.
 *
 * @param props - Target levels, quotes, and conviction metrics.
 * @returns Rendered JSX MonitorKpiGrid element.
 */
export function MonitorKpiGrid({
  entry,
  entryPrice,
  last,
  target1,
  target2,
  stop,
  confidence,
  riskReward,
  className = "",
}: MonitorKpiGridProps) {
  const copy = UI_COPY_CONSTANTS.MONITOR_KPI_GRID;

  return (
    <div className={cn("monitor-kpi-grid", className)}>
      <KpiMetricCard
        title={copy.ENTRY_ZONE}
        value={entry}
        footer={`${copy.ENTRY_REFERENCE_PREFIX} ${entryPrice}`}
        footerClass="text-muted"
      />

      <KpiMetricCard title={copy.RECORDED_PRICE} value={last} valueClass="highlight" />

      <KpiMetricCard title={copy.TARGET_1_LEVEL} value={target1} valueClass="text-gain" />

      {target2 && (
        <KpiMetricCard title={copy.TARGET_2_LEVEL} value={target2} valueClass="text-gain" />
      )}

      <KpiMetricCard title={copy.STOP_LOSS} value={stop} valueClass="text-loss" />

      <KpiMetricCard
        title={copy.MODEL_CONFIDENCE}
        value={confidence}
        valueClass="text-brand"
        footer={`${copy.RISK_REWARD_PREFIX} ${riskReward}`}
        footerClass="text-muted"
      />
    </div>
  );
}
