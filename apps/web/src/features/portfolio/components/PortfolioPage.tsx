/**
 * @file src/features/portfolio/components/PortfolioPage.tsx
 * @description Master Paper Portfolio & Risk Desk page wrapper.
 * Composes workstation shell, balance KPIs, active simulated positions, and execution order logs using @quant-ai/ui.
 * @author yuva.devlab@gmail.com
 */

import { QuantShell } from "@/components/layout";
import {
  PortfolioHeader,
  PortfolioKpiGrid,
  PortfolioPositionsTable,
  PortfolioOrdersTable,
} from "@quant-ai/ui";
import type { PortfolioData } from "../api/getPortfolioData";

export interface PortfolioPageProps {
  readonly initialData: PortfolioData;
}

export function PortfolioPage({ initialData }: PortfolioPageProps) {
  return (
    <QuantShell>
      <div className="desk-container">
        <PortfolioHeader initialCapital={initialData.initialCapital} />
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
