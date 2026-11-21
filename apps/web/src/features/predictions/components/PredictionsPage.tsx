/**
 * @file src/features/predictions/components/PredictionsPage.tsx
 * @description Master Prediction Lab & Signal Audit Ledger page wrapper.
 * Composes workstation shell, and pure @quant-ai/ui presentation blocks with filter state.
 * @author yuva.devlab@gmail.com
 */

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { HorizonFilter, LedgerFilterTab } from "@/constants";
import { UiSignalStatus } from "@/components/quantai/data";
import {
  PredictionsHeader,
  PredictionsKpiGrid,
  PredictionsToolbar,
  PredictionsTable,
} from "@quant-ai/ui";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";
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
          onSelectFilter={(tab) => setActiveFilter(tab as LedgerFilterTab)}
          horizonFilter={horizonFilter}
          onSelectHorizon={setHorizonFilter}
          search={search}
          onSearchChange={setSearch}
          counts={counts}
        />
        <PredictionsTable
          signals={filteredSignals}
          renderInspectLink={(signal) => (
            <Link to="/predictions/$id" params={{ id: signal.id }} className="btn-table-action">
              <span>{PREDICTIONS_COPY.TABLE.INSPECT_ACTION}</span>
              <ArrowRight size={13} />
            </Link>
          )}
        />
      </div>
    </QuantShell>
  );
}
