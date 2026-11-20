/**
 * @file packages/ui/src/components/ChatHeader.tsx
 * @description Header banner for the AI Financial Copilot desk.
 * @author yuva.devlab@gmail.com
 */

import { Bot, ChevronRight } from "lucide-react";
import { Badge } from "@yuva-devlab/ui";

/**
 * Props for the ChatHeader presentation component.
 */
export interface ChatHeaderProps {
  /** Main title for chat desk */
  readonly title?: string;
  /** Subtitle narrative */
  readonly subtitle?: string;
  /** Breadcrumb section label */
  readonly breadcrumbLabel?: string;
  /** Consensus mode badge text */
  readonly badgeText?: string;
}

/**
 * Institutional header banner for the AI Financial Copilot conversation desk.
 *
 * @param props - ChatHeaderProps containing titles and badge.
 * @returns Rendered JSX ChatHeader element.
 */
export function ChatHeader({
  title = "AI FINANCIAL COPILOT",
  subtitle = "Interactive market intelligence, multi-agent thesis cross-examination, and real-time setup generation.",
  breadcrumbLabel = "INTELLIGENCE",
  badgeText = "MULTI-AGENT CONSENSUS MODE",
}: ChatHeaderProps) {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{breadcrumbLabel}</span>
          <ChevronRight size={14} />
          <span className="current">{title.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{title}</h1>
        <p className="desk-subtitle">{subtitle}</p>
      </div>
      <div className="desk-actions">
        <Badge className="paper-trading-tag">
          <Bot size={15} />
          <span>{badgeText}</span>
        </Badge>
      </div>
    </div>
  );
}
