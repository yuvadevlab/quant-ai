/**
 * @file packages/ui/src/components/PortfolioHeader.tsx
 * @description Header banner for the Paper Portfolio & Risk Desk.
 */

import { ChevronRight, ShieldCheck } from "lucide-react";

/**
 * Props for the PortfolioHeader presentation component.
 */
export interface PortfolioHeaderProps {
  /** Initial virtual trading capital */
  readonly initialCapital?: number;
  /** Main desk title */
  readonly title?: string;
  /** Subtitle narrative */
  readonly subtitle?: string;
  /** Breadcrumb section label */
  readonly breadcrumbLabel?: string;
  /** Simulation status badge text */
  readonly simulationStatusLabel?: string;
}

/**
 * Institutional header banner for simulated portfolio and risk monitoring.
 *
 * @param props - PortfolioHeaderProps containing capital and headers.
 * @returns Rendered JSX PortfolioHeader element.
 */
export function PortfolioHeader({
  initialCapital = 1000000,
  title = "PAPER PORTFOLIO & EXECUTION DESK",
  subtitle = "Real-time simulated position tracking, risk metrics, and order execution audit trail.",
  breadcrumbLabel = "TRADING DESK",
  simulationStatusLabel = "SIMULATION ACTIVE",
}: PortfolioHeaderProps) {
  const formattedCapital = `₹${(initialCapital / 100000).toLocaleString("en-IN")}L`;

  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{breadcrumbLabel}</span>
          <ChevronRight size={14} />
          <span className="current">{title.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{title}</h1>
        <p className="desk-subtitle">{subtitle}</p>
      </div>
      <div className="desk-actions">
        <span className="paper-trading-tag">
          <ShieldCheck size={16} />
          <span>
            {simulationStatusLabel} · {formattedCapital} VIRTUAL CAPITAL
          </span>
        </span>
      </div>
    </div>
  );
}
