/**
 * @file packages/ui/src/components/ChatHistoryDrawer.tsx
 * @description Slide-over drawer presenting historical AI Copilot conversation threads.
 * @author yuva.devlab@gmail.com
 */

import type { MouseEvent } from "react";
import { MessageSquare, Plus, Trash2, Clock } from "lucide-react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@yuva-devlab/ui";

export interface ChatSessionHistoryItem {
  readonly id: string;
  readonly title: string;
  readonly updatedAt: string;
  readonly messageCount?: number;
}

export interface ChatHistoryDrawerProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly sessions: readonly ChatSessionHistoryItem[];
  readonly activeSessionId?: string | undefined;
  readonly onSelectSession: (sessionId: string) => void;
  readonly onDeleteSession: (sessionId: string, e: MouseEvent) => void;
  readonly onNewChat: () => void;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

/**
 * Slide-over drawer listing saved AI Copilot conversational threads.
 */
export function ChatHistoryDrawer({
  open,
  onOpenChange,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}: ChatHistoryDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="chat-history-sheet">
        <SheetHeader className="history-sheet-header">
          <div className="history-header-top">
            <SheetTitle>Conversational History</SheetTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onNewChat();
                onOpenChange(false);
              }}
              className="history-new-chat-btn"
            >
              <Plus size={14} />
              <span>New Chat</span>
            </Button>
          </div>
          <SheetDescription>
            Review and resume past quantitative copilot threads and thesis debates.
          </SheetDescription>
        </SheetHeader>

        <div className="chat-history-scroll">
          {sessions.length === 0 ? (
            <div className="history-empty-state">
              <MessageSquare size={32} className="empty-icon" />
              <p>No conversation history yet.</p>
              <span>Ask a question to start your first quantitative deliberation thread.</span>
            </div>
          ) : (
            <div className="history-list">
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    className={`history-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      onSelectSession(session.id);
                      onOpenChange(false);
                    }}
                  >
                    <div className="item-main">
                      <div className="item-title-row">
                        <MessageSquare size={14} className="thread-icon" />
                        <strong className="item-title">{session.title}</strong>
                      </div>
                      <div className="item-meta">
                        <Clock size={11} />
                        <time>{formatRelativeTime(session.updatedAt)}</time>
                        {session.messageCount !== undefined && (
                          <span className="msg-count">{session.messageCount} msgs</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Delete session"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id, e);
                      }}
                      className="history-delete-btn"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
