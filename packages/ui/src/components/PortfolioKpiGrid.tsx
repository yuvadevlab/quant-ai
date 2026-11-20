/**
 * @file packages/ui/src/components/PortfolioKpiGrid.tsx
 * @description KPI summary grid for paper portfolio balances, P&L, and margin.
 * @author yuva.devlab@gmail.com
 */

import { ArrowUpRight, PieChart, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@yuva-devlab/ui";

/**
 * Props for the PortfolioKpiGrid presentation component.
 */
export interface PortfolioKpiGridProps {
  /** Current total mark-to-market equity */
  readonly totalEquity: number;
  /** Initial starting paper capital */
  readonly initialCapital: number;
  /** Closed trade realized profit and loss */
  readonly realizedPnl: number;
  /** Open trade floating mark-to-market profit and loss */
  readonly unrealizedPnl: number;
  /** Available uncommitted margin */
  readonly availableMargin: number;
  /** Margin deployed in open positions */
  readonly marginUsed: number;
  /** Portfolio trade win rate percentage string */
  readonly winRate: string;
}

/**
 * Institutional 4-card metric grid displaying equity, unrealized P&L, realized P&L, and margin.
 *
 * @param props - Equity, P&L, and margin numeric values.
 * @returns Rendered JSX PortfolioKpiGrid element.
 */
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
      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <Wallet size={18} className="kpi-icon icon-blue" />
          <span className="kpi-title">TOTAL EQUITY</span>
        </div>
        <div className="kpi-big-number">₹{totalEquity.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-gain">
          <ArrowUpRight size={14} />
          <span>+{totalReturnPercent}% TOTAL RETURN</span>
        </div>
      </Card>

      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <TrendingUp size={18} className="kpi-icon icon-green" />
          <span className="kpi-title">UNREALIZED P&L</span>
        </div>
        <div className="kpi-big-number text-gain">+₹{unrealizedPnl.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-muted">Across active open positions</div>
      </Card>

      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <ShieldCheck size={18} className="kpi-icon icon-emerald" />
          <span className="kpi-title">REALIZED P&L</span>
        </div>
        <div className="kpi-big-number text-gain">+₹{realizedPnl.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-gain">Win Rate: {winRate}</div>
      </Card>

      <Card className="kpi-metric-card">
        <div className="kpi-icon-row">
          <PieChart size={18} className="kpi-icon icon-amber" />
          <span className="kpi-title">AVAILABLE MARGIN</span>
        </div>
        <div className="kpi-big-number">₹{availableMargin.toLocaleString("en-IN")}</div>
        <div className="kpi-footer text-muted">
          Margin Used: ₹{marginUsed.toLocaleString("en-IN")}
        </div>
      </Card>
    </div>
  );
}
