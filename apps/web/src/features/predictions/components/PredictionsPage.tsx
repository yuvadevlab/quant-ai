/**
 * @file src/features/predictions/components/PredictionsPage.tsx
 * @description Master Prediction Lab & Signal Audit Ledger page wrapper.
 * Composes workstation shell, and pure @quant-ai/ui presentation blocks with filter state.
 * @author yuva.devlab@gmail.com
 */

import { useMemo, useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Download, Search } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { HorizonFilter, LedgerFilterTab } from "@/constants";
import { UiSignalStatus } from "@/components/quantai/data";
import { apiFetch } from "@/lib/api-fetcher";
import { useRealtimeDeliberation } from "@/hooks/use-realtime-deliberation";
import {
  Button,
  Input,
  Label,
  PredictionsHeader,
  PredictionsKpiGrid,
  PredictionsToolbar,
  PredictionsTable,
  RecommendationCardGrid,
} from "@quant-ai/ui";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";
import type { PredictionsData } from "../api/getPredictionsData";
import { ResearchRunsPanel } from "./ResearchRunsPanel";

export interface PredictionsPageProps {
  readonly initialData: PredictionsData;
}

export function PredictionsPage({ initialData }: PredictionsPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { latestSignalUpdate } = useRealtimeDeliberation();

  const [activeFilter, setActiveFilter] = useState<LedgerFilterTab>(LedgerFilterTab.ALL);
  const [horizonFilter, setHorizonFilter] = useState<string>(HorizonFilter.ALL);
  const [search, setSearch] = useState("");
  const [researchSymbol, setResearchSymbol] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const handleRunAnalysis = async () => {
    const symbol = researchSymbol.trim().toUpperCase();
    if (!symbol) {
      setAnalysisFailed(true);
      setAnalysisMessage(PREDICTIONS_COPY.RESEARCH.REQUIRED);
      return;
    }

    setIsScanning(true);
    setAnalysisMessage("");
    setAnalysisFailed(false);
    try {
      const result = await apiFetch<readonly unknown[]>("/api/predictions/analyze", {
        method: "POST",
        body: JSON.stringify({ symbols: [symbol] }),
      });
      if (result === null) {
        setAnalysisFailed(true);
        setAnalysisMessage(PREDICTIONS_COPY.RESEARCH.SERVICE_ERROR);
        return;
      }

      setAnalysisMessage(
        result.length > 0 ? PREDICTIONS_COPY.RESEARCH.SUCCESS : PREDICTIONS_COPY.RESEARCH.NO_SETUP,
      );
      await queryClient.invalidateQueries({ queryKey: ["predictions-ledger"] });
    } catch {
      setAnalysisFailed(true);
      setAnalysisMessage(PREDICTIONS_COPY.RESEARCH.SERVICE_ERROR);
    } finally {
      setIsScanning(false);
    }
  };

  const liveSignals = useMemo(() => {
    return initialData.signals.map((signal) => {
      const isTargetSignal = latestSignalUpdate && latestSignalUpdate.id === signal.id;
      const status = isTargetSignal ? (latestSignalUpdate.status as UiSignalStatus) : signal.status;
      return { ...signal, status };
    });
  }, [initialData.signals, latestSignalUpdate]);

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
          title={PREDICTIONS_COPY.HEADER.TITLE}
          subtitle={PREDICTIONS_COPY.HEADER.SUBTITLE}
          inFlightSuffix={PREDICTIONS_COPY.HEADER.IN_FLIGHT_SUFFIX}
          actionSlot={
            <div className="predictions-header-actions">
              <form
                className="research-form"
                onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  void handleRunAnalysis();
                }}
              >
                <Label className="sr-only" htmlFor="research-symbol">
                  {PREDICTIONS_COPY.RESEARCH.FORM_LABEL}
                </Label>
                <Input
                  id="research-symbol"
                  className="research-symbol-input"
                  value={researchSymbol}
                  onChange={(event) => setResearchSymbol(event.target.value)}
                  placeholder={PREDICTIONS_COPY.RESEARCH.SYMBOL_PLACEHOLDER}
                  autoComplete="off"
                />
                <Button type="submit" className="btn-primary" disabled={isScanning}>
                  <Search size={14} />
                  <span>
                    {isScanning ? PREDICTIONS_COPY.RESEARCH.RUNNING : PREDICTIONS_COPY.RESEARCH.RUN}
                  </span>
                </Button>
              </form>
              <Button type="button" className="btn-secondary" onClick={() => window.print()}>
                <Download size={14} />
                <span>{PREDICTIONS_COPY.HEADER.EXPORT_AUDIT}</span>
              </Button>
            </div>
          }
        />
        <div className="research-guidance">
          <p>{PREDICTIONS_COPY.RESEARCH.GUIDANCE}</p>
          <p>{PREDICTIONS_COPY.RESEARCH.MARKET_DATA_NOTE}</p>
          {analysisMessage && (
            <p
              className={analysisFailed ? "research-message is-error" : "research-message"}
              role="status"
              aria-live="polite"
            >
              {analysisMessage}
            </p>
          )}
        </div>
        <PredictionsKpiGrid
          totalGenerated={initialData.totalGenerated}
          activeCount={initialData.activeCount}
          targetHitCount={initialData.targetHitCount}
          stopHitCount={initialData.stopHitCount}
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
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {viewMode === "cards" ? (
          <RecommendationCardGrid
            signals={filteredSignals}
            onInspect={(id) => navigate({ to: "/predictions/$id", params: { id } })}
            emptyTitle={PREDICTIONS_COPY.EMPTY.TITLE}
            emptyDescription={PREDICTIONS_COPY.EMPTY.DESCRIPTION}
          />
        ) : (
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
        )}
        <ResearchRunsPanel runs={initialData.researchRuns} />
      </div>
    </QuantShell>
  );
}
