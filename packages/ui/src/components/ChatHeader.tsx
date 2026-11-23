/**
 * @file packages/ui/src/components/ChatHeader.tsx
 * @description Header banner for the AI Financial Copilot desk.
 * @author yuva.devlab@gmail.com
 */

import { Bot, ChevronRight, History, Plus } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

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
  /** Optional handler to open conversational history */
  readonly onToggleHistory?: () => void;
  /** Optional total count of past conversations */
  readonly historyCount?: number;
  /** Optional handler to initiate a new clean chat session */
  readonly onNewChat?: () => void;
}

/**
 * Institutional header banner for the AI Financial Copilot conversation desk.
 *
 * @param props - ChatHeaderProps containing titles, badge, and navigation actions.
 * @returns Rendered JSX ChatHeader element.
 */
export function ChatHeader({
  title = "AI FINANCIAL COPILOT",
  subtitle = "Interactive market intelligence, multi-agent thesis cross-examination, and real-time setup generation.",
  breadcrumbLabel = "INTELLIGENCE",
  badgeText = "MULTI-AGENT CONSENSUS MODE",
  onToggleHistory,
  historyCount,
  onNewChat,
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
        {onNewChat && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNewChat}
            className="chat-action-btn"
          >
            <Plus size={14} />
            <span>New Chat</span>
          </Button>
        )}
        {onToggleHistory && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleHistory}
            className="chat-action-btn"
          >
            <History size={14} />
            <span>History</span>
            {historyCount !== undefined && historyCount > 0 && (
              <span className="chat-history-count-badge">{historyCount}</span>
            )}
          </Button>
        )}
        <span className="paper-trading-tag">
          <Bot size={15} />
          <span>{badgeText}</span>
        </span>
      </div>
    </div>
  );
}
