/**
 * @file src/features/monitor/components/MonitorPage.tsx
 * @description Master Predictive Trajectory Monitor page wrapper with live WebSocket deliberation and pricing streams.
 * Composes workstation shell, KPI summary, and pure @quant-ai/ui presentation blocks with hook logic.
 * @author yuva.devlab@gmail.com
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  InvalidationCard,
  MonitorKpiGrid,
  SignalHeader,
  MonitorConeSection,
  MonitorAgentsSection,
} from "@quant-ai/ui";
import { AgentStance } from "@quant-ai/shared-types";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { AppRoute } from "@/constants/routes.constants";
import { UiSignalStatus } from "@/components/quantai/data";
import { useRealtimeDeliberation } from "@/hooks/use-realtime-deliberation";
import { MONITOR_COPY } from "@/lib/ui-copy/monitor.copy";
import { triggerDeliberation } from "../api/triggerDeliberation";
import type { MonitorData } from "../api/getMonitorData";
import type { Signal } from "@/components/quantai/data";

export interface MonitorPageProps {
  readonly initialData: MonitorData;
}

export function MonitorPage({ initialData }: MonitorPageProps) {
  const { signal } = initialData;
  const { agentSpeeches, latestSignalUpdate, isConnected } = useRealtimeDeliberation(signal.id);
  const [isTriggering, setIsTriggering] = useState(false);

  const currentStatus = (latestSignalUpdate?.status as Signal["status"]) ?? signal.status;
  const isActive = currentStatus === UiSignalStatus.ACTIVE;
  const copy = MONITOR_COPY;

  const agentsList = Object.values(agentSpeeches).map((speech) => ({
    role: speech.agentName,
    score: speech.confidence,
    scoreClass: speech.stance === AgentStance.BEARISH ? "text-loss" : "text-brand",
    verdict: speech.reasoning,
  }));
  const hasLiveUpdates = agentsList.length > 0;

  const handleTrigger = async () => {
    if (isTriggering) return;
    setIsTriggering(true);
    try {
      await triggerDeliberation({ predictionId: signal.id, ticker: signal.symbol });
    } finally {
      setTimeout(() => setIsTriggering(false), 2000);
    }
  };

  return (
    <QuantShell>
      <div className="desk-container">
        <SignalHeader
          breadcrumb={
            <>
              <Link to={AppRoute.PREDICTIONS} className="breadcrumb-back-link">
                <ArrowLeft size={14} />
                <span>{copy.HEADER.BREADCRUMB_BACK}</span>
              </Link>
              <ChevronRight size={14} />
              <span className="current">{signal.id}</span>
            </>
          }
          symbol={signal.symbol}
          instrument={signal.instrument}
          direction={signal.direction}
          horizon={signal.horizon}
          companyName={signal.companyName}
          status={currentStatus}
          isActive={isActive}
        />

        <p className="panel-subtext">{signal.dataProvenance ?? copy.DATA_PROVENANCE_UNAVAILABLE}</p>

        <MonitorKpiGrid
          entry={signal.entry}
          entryPrice={signal.entryPrice}
          last={signal.last}
          target1={signal.target1}
          {...(signal.target2 ? { target2: signal.target2 } : {})}
          stop={signal.stop}
          confidence={signal.confidence}
          riskReward={signal.riskReward}
        />

        <MonitorConeSection signal={signal} />

        <MonitorAgentsSection
          agents={agentsList}
          isConnected={isConnected}
          isTriggering={isTriggering}
          hasLiveUpdates={hasLiveUpdates}
          canTrigger={true}
          onTrigger={handleTrigger}
          title={copy.DELIBERATION.TITLE}
          subtitle={copy.DELIBERATION.SUBTITLE}
          specialistsLabel={
            agentsList.length > 0
              ? `${agentsList.length} ${copy.DELIBERATION.RESPONSES_RECORDED}`
              : copy.DELIBERATION.NO_RESPONSES
          }
          emptyMessage={copy.DELIBERATION.EMPTY}
        />

        <InvalidationCard
          title={copy.INVALIDATION.TITLE}
          description={
            <>
              {copy.INVALIDATION.DESCRIPTION_PREFIX} <strong>{signal.stop}</strong>{" "}
              {copy.INVALIDATION.DESCRIPTION_SUFFIX}
            </>
          }
          action={
            <Link to={AppRoute.CHAT} className="btn-secondary">
              <Sparkles size={14} />
              <span>
                {copy.INVALIDATION.ACTION_PREFIX} {signal.symbol}
              </span>
            </Link>
          }
        />
      </div>
    </QuantShell>
  );
}
