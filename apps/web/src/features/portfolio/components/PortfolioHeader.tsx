/**
 * @file src/features/portfolio/components/PortfolioHeader.tsx
 * @description Header banner for the Paper Portfolio & Risk Desk.
 */

import { ChevronRight, ShieldCheck } from "lucide-react";
import { PORTFOLIO_COPY } from "@/lib/ui-copy/portfolio.copy";

export function PortfolioHeader() {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>TRADING DESK</span>
          <ChevronRight size={14} />
          <span className="current">{PORTFOLIO_COPY.HEADER.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{PORTFOLIO_COPY.HEADER.TITLE}</h1>
        <p className="desk-subtitle">{PORTFOLIO_COPY.HEADER.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <span className="paper-trading-tag">
          <ShieldCheck size={16} />
          <span>SIMULATION ACTIVE · ₹10L CAPITAL</span>
        </span>
      </div>
    </div>
  );
}
