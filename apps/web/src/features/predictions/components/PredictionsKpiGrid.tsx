/**
 * @file src/features/predictions/components/PredictionsKpiGrid.tsx
 * @description Performance KPIs grid for prediction ledger.
 */

import { MetricCard } from "@quant-ai/ui";
import { Activity, BarChart3, Target, TrendingUp } from "lucide-react";

export interface PredictionsKpiGridProps {
  readonly totalGenerated: number;
  readonly activeCount: number;
  readonly winRate: string;
  readonly profitFactor: string;
  readonly riskReward: string;
}

export function PredictionsKpiGrid({
  totalGenerated,
  activeCount,
  winRate,
  profitFactor,
  riskReward,
}: PredictionsKpiGridProps) {
  return (
    <section className="metric-grid" aria-label="Prediction Performance KPIs">
      <MetricCard
        label="TOTAL GENERATED"
        value={String(totalGenerated)}
        icon={<Activity size={16} />}
        badge="ALL TIME"
        hint={
          <>
            <span className="text-gain">{activeCount} active</span>
            <span className="metric-divider">·</span>
            <span>{totalGenerated - activeCount} settled</span>
          </>
        }
      />

      <MetricCard
        label="CALIBRATED WIN RATE"
        value={<span className="text-gain">{winRate}</span>}
        icon={<Target size={16} />}
        badge="+3.2% THIS MONTH"
        badgeClass="badge-green"
        hint={
          <>
            <span className="text-gain">106 targets hit</span>
            <span className="metric-divider">·</span>
            <span className="text-loss">32 stops</span>
          </>
        }
      />

      <MetricCard
        label="PROFIT FACTOR"
        value={profitFactor}
        icon={<BarChart3 size={16} />}
        badge="RISK ADJUSTED"
        hint={
          <>
            <span className="text-gain">+3.6% avg gain</span>
            <span className="metric-divider">·</span>
            <span className="text-loss">−1.2% avg loss</span>
          </>
        }
      />

      <MetricCard
        label="AVG RISK-REWARD"
        value={<span className="text-gain">{riskReward}</span>}
        icon={<TrendingUp size={16} />}
        badge="POSITIVE EXPECTANCY"
        badgeClass="badge-green"
        hint={<span>Avg holding: 42m (Intraday) / 4d (Swing)</span>}
      />
    </section>
  );
}
