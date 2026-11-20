/**
 * @file src/features/portfolio/components/PortfolioKpiGrid.tsx
 * @description KPI summary grid for paper portfolio balances, P&L, and margin.
 * @author yuva.devlab@gmail.com
 */

import { ArrowUpRight, PieChart, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@quant-ai/ui";
import { PORTFOLIO_COPY } from "@/lib/ui-copy/portfolio.copy";

export interface PortfolioKpiGridProps {
  readonly totalEquity: number;
  readonly initialCapital: number;
  readonly realizedPnl: number;
  readonly unrealizedPnl: number;
  readonly availableMargin: number;
  readonly marginUsed: number;
  readonly winRate: string;
}

export function PortfolioKpiGrid({
  totalEquity,
  initialCapital,
  realizedPnl,
  unrealizedPnl,
  availableMargin,
  marginUsed,
  winRate,
}: PortfolioKpiGridProps) {
  const totalGain = realizedPnl + unrealizedPnl;
  const totalReturnPercent = ((totalGain / initialCapital) * 100).toFixed(2);
  const copy = PORTFOLIO_COPY.KPIS;

  return (
    <div className="portfolio-kpi-grid">
      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <Wallet size={18} className="kpi-icon icon-blue" />
          <span className="kpi-title">{copy.TOTAL_EQUITY}</span>
        </div>
        <div className="kpi-big-number">₹{totalEquity.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-gain">
          <ArrowUpRight size={14} />
          <span>
            +{totalReturnPercent}% {copy.TOTAL_RETURN_SUFFIX}
          </span>
        </div>
      </Card>

      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <TrendingUp size={18} className="kpi-icon icon-green" />
          <span className="kpi-title">{copy.UNREALIZED_PNL}</span>
        </div>
        <div className="kpi-big-number text-gain">+₹{unrealizedPnl.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-muted">{copy.OPEN_POSITIONS_SUBTEXT}</div>
      </Card>

      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <ShieldCheck size={18} className="kpi-icon icon-emerald" />
          <span className="kpi-title">{copy.REALIZED_PNL}</span>
        </div>
        <div className="kpi-big-number text-gain">+₹{realizedPnl.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-gain">
          {copy.WIN_RATE_PREFIX} {winRate}
        </div>
      </Card>

      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <PieChart size={18} className="kpi-icon icon-amber" />
          <span className="kpi-title">{copy.AVAILABLE_MARGIN}</span>
        </div>
        <div className="kpi-big-number">₹{availableMargin.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-muted">
          {copy.MARGIN_USED_PREFIX} ₹{marginUsed.toLocaleString("en-IN")}
        </div>
      </Card>
    </div>
  );
}
