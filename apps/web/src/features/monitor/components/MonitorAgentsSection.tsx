/**
 * @file src/features/monitor/components/MonitorAgentsSection.tsx
 * @description Multi-agent deliberation consensus grid for signal evaluation.
 */

import { AgentCard } from "@quant-ai/ui";
import { Bot } from "lucide-react";
import type { Signal } from "@/components/quantai/data";

export interface MonitorAgentsSectionProps {
  readonly agents: Signal["agents"];
}

export function MonitorAgentsSection({ agents }: MonitorAgentsSectionProps) {
  return (
    <section className="desk-panel deliberation-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Bot size={18} className="panel-icon" />
          <div>
            <h2 className="panel-title">Multi-Agent Deliberation Breakdown</h2>
            <p className="panel-subtext">
              Independent agent consensus. Each specialized model evaluates market dynamics
              separately.
            </p>
          </div>
        </div>
        <span className="panel-status-pill">4 Specialized Agents</span>
      </div>

      <div className="agents-grid">
        <AgentCard
          role="TECHNICAL ANALYST"
          score={agents.technical.score}
          scoreClass="text-gain"
          verdict={agents.technical.verdict}
        />

        <AgentCard
          role="QUANT MOMENTUM"
          score={agents.quant.score}
          scoreClass="text-gain"
          verdict={agents.quant.verdict}
        />

        <AgentCard
          role="OPTIONS FLOW"
          score={agents.optionsFlow.score}
          scoreClass="text-gain"
          verdict={agents.optionsFlow.verdict}
        />

        <AgentCard
          role="RISK GUARDIAN"
          score={agents.riskGuardian.score}
          scoreClass="text-brand"
          verdict={agents.riskGuardian.verdict}
        />
      </div>
    </section>
  );
}
