/**
 * @file packages/ui/src/components/AgentCard.tsx
 * @description Specialized multi-agent deliberation score and verdict card.
 */

import { cn } from "@yuva-devlab/ui";
import type { ReactNode } from "react";

/**
 * Props for the AgentCard component.
 */
export interface AgentCardProps {
  /** Agent role or specialization badge (e.g. 'TECHNICAL ANALYST', 'QUANT MOMENTUM') */
  readonly role: string;
  /** Numerical conviction score or percentage */
  readonly score: string | number;
  /** Qualitative reasoning or hypothesis verdict text */
  readonly verdict: ReactNode;
  /** Score tone class (e.g. 'text-gain', 'text-brand', 'text-loss') */
  readonly scoreClass?: string;
  /** Custom container class names */
  readonly className?: string;
}

/**
 * Renders an individual specialized AI reasoning agent's score and market verdict.
 *
 * @param props - Role title, conviction score, and verdict commentary.
 * @returns Rendered JSX AgentCard element.
 */
export function AgentCard({
  role,
  score,
  verdict,
  scoreClass = "text-gain",
  className = "",
}: AgentCardProps) {
  const displayScore = typeof score === "number" ? `${score}%` : score;

  return (
    <div className={cn("agent-card", className)}>
      <div className="agent-card-header">
        <span className="agent-badge">{role}</span>
        <span className={cn("agent-score", scoreClass)}>{displayScore}</span>
      </div>
      <p className="agent-verdict">{verdict}</p>
    </div>
  );
}
