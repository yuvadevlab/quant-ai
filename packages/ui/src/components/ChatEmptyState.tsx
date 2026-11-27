/**
 * @file packages/ui/src/components/ChatEmptyState.tsx
 * @description Clean landing state for empty AI Copilot conversations with starter prompt triggers.
 */

import { ArrowRight, Sparkles, TrendingUp, ShieldAlert, LineChart, Cpu } from "lucide-react";
import { Card } from "@yuva-devlab/ui";

export interface ChatQuickPrompt {
  readonly iconName: "trending" | "shield" | "chart" | "cpu";
  readonly title: string;
  readonly prompt: string;
}

export interface ChatEmptyStateProps {
  readonly onSelectPrompt: (prompt: string) => void;
  readonly title?: string;
  readonly subtitle?: string;
}

const DEFAULT_STARTERS: readonly ChatQuickPrompt[] = [
  {
    iconName: "trending",
    title: "Breakout Momentum",
    prompt: "Scan benchmark expiry momentum and gamma levels across NIFTY 50 and BANK NIFTY.",
  },
  {
    iconName: "shield",
    title: "Risk Invalidation",
    prompt: "Explain multi-agent risk guardian consensus and structural stop-loss levels.",
  },
  {
    iconName: "chart",
    title: "Conviction Audit",
    prompt: "Audit active prediction conviction ratings and empirical Kelly criterion sizing.",
  },
  {
    iconName: "cpu",
    title: "Institutional Flows",
    prompt: "Analyze FII and DII institutional flow divergences with sectoral rotation.",
  },
];

function renderStarterIcon(type: ChatQuickPrompt["iconName"]) {
  switch (type) {
    case "trending":
      return <TrendingUp size={16} />;
    case "shield":
      return <ShieldAlert size={16} />;
    case "chart":
      return <LineChart size={16} />;
    case "cpu":
      return <Cpu size={16} />;
  }
}

/**
 * Landing state presentation block for fresh/empty AI Copilot sessions.
 */
export function ChatEmptyState({
  onSelectPrompt,
  title = "AI Strategist",
  subtitle = "Interactive quantitative market intelligence, multi-agent thesis cross-examination, and real-time trade evaluation.",
}: ChatEmptyStateProps) {
  return (
    <div className="chat-empty-state">
      <div className="chat-empty-hero">
        <div className="chat-empty-icon-wrap">
          <Sparkles size={28} />
        </div>
        <h2 className="chat-empty-title">{title}</h2>
        <p className="chat-empty-subtitle">{subtitle}</p>
      </div>

      <div className="chat-empty-grid">
        {DEFAULT_STARTERS.map((item) => (
          <Card
            key={item.title}
            className="chat-starter-card"
            onClick={() => onSelectPrompt(item.prompt)}
          >
            <div className="starter-header">
              <span className="starter-icon">{renderStarterIcon(item.iconName)}</span>
              <strong className="starter-title">{item.title}</strong>
            </div>
            <p className="starter-prompt">{item.prompt}</p>
            <div className="starter-action">
              <span>Ask Copilot</span>
              <ArrowRight size={13} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
