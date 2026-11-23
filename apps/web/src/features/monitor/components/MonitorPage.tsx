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
import { AgentRole, AgentStance } from "@quant-ai/shared-types";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { AppRoute } from "@/constants/routes.constants";
import { UiSignalStatus } from "@/components/quantai/data";
import { chartSamples } from "@/components/quantai/chart-samples";
import { useRealtimeDeliberation } from "@/hooks/use-realtime-deliberation";
import { useRealtimeTicks } from "@/hooks/use-realtime-ticks";
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
  const { ticks } = useRealtimeTicks();

  const [timeframe, setTimeframe] = useState("1m");
  const [isTriggering, setIsTriggering] = useState(false);

  const liveTick = ticks[signal.symbol];
  const currentPrice = liveTick?.price ? `₹${liveTick.price.toLocaleString("en-IN")}` : signal.last;
  const currentChange = liveTick
    ? `${liveTick.percentChange >= 0 ? "+" : ""}${liveTick.percentChange.toFixed(2)}%`
    : signal.change;
  const currentStatus = (latestSignalUpdate?.status as Signal["status"]) ?? signal.status;
  const isActive = currentStatus === UiSignalStatus.ACTIVE;
  const copy = MONITOR_COPY;

  const liveMomentum = agentSpeeches[AgentRole.MOMENTUM_ANALYST];
  const liveSkeptic = agentSpeeches[AgentRole.RED_TEAM_SKEPTIC];
  const liveRisk = agentSpeeches[AgentRole.QUANT_RISK_OFFICER];
  const hasLiveUpdates = Boolean(liveMomentum || liveSkeptic || liveRisk);

  const handleTrigger = async () => {
    if (isTriggering) return;
    setIsTriggering(true);
    try {
      await triggerDeliberation({ predictionId: signal.id, ticker: signal.symbol });
    } finally {
      setTimeout(() => setIsTriggering(false), 2000);
    }
  };

  const agentsList = [
    {
      role: AgentRole.MOMENTUM_ANALYST,
      score: liveMomentum ? liveMomentum.confidence : (signal.agents?.quant?.score ?? 88),
      scoreClass: "text-gain",
      verdict: liveMomentum
        ? liveMomentum.reasoning
        : (signal.agents?.quant?.verdict ??
          "Bullish continuation breakout validated across volume expansion."),
    },
    {
      role: AgentRole.RED_TEAM_SKEPTIC,
      score: liveSkeptic ? liveSkeptic.confidence : (signal.agents?.optionsFlow?.score ?? 78),
      scoreClass: liveSkeptic?.stance === AgentStance.BEARISH ? "text-loss" : "text-brand",
      verdict: liveSkeptic
        ? liveSkeptic.reasoning
        : (signal.agents?.optionsFlow?.verdict ??
          "Auditing overhead resistance and liquidity exhaustion sweeps."),
    },
    {
      role: AgentRole.QUANT_RISK_OFFICER,
      score: liveRisk ? liveRisk.confidence : (signal.agents?.riskGuardian?.score ?? 92),
      scoreClass: "text-brand",
      verdict: liveRisk
        ? liveRisk.reasoning
        : (signal.agents?.riskGuardian?.verdict ??
          "Trade expectancy verified: Kelly-optimal capital allocation approved."),
    },
  ];

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

        <MonitorConeSection
          signal={signal}
          isActive={isActive}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          samples={chartSamples}
          trajectory={signal.trajectoryPoints?.map((t, idx, arr) => ({
            time: t.time,
            expected: t.expectedPath,
            actual: idx === arr.length - 1 && liveTick?.price ? liveTick.price : t.actualPrice,
            upper: t.upperCone,
            lower: t.lowerCone,
          }))}
        />

        <MonitorAgentsSection
          agents={agentsList}
          isConnected={isConnected}
          isTriggering={isTriggering}
          hasLiveUpdates={hasLiveUpdates}
          canTrigger={true}
          onTrigger={handleTrigger}
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
