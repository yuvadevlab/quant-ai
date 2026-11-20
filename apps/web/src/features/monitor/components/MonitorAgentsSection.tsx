/**
 * @file src/features/monitor/components/MonitorAgentsSection.tsx
 * @description Dynamic multi-agent deliberation consensus grid with live WebSocket token streaming.
 * @author yuva.devlab@gmail.com
 */

import { useState } from "react";
import { AgentCard, Button } from "@quant-ai/ui";
import { AgentRole, AgentStance } from "@quant-ai/shared-types";
import { Bot, Radio, Sparkles } from "lucide-react";
import type { Signal } from "@/components/quantai/data";
import type { LiveAgentSpeech } from "@/hooks/use-realtime-deliberation";
import { MONITOR_COPY } from "@/lib/ui-copy/monitor.copy";
import { triggerDeliberation } from "../api/triggerDeliberation";

export interface MonitorAgentsSectionProps {
  readonly predictionId?: string;
  readonly ticker?: string;
  readonly agents?: Signal["agents"];
  readonly liveSpeeches?: Readonly<Record<string, LiveAgentSpeech>>;
  readonly isConnected?: boolean;
}

export function MonitorAgentsSection({
  predictionId,
  ticker,
  agents,
  liveSpeeches = {},
  isConnected = false,
}: MonitorAgentsSectionProps) {
  const [isTriggering, setIsTriggering] = useState(false);
  const copy = MONITOR_COPY;

  // Check for live speech arrivals from WebSocket stream
  const liveMomentum = liveSpeeches[AgentRole.MOMENTUM_ANALYST];
  const liveSkeptic = liveSpeeches[AgentRole.RED_TEAM_SKEPTIC];
  const liveRisk = liveSpeeches[AgentRole.QUANT_RISK_OFFICER];

  const hasLiveUpdates = Boolean(liveMomentum || liveSkeptic || liveRisk);

  const handleTrigger = async () => {
    if (!predictionId || !ticker || isTriggering) {
      return;
    }
    setIsTriggering(true);
    try {
      await triggerDeliberation({ predictionId, ticker });
    } finally {
      setTimeout(() => setIsTriggering(false), 2000);
    }
  };

  return (
    <section className="desk-panel deliberation-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Bot size={18} className="panel-icon" />
          <div>
            <h2 className="panel-title">{copy.DELIBERATION.TITLE}</h2>
            <p className="panel-subtext">{copy.DELIBERATION.SUBTITLE}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <span className="panel-status-pill text-gain flex items-center gap-1">
              <Radio size={12} className="animate-pulse" />
              <span>
                {hasLiveUpdates ? copy.HEADER.LIVE_STREAM_ACTIVE : copy.HEADER.STREAM_CONNECTED}
              </span>
            </span>
          )}
          {predictionId && ticker && (
            <Button
              type="button"
              onClick={handleTrigger}
              disabled={isTriggering}
              className="btn-secondary flex items-center gap-1.5 text-xs py-1 px-2.5"
              title={copy.HEADER.TRIGGER_TOOLTIP}
            >
              <Sparkles size={12} className={isTriggering ? "animate-spin" : ""} />
              <span>
                {isTriggering ? copy.HEADER.DELIBERATING : copy.HEADER.TRIGGER_DELIBERATION}
              </span>
            </Button>
          )}
          <span className="panel-status-pill">{copy.HEADER.SPECIALISTS_COUNT}</span>
        </div>
      </div>

      <div className="agents-grid">
        <AgentCard
          role={AgentRole.MOMENTUM_ANALYST}
          score={liveMomentum ? liveMomentum.confidence : (agents?.quant?.score ?? 88)}
          scoreClass="text-gain"
          verdict={
            liveMomentum
              ? liveMomentum.reasoning
              : (agents?.quant?.verdict ??
                "Bullish continuation breakout validated across volume expansion.")
          }
        />

        <AgentCard
          role={AgentRole.RED_TEAM_SKEPTIC}
          score={liveSkeptic ? liveSkeptic.confidence : (agents?.optionsFlow?.score ?? 78)}
          scoreClass={liveSkeptic?.stance === AgentStance.BEARISH ? "text-loss" : "text-brand"}
          verdict={
            liveSkeptic
              ? liveSkeptic.reasoning
              : (agents?.optionsFlow?.verdict ??
                "Auditing overhead resistance and liquidity exhaustion sweeps.")
          }
        />

        <AgentCard
          role={AgentRole.QUANT_RISK_OFFICER}
          score={liveRisk ? liveRisk.confidence : (agents?.riskGuardian?.score ?? 92)}
          scoreClass="text-brand"
          verdict={
            liveRisk
              ? liveRisk.reasoning
              : (agents?.riskGuardian?.verdict ??
                "Trade expectancy verified: Kelly-optimal capital allocation approved.")
          }
        />
      </div>
    </section>
  );
}
