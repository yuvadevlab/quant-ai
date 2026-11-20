/**
 * @file src/features/monitor/components/MonitorPage.tsx
 * @description Master Predictive Trajectory Monitor page wrapper with live WebSocket deliberation and pricing streams.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { InvalidationCard, MonitorKpiGrid, SignalHeader } from "@quant-ai/ui";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { AppRoute } from "@/constants/routes.constants";
import { UiSignalStatus } from "@/components/quantai/data";
import { useRealtimeDeliberation } from "@/hooks/use-realtime-deliberation";
import { useRealtimeTicks } from "@/hooks/use-realtime-ticks";
import { MONITOR_COPY } from "@/lib/ui-copy/monitor.copy";
import { MonitorConeSection } from "./MonitorConeSection";
import { MonitorAgentsSection } from "./MonitorAgentsSection";
import type { MonitorData } from "../api/getMonitorData";
import type { Signal } from "@/components/quantai/data";

export interface MonitorPageProps {
  readonly initialData: MonitorData;
}

export function MonitorPage({ initialData }: MonitorPageProps) {
  const { signal } = initialData;
  const { agentSpeeches, latestSignalUpdate, isConnected } = useRealtimeDeliberation(signal.id);
  const { ticks } = useRealtimeTicks();

  const liveTick = ticks[signal.symbol];
  const currentPrice = liveTick?.price ? `₹${liveTick.price.toLocaleString("en-IN")}` : signal.last;
  const currentChange = liveTick
    ? `${liveTick.percentChange >= 0 ? "+" : ""}${liveTick.percentChange.toFixed(2)}%`
    : signal.change;
  const currentStatus = (latestSignalUpdate?.status as Signal["status"]) ?? signal.status;
  const isActive = currentStatus === UiSignalStatus.ACTIVE;
  const copy = MONITOR_COPY;

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

        <MonitorKpiGrid
          entry={signal.entry}
          entryPrice={signal.entryPrice}
          last={currentPrice}
          change={currentChange}
          direction={signal.direction}
          target1={signal.target1}
          target2={signal.target2}
          stop={signal.stop}
          confidence={signal.confidence}
          riskReward={signal.riskReward}
        />

        <MonitorConeSection signal={signal} isActive={isActive} />

        <MonitorAgentsSection
          predictionId={signal.id}
          ticker={signal.symbol}
          agents={signal.agents}
          liveSpeeches={agentSpeeches}
          isConnected={isConnected}
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
