/**
 * @file packages/ui/src/components/MonitorKpiGrid.tsx
 * @description Standardized execution monitor KPI grid for entry, LTP, targets, stop, and conviction.
 */

import { ArrowUpRight } from "lucide-react";
import { cn } from "@yuva-devlab/ui";
import { KpiMetricCard } from "./KpiMetricCard";

/**
 * Props for the MonitorKpiGrid component.
 */
export interface MonitorKpiGridProps {
  /** Entry price zone */
  readonly entry: string;
  /** Actual filled price string */
  readonly entryPrice: number | string;
  /** Current last traded price */
  readonly last: string;
  /** Price change percentage */
  readonly change: string;
  /** Signal direction */
  readonly direction: "BUY" | "SELL" | string;
  /** Primary target level */
  readonly target1: string;
  /** Extended target level */
  readonly target2: string;
  /** Stop loss price */
  readonly stop: string;
  /** AI agent conviction score */
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
  change,
  direction,
  target1,
  target2,
  stop,
  confidence,
  riskReward,
  className = "",
}: MonitorKpiGridProps) {
  const isBuy = direction.toUpperCase() === "BUY";

  return (
    <div className={cn("monitor-kpi-grid", className)}>
      <KpiMetricCard
        title="ENTRY ZONE"
        value={entry}
        footer={`Filled: ${entryPrice}`}
        footerClass="text-muted"
      />

      <KpiMetricCard
        title="CURRENT LTP"
        value={last}
        valueClass="highlight"
        footer={
          <>
            <ArrowUpRight size={14} />
            <span>{change}</span>
          </>
        }
        footerClass={isBuy ? "text-gain" : "text-loss"}
      />

      <KpiMetricCard
        title="TARGET 1 LEVEL"
        value={target1}
        valueClass="text-gain"
        footer="+1.34% target upside"
        footerClass="text-gain"
      />

      <KpiMetricCard
        title="TARGET 2 LEVEL"
        value={target2}
        valueClass="text-gain"
        footer="+2.38% extended target"
        footerClass="text-muted"
      />

      <KpiMetricCard
        title="STOP LOSS"
        value={stop}
        valueClass="text-loss"
        footer="−0.84% max risk"
        footerClass="text-loss"
      />

      <KpiMetricCard
        title="AGENT CONVICTION"
        value={confidence}
        valueClass="text-brand"
        footer={`Risk/Reward ${riskReward}`}
        footerClass="text-muted"
      />
    </div>
  );
}
