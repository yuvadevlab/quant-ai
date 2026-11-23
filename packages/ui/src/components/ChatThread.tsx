/**
 * @file packages/ui/src/components/ChatThread.tsx
 * @description Conversation thread displaying messages, trader queries, and embedded signal cards.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@yuva-devlab/ui";
import type { ChatThreadMessage, TableSignalItem } from "../types";

/**
 * Props for the ChatThread presentation component.
 */
export interface ChatThreadProps {
  /** Array of conversation messages */
  readonly messages: readonly ChatThreadMessage[];
  /** Optional featured signal embedded in assistant recommendations */
  readonly featuredSignal?: TableSignalItem | undefined;
  /** Optional trajectory link renderer */
  readonly renderTrajectoryLink?: (signal: TableSignalItem) => ReactNode;
  /** Optional view trajectory callback */
  readonly onViewTrajectory?: (signalId: string) => void;
  /** Optional custom landing state when messages list is empty */
  readonly emptyState?: ReactNode;
  /** Assistant name label */
  readonly assistantName?: string;
  /** Trader name label */
  readonly userName?: string;
}

/**
 * Conversation scroll area displaying user prompts, AI deliberated thoughts, and setup widgets.
 *
 * @param props - ChatThreadProps containing messages and embedded signal.
 * @returns Rendered JSX ChatThread element.
 */
export function ChatThread({
  messages,
  featuredSignal,
  renderTrajectoryLink,
  onViewTrajectory,
  emptyState,
  assistantName = "QUANT-AI COPILOT",
  userName = "TRADER",
}: ChatThreadProps) {
  if (messages.length === 0 && emptyState) {
    return <div className="chat-messages-scroll chat-empty-scroll">{emptyState}</div>;
  }

  return (
    <div className="chat-messages-scroll">
      {messages.map((msg) => {
        const isAssistant = msg.type === "assistant";

        return (
          <div
            key={msg.id}
            className={`chat-msg-row ${isAssistant ? "msg-assistant" : "msg-user"}`}
          >
            <div className="msg-avatar-col">
              {isAssistant ? (
                <div className="assistant-avatar">
                  <Sparkles size={15} />
                </div>
              ) : (
                <div className="user-avatar">Y</div>
              )}
            </div>

            <div className="msg-body-col">
              <div className="msg-meta-header">
                <strong>{isAssistant ? assistantName : userName}</strong>
                <time>{msg.time}</time>
              </div>

              <div className="msg-text-bubble">
                <p>{msg.text}</p>

                {msg.hasSignal &&
                  (msg.signalData || featuredSignal) &&
                  (() => {
                    const activeSignal = msg.signalData ?? featuredSignal!;
                    const isBuy = activeSignal.direction === "BUY";

                    return (
                      <Card className="chat-signal-embed">
                        <div className="embed-header">
                          <span className="embed-badge">EMBEDDED SETUP</span>
                          <span className="embed-id">{activeSignal.id}</span>
                        </div>

                        <div className="embed-content">
                          <div className="embed-main">
                            <span className="embed-symbol">{activeSignal.symbol}</span>
                            {activeSignal.companyName && (
                              <span className="embed-company">{activeSignal.companyName}</span>
                            )}
                          </div>
                          <div className="embed-details">
                            <span className={`embed-dir ${isBuy ? "badge-buy" : "badge-sell"}`}>
                              {activeSignal.direction}
                            </span>
                            <span className="embed-entry">Entry: {activeSignal.entry}</span>
                            <span className="embed-target">Target 1: {activeSignal.target1}</span>
                            {activeSignal.stop && (
                              <span className="embed-target">Stop: {activeSignal.stop}</span>
                            )}
                          </div>
                        </div>

                        {renderTrajectoryLink ? (
                          renderTrajectoryLink(activeSignal)
                        ) : (
                          <button
                            type="button"
                            onClick={() => onViewTrajectory?.(activeSignal.id)}
                            className="embed-action-btn"
                          >
                            <span>VIEW TRAJECTORY CONE</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </Card>
                    );
                  })()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
