/**
 * @file src/features/predictions/components/PredictionsPage.tsx
 * @description Master Prediction Lab & Signal Audit Ledger page wrapper.
 * Composes workstation shell, and pure @quant-ai/ui presentation blocks with filter state.
 * @author yuva.devlab@gmail.com
 */

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { QuantShell } from "@/components/layout";
import { HorizonFilter, LedgerFilterTab } from "@/constants";
import { UiSignalStatus } from "@/components/quantai/data";
import { apiFetch } from "@/lib/api-fetcher";
import { useRealtimeTicks } from "@/hooks/use-realtime-ticks";
import { useRealtimeDeliberation } from "@/hooks/use-realtime-deliberation";
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
  const queryClient = useQueryClient();
  const { ticks } = useRealtimeTicks();
  const { latestSignalUpdate } = useRealtimeDeliberation();

  const [activeFilter, setActiveFilter] = useState<LedgerFilterTab>(LedgerFilterTab.ALL);
  const [horizonFilter, setHorizonFilter] = useState<string>(HorizonFilter.ALL);
  const [search, setSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleRunAnalysis = async () => {
    setIsScanning(true);
    try {
      await apiFetch("/api/predictions/analyze", { method: "POST" });
      await queryClient.invalidateQueries({ queryKey: ["predictions-ledger"] });
    } finally {
      setIsScanning(false);
    }
  };

  const liveSignals = useMemo(() => {
    return initialData.signals.map((signal) => {
      const tick = ticks[signal.symbol];
      const isTargetSignal = latestSignalUpdate && latestSignalUpdate.id === signal.id;
      const status = isTargetSignal ? (latestSignalUpdate.status as UiSignalStatus) : signal.status;
      const last = tick?.price ? `₹${tick.price.toLocaleString("en-IN")}` : signal.last;

      return {
        ...signal,
        status,
        last,
      };
    });
  }, [initialData.signals, ticks, latestSignalUpdate]);

  const filteredSignals = useMemo(() => {
    return liveSignals.filter((signal) => {
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
  }, [liveSignals, activeFilter, horizonFilter, search]);

  const counts = useMemo(
    () => ({
      all: liveSignals.length,
      active: liveSignals.filter((s) => s.status === UiSignalStatus.ACTIVE).length,
      targetHit: liveSignals.filter((s) => s.status === UiSignalStatus.TARGET_HIT).length,
      stopHit: liveSignals.filter((s) => s.status === UiSignalStatus.STOP_HIT).length,
    }),
    [liveSignals],
  );

  return (
    <QuantShell>
      <div className="desk-container">
        <PredictionsHeader
          activeCount={counts.active}
          actionSlot={
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button type="button" className="btn-secondary" onClick={() => window.print()}>
                <Download size={14} />
                <span>{PREDICTIONS_COPY.HEADER.EXPORT_AUDIT}</span>
              </Button>
              <Button
                type="button"
                className="btn-primary"
                onClick={handleRunAnalysis}
                disabled={isScanning}
              >
                <Sparkles size={14} />
                <span>
                  {isScanning
                    ? PREDICTIONS_COPY.HEADER.ANALYZING
                    : PREDICTIONS_COPY.HEADER.RUN_ANALYSIS}
                </span>
              </Button>
            </div>
          }
        />
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
          emptyTitle={PREDICTIONS_COPY.EMPTY.TITLE}
          emptyDescription={PREDICTIONS_COPY.EMPTY.DESCRIPTION}
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
