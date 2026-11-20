/**
 * @file packages/ui/src/components/MonitorAgentsSection.tsx
 * @description Dynamic multi-agent deliberation consensus grid with specialist cards.
 * @author yuva.devlab@gmail.com
 */

import { Bot, Radio, Sparkles } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@yuva-devlab/ui";
import { AgentCard } from "./AgentCard";
import type { DeliberationAgentItem } from "../types";

/**
 * Props for the MonitorAgentsSection presentation component.
 */
export interface MonitorAgentsSectionProps {
  /** Array of multi-agent specialist verdicts */
  readonly agents: readonly DeliberationAgentItem[];
  /** Whether the WebSocket deliberation stream is connected */
  readonly isConnected?: boolean;
  /** Whether a deliberation cycle is actively in-flight */
  readonly isTriggering?: boolean;
  /** Whether real-time speech arrivals have occurred */
  readonly hasLiveUpdates?: boolean;
  /** Whether user can manually re-trigger deliberation */
  readonly canTrigger?: boolean;
  /** Trigger deliberation action callback */
  readonly onTrigger?: () => void;
  /** Panel title */
  readonly title?: string;
  /** Panel subtitle */
  readonly subtitle?: string;
  /** Specialists badge text */
  readonly specialistsLabel?: string;
}

/**
 * Multi-agent consensus panel rendering specialist agent convictions, skepticism, and risk verdicts.
 *
 * @param props - MonitorAgentsSectionProps containing agents and live stream state.
 * @returns Rendered JSX MonitorAgentsSection element.
 */
export function MonitorAgentsSection({
  agents,
  isConnected = false,
  isTriggering = false,
  hasLiveUpdates = false,
  canTrigger = false,
  onTrigger,
  title = "SPECIALIZED AGENT DELIBERATION",
  subtitle = "Independent AI agents debating directional bias, risk limits, and structural options flow.",
  specialistsLabel = "3 SPECIALISTS CONSENSUS",
}: MonitorAgentsSectionProps) {
  return (
    <Card className="desk-panel deliberation-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <Bot size={18} className="panel-icon" />
          <div>
            <CardTitle className="panel-title">{title}</CardTitle>
            <CardDescription className="panel-subtext">{subtitle}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <Badge className="panel-status-pill text-gain flex items-center gap-1">
              <Radio size={12} className="animate-pulse" />
              <span>{hasLiveUpdates ? "LIVE STREAM ACTIVE" : "STREAM CONNECTED"}</span>
            </Badge>
          )}
          {canTrigger && onTrigger && (
            <Button
              type="button"
              onClick={onTrigger}
              disabled={isTriggering}
              className="btn-secondary flex items-center gap-1.5 text-xs py-1 px-2.5"
              title="Force real-time multi-agent re-deliberation on current tick data"
            >
              <Sparkles size={12} className={isTriggering ? "animate-spin" : ""} />
              <span>{isTriggering ? "DELIBERATING..." : "TRIGGER DELIBERATION"}</span>
            </Button>
          )}
          <Badge className="panel-status-pill">{specialistsLabel}</Badge>
        </div>
      </CardHeader>

      <CardContent className="agents-grid">
        {agents.map((agent) => (
          <AgentCard
            key={agent.role}
            role={agent.role}
            score={agent.score}
            scoreClass={agent.scoreClass ?? "text-brand"}
            verdict={agent.verdict}
          />
        ))}
      </CardContent>
    </Card>
  );
}
