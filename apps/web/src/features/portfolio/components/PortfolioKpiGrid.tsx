/**
 * @file src/features/portfolio/components/PortfolioKpiGrid.tsx
 * @description KPI summary grid for paper portfolio balances, P&L, and margin.
 */

import { ArrowUpRight, PieChart, ShieldCheck, TrendingUp, Wallet } from "lucide-react";

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

  return (
    <div className="portfolio-kpi-grid">
      <div className="kpi-metric-card">
        <div className="kpi-icon-row">
          <Wallet size={18} className="kpi-icon icon-blue" />
          <span className="kpi-title">TOTAL EQUITY</span>
        </div>
        <div className="kpi-big-number">₹{totalEquity.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-gain">
          <ArrowUpRight size={14} />
          <span>+{totalReturnPercent}% total return</span>
        </div>
      </div>

      <div className="kpi-metric-card">
        <div className="kpi-icon-row">
          <TrendingUp size={18} className="kpi-icon icon-green" />
          <span className="kpi-title">UNREALIZED P&L</span>
        </div>
        <div className="kpi-big-number text-gain">+₹{unrealizedPnl.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-muted">Across 3 open positions</div>
      </div>

      <div className="kpi-metric-card">
        <div className="kpi-icon-row">
          <ShieldCheck size={18} className="kpi-icon icon-emerald" />
          <span className="kpi-title">REALIZED P&L</span>
        </div>
        <div className="kpi-big-number text-gain">+₹{realizedPnl.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-gain">Win Rate {winRate}</div>
      </div>

      <div className="kpi-metric-card">
        <div className="kpi-icon-row">
          <PieChart size={18} className="kpi-icon icon-amber" />
          <span className="kpi-title">AVAILABLE MARGIN</span>
        </div>
        <div className="kpi-big-number">₹{availableMargin.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-muted">
          Margin Used: ₹{marginUsed.toLocaleString("en-IN")} (34.7%)
        </div>
      </div>
    </div>
  );
}
