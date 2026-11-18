/**
 * @file src/features/portfolio/components/PortfolioPage.tsx
 * @description Master Paper Portfolio & Risk Desk page wrapper.
 * Composes workstation shell, balance KPIs, active simulated positions, and execution order logs.
 */

import { QuantShell } from "@/components/layout";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioKpiGrid } from "./PortfolioKpiGrid";
import { PortfolioPositionsTable } from "./PortfolioPositionsTable";
import { PortfolioOrdersTable } from "./PortfolioOrdersTable";
import type { PortfolioData } from "../api/getPortfolioData";

export interface PortfolioPageProps {
  readonly initialData: PortfolioData;
}

export function PortfolioPage({ initialData }: PortfolioPageProps) {
  return (
    <QuantShell>
      <div className="desk-container">
        <PortfolioHeader />
        <PortfolioKpiGrid
          totalEquity={initialData.totalEquity}
          initialCapital={initialData.initialCapital}
          realizedPnl={initialData.realizedPnl}
          unrealizedPnl={initialData.unrealizedPnl}
          availableMargin={initialData.availableMargin}
          marginUsed={initialData.marginUsed}
          winRate={initialData.winRate}
        />
        <PortfolioPositionsTable positions={initialData.positions} />
        <PortfolioOrdersTable executions={initialData.recentExecutions} />
      </div>
    </QuantShell>
  );
}
