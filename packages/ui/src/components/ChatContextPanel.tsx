/**
 * @file packages/ui/src/components/ChatContextPanel.tsx
 * @description Right-hand live market context rail for AI Strategist (aligned with FinAI ContextPanel).
 */

import { Activity, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { Button, Card } from "@yuva-devlab/ui";
import type { IndexTickItem } from "../types";

export interface ChatContextPrompt {
  readonly label: string;
  readonly prompt: string;
}

export interface ChatContextPanelProps {
  /** Live benchmark ticks for the market snapshot */
  readonly ticks: readonly IndexTickItem[];
  /** Current market regime summary */
  readonly regimeLabel?: string;
  /** Quick research prompts */
  readonly quickPrompts: readonly ChatContextPrompt[];
  /** Callback when user clicks a quick prompt */
  readonly onSelectPrompt: (prompt: string) => void;
  /** Whether a response is currently generating */
  readonly disabled?: boolean;
}

/**
 * Displays live NSE/BSE benchmark quotes and quick prompts alongside the AI Strategist thread.
 */
export function ChatContextPanel({
  ticks,
  regimeLabel = "Session Snapshot",
  quickPrompts,
  onSelectPrompt,
  disabled = false,
}: ChatContextPanelProps) {
  return (
    <aside className="chat-context-rail" aria-label="Live Market Context">
      <Card className="context-panel-card">
        <div className="context-panel-header">
          <Activity size={14} className="context-panel-icon" aria-hidden="true" />
          <h2 className="context-panel-title">Live Market Context</h2>
        </div>
        <p className="context-panel-subtitle">{regimeLabel}</p>

        <div className="context-ticks-list">
          {ticks.slice(0, 4).map((tick) => {
            const isNeutral = Boolean(tick.isVix);
            const toneClass = isNeutral ? "is-neutral" : tick.positive ? "is-up" : "is-down";
            return (
              <div key={tick.name} className="context-tick-row">
                <div className="context-tick-name-col">
                  <span className="context-tick-symbol">{tick.name}</span>
                  <span className="context-tick-exchange">{tick.exchange}</span>
                </div>
                <div className="context-tick-val-col">
                  <span className="context-tick-price mono">{tick.price}</span>
                  {tick.price !== "—" && (
                    <span className={`context-tick-change ${toneClass}`}>
                      {tick.positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {tick.change}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="context-panel-card">
        <div className="context-panel-header">
          <Sparkles size={14} className="context-panel-icon" aria-hidden="true" />
          <h2 className="context-panel-title">Research Starters</h2>
        </div>
        <div className="context-starters-list">
          {quickPrompts.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onSelectPrompt(item.prompt)}
              className="context-starter-btn"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </Card>
    </aside>
  );
}
