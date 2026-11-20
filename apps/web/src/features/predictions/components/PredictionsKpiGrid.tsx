/**
 * @file src/features/predictions/components/PredictionsKpiGrid.tsx
 * @description Performance KPIs grid for prediction ledger.
 * @author yuva.devlab@gmail.com
 */

import { MetricCard } from "@quant-ai/ui";
import { Activity, BarChart3, Target, TrendingUp } from "lucide-react";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";

export interface PredictionsKpiGridProps {
  readonly totalGenerated: number;
  readonly activeCount: number;
  readonly winRate: string;
  readonly profitFactor: string;
  readonly riskReward: string;
  readonly targetHitCount?: number;
  readonly stopHitCount?: number;
  readonly avgGainText?: string;
  readonly avgLossText?: string;
  readonly winRateBadge?: string;
  readonly holdingHint?: string;
  readonly profitFactorBadge?: string;
}

export function PredictionsKpiGrid({
  totalGenerated,
  activeCount,
  winRate,
  profitFactor,
  riskReward,
  targetHitCount = 0,
  stopHitCount = 0,
  avgGainText,
  avgLossText,
  winRateBadge,
  holdingHint,
  profitFactorBadge,
}: PredictionsKpiGridProps) {
  const copy = PREDICTIONS_COPY.KPIS;

  return (
    <section className="metric-grid" aria-label={copy.TOTAL_GENERATED}>
      <MetricCard
        label={copy.TOTAL_GENERATED}
        value={String(totalGenerated)}
        icon={<Activity size={16} />}
        badge={copy.ALL_TIME_BADGE}
        hint={
          <>
            <span className="text-gain">
              {activeCount} {copy.ACTIVE_SUFFIX}
            </span>
            <span className="metric-divider">·</span>
            <span>
              {totalGenerated - activeCount} {copy.SETTLED_SUFFIX}
            </span>
          </>
        }
      />

      <MetricCard
        label={copy.WIN_RATE}
        value={<span className="text-gain">{winRate}</span>}
        icon={<Target size={16} />}
        badge={winRateBadge ?? copy.DEFAULT_WIN_RATE_BADGE}
        badgeClass="badge-green"
        hint={
          <>
            <span className="text-gain">
              {targetHitCount} {copy.TARGETS_HIT_SUFFIX}
            </span>
            <span className="metric-divider">·</span>
            <span className="text-loss">
              {stopHitCount} {copy.STOPS_SUFFIX}
            </span>
          </>
        }
      />

      <MetricCard
        label={copy.PROFIT_FACTOR}
        value={profitFactor}
        icon={<BarChart3 size={16} />}
        badge={profitFactorBadge ?? copy.PROFIT_FACTOR_BADGE}
        hint={
          <>
            <span className="text-gain">{avgGainText ?? copy.DEFAULT_AVG_GAIN}</span>
            <span className="metric-divider">·</span>
            <span className="text-loss">{avgLossText ?? copy.DEFAULT_AVG_LOSS}</span>
          </>
        }
      />

      <MetricCard
        label={copy.AVG_RR}
        value={<span className="text-gain">{riskReward}</span>}
        icon={<TrendingUp size={16} />}
        badge={copy.POSITIVE_EXPECTANCY}
        badgeClass="badge-green"
        hint={<span>{holdingHint ?? copy.DEFAULT_HOLDING_HINT}</span>}
      />
    </section>
  );
}
