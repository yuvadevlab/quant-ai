/**
 * @file src/features/portfolio/components/PortfolioHeader.tsx
 * @description Header banner for the Paper Portfolio & Risk Desk.
 * @author yuva.devlab@gmail.com
 */

import { ChevronRight, ShieldCheck } from "lucide-react";
import { PORTFOLIO_COPY } from "@/lib/ui-copy/portfolio.copy";

export interface PortfolioHeaderProps {
  readonly initialCapital?: number;
}

export function PortfolioHeader({ initialCapital = 1000000 }: PortfolioHeaderProps) {
  const copy = PORTFOLIO_COPY.HEADER;
  const formattedCapital = `₹${(initialCapital / 100000).toLocaleString("en-IN")}L`;

  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{copy.BREADCRUMB_TRADING_DESK}</span>
          <ChevronRight size={14} />
          <span className="current">{copy.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{copy.TITLE}</h1>
        <p className="desk-subtitle">{copy.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <span className="paper-trading-tag">
          <ShieldCheck size={16} />
          <span>
            {copy.SIMULATION_STATUS} · {formattedCapital} {copy.CAPITAL_SUFFIX}
          </span>
        </span>
      </div>
    </div>
  );
}
