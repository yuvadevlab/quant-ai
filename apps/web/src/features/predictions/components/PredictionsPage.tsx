/**
 * @file src/features/predictions/components/PredictionsPage.tsx
 * @description Master Prediction Lab & Signal Audit Ledger page wrapper.
 * Composes workstation shell, KPI summary cards, filter toolbar, and tabular signal audit ledger.
 */

import { useMemo, useState } from "react";
import { QuantShell } from "@/components/layout";
import { HorizonFilter, LedgerFilterTab } from "@/constants";
import { UiSignalStatus } from "@/components/quantai/data";
import { PredictionsHeader } from "./PredictionsHeader";
import { PredictionsKpiGrid } from "./PredictionsKpiGrid";
import { PredictionsToolbar } from "./PredictionsToolbar";
import { PredictionsTable } from "./PredictionsTable";
import type { PredictionsData } from "../api/getPredictionsData";

export interface PredictionsPageProps {
  readonly initialData: PredictionsData;
}

export function PredictionsPage({ initialData }: PredictionsPageProps) {
  const [activeFilter, setActiveFilter] = useState<LedgerFilterTab>(LedgerFilterTab.ALL);
  const [horizonFilter, setHorizonFilter] = useState<string>(HorizonFilter.ALL);
  const [search, setSearch] = useState("");

  const filteredSignals = useMemo(() => {
    return initialData.signals.filter((signal) => {
      const matchesTab =
        activeFilter === LedgerFilterTab.ALL ||
        (activeFilter === LedgerFilterTab.ACTIVE && signal.status === UiSignalStatus.ACTIVE) ||
        (activeFilter === LedgerFilterTab.TARGET_HIT &&
          signal.status === UiSignalStatus.TARGET_HIT) ||
        (activeFilter === LedgerFilterTab.STOP_HIT && signal.status === UiSignalStatus.STOP_HIT);

      const matchesHorizon =
        horizonFilter === HorizonFilter.ALL ||
        signal.horizon.toLowerCase() === horizonFilter.toLowerCase();

      const matchesSearch =
        !search.trim() ||
        `${signal.symbol} ${signal.instrument} ${signal.id} ${signal.companyName}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      return matchesTab && matchesHorizon && matchesSearch;
    });
  }, [initialData.signals, activeFilter, horizonFilter, search]);

  const counts = useMemo(
    () => ({
      all: initialData.signals.length,
      active: initialData.signals.filter((s) => s.status === UiSignalStatus.ACTIVE).length,
      targetHit: initialData.signals.filter((s) => s.status === UiSignalStatus.TARGET_HIT).length,
      stopHit: initialData.signals.filter((s) => s.status === UiSignalStatus.STOP_HIT).length,
    }),
    [initialData.signals],
  );

  return (
    <QuantShell>
      <div className="desk-container">
        <PredictionsHeader activeCount={counts.active} />
        <PredictionsKpiGrid
          totalGenerated={initialData.totalGenerated}
          activeCount={initialData.activeCount}
          targetHitCount={counts.targetHit}
          stopHitCount={counts.stopHit}
          winRate={initialData.winRate}
          winRateBadge={initialData.winRateBadge}
          profitFactor={initialData.profitFactor}
          riskReward={initialData.riskReward}
          avgGainText={initialData.avgGainText}
          avgLossText={initialData.avgLossText}
          holdingHint={initialData.holdingHint}
        />
        <PredictionsToolbar
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          horizonFilter={horizonFilter}
          onSelectHorizon={setHorizonFilter}
          search={search}
          onSearchChange={setSearch}
          counts={counts}
        />
        <PredictionsTable signals={filteredSignals} />
      </div>
    </QuantShell>
  );
}
