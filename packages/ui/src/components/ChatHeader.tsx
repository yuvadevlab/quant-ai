/**
 * @file packages/ui/src/components/ChatHeader.tsx
 * @description Header banner for the AI Financial Copilot desk.
 */

import { History, MessageSquarePlus, Sparkles } from "lucide-react";
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
  /** Whether active messages exist (controls New Chat disabled state) */
  readonly hasMessages?: boolean;
}

/**
 * Compact header for the AI Strategist conversation desk (aligned with FinAI AdvisorHeader).
 */
export function ChatHeader({
  title = "AI Strategist",
  badgeText = "MULTI-AGENT CONSENSUS",
  onToggleHistory,
  historyCount,
  onNewChat,
  hasMessages = true,
}: ChatHeaderProps) {
  return (
    <div className="advisor-header">
      <div className="advisor-header-brand">
        <div className="advisor-header-icon-box">
          <Sparkles size={18} aria-hidden="true" />
        </div>
        <div className="advisor-header-titles">
          <h1 className="advisor-header-title">{title}</h1>
          <p className="advisor-header-badge">{badgeText}</p>
        </div>
      </div>
      <div className="advisor-header-actions">
        {onToggleHistory && (
          <Button
            type="button"
            variant="ghost"
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
        {onNewChat && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNewChat}
            disabled={!hasMessages}
            className="chat-action-btn"
          >
            <MessageSquarePlus size={14} />
            <span>New Chat</span>
          </Button>
        )}
      </div>
    </div>
  );
}
