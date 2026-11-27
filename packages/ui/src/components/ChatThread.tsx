/**
 * @file packages/ui/src/components/ChatThread.tsx
 * @description Conversation thread displaying user bubbles, assistant turns, loading state,
 * embedded signal cards, and interactive follow-up suggestion chips.
 */

import type { ReactNode, RefObject } from "react";
import { ArrowRight, Sparkles, User } from "lucide-react";
import { Button, Card, Suggestion, SuggestionList } from "@yuva-devlab/ui";
import type { ChatThreadMessage, TableSignalItem } from "../types";
import { ChatExecutionConsole } from "./ChatExecutionConsole";
import { ChatMarkdown } from "./ChatMarkdown";

const FOLLOW_UP_SECTION_REGEX = /(?:^|\n)#{2,4}\s*Follow-up Suggestions\s*:?\s*\n([\s\S]*)$/i;

function parseFollowUps(text: string): string[] {
  const match = text.match(FOLLOW_UP_SECTION_REGEX);
  if (!match?.[1]) return [];
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•\d.)]+\s*/, "").trim())
    .filter((line) => line.length > 8 && line.endsWith("?"))
    .slice(0, 3);
}

/**
 * Props for the ChatThread presentation component.
 */
export interface ChatThreadProps {
  /** Array of conversation messages */
  readonly messages: readonly ChatThreadMessage[];
  /** Whether an assistant response is currently generating */
  readonly isSubmitting?: boolean;
  /** Callback fired when a follow-up suggestion chip is clicked */
  readonly onSelectFollowUp?: (question: string) => void;
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
  /** Label above follow-up chips */
  readonly followUpsLabel?: string;
  /** Label shown while generating */
  readonly thinkingLabel?: string;
  /** Optional custom timeline/execution renderer per assistant message */
  readonly renderTimeline?: (msg: ChatThreadMessage) => ReactNode;
  /** Scroll container ref for ResizeObserver auto-scroll */
  readonly scrollContainerRef?: RefObject<HTMLDivElement | null>;
  /** Inner content wrapper ref for ResizeObserver auto-scroll */
  readonly scrollContentRef?: RefObject<HTMLDivElement | null>;
  /** Scroll handler attached to the inner scroll container */
  readonly onScroll?: () => void;
}

/**
 * Conversation scroll area displaying user prompts, AI Strategist turns, and setup widgets.
 */
export function ChatThread({
  messages,
  isSubmitting = false,
  onSelectFollowUp,
  featuredSignal,
  renderTrajectoryLink,
  onViewTrajectory,
  emptyState,
  assistantName = "QUANTAI STRATEGIST",
  userName = "TRADER",
  followUpsLabel = "Suggested follow-ups",
  thinkingLabel = "Synthesizing market telemetry...",
  renderTimeline,
  scrollContainerRef,
  scrollContentRef,
  onScroll,
}: ChatThreadProps) {
  if (messages.length === 0 && !isSubmitting && emptyState) {
    return <div className="chat-messages-scroll chat-empty-scroll">{emptyState}</div>;
  }

  return (
    <div className="chat-messages-scroll" ref={scrollContainerRef} onScroll={onScroll}>
      <div ref={scrollContentRef}>
        {messages.map((msg, idx) => {
          const isAssistant = msg.type === "assistant";
          const isLastMessage = idx === messages.length - 1;
          const followUps =
            isAssistant && isLastMessage && !isSubmitting
              ? msg.followUps && msg.followUps.length > 0
                ? msg.followUps
                : parseFollowUps(msg.text)
              : [];

          return (
            <div key={msg.id} className="chat-turn">
              <div className={`chat-msg-row ${isAssistant ? "msg-assistant" : "msg-user"}`}>
                <div className="msg-avatar-col">
                  {isAssistant ? (
                    <div className="assistant-avatar">
                      <Sparkles size={15} />
                    </div>
                  ) : (
                    <div className="user-avatar">
                      <User size={15} />
                    </div>
                  )}
                </div>

                <div className="msg-body-col">
                  <div className="msg-meta-header">
                    <strong>{isAssistant ? assistantName : userName}</strong>
                    {isAssistant && msg.agentRole && (
                      <span className="msg-agent-pill">{msg.agentRole}</span>
                    )}
                    <time>{msg.time}</time>
                  </div>

                  <div className="msg-text-bubble">
                    {isAssistant &&
                      (renderTimeline
                        ? (msg.streaming ||
                            (msg.activities && msg.activities.length > 0) ||
                            (msg.logs && msg.logs.length > 0) ||
                            Boolean(msg.reasoning)) &&
                          renderTimeline(msg)
                        : msg.logs &&
                          msg.logs.length > 0 && (
                            <ChatExecutionConsole
                              logs={msg.logs}
                              isStreaming={Boolean(msg.streaming)}
                            />
                          ))}
                    {isAssistant ? (
                      msg.text ? (
                        <ChatMarkdown content={msg.text} />
                      ) : msg.streaming && !renderTimeline ? (
                        <div className="msg-thinking-bubble">
                          <span className="thinking-dot" />
                          <span>{thinkingLabel}</span>
                        </div>
                      ) : null
                    ) : (
                      <p>{msg.text}</p>
                    )}

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
                                <span className="embed-target">
                                  Target 1: {activeSignal.target1}
                                </span>
                                {activeSignal.stop && (
                                  <span className="embed-target">Stop: {activeSignal.stop}</span>
                                )}
                              </div>
                            </div>

                            {renderTrajectoryLink ? (
                              renderTrajectoryLink(activeSignal)
                            ) : (
                              <Button
                                type="button"
                                onClick={() => onViewTrajectory?.(activeSignal.id)}
                                className="embed-action-btn"
                              >
                                <span>VIEW TRAJECTORY CONE</span>
                                <ArrowRight size={14} />
                              </Button>
                            )}
                          </Card>
                        );
                      })()}
                  </div>
                </div>
              </div>

              {followUps.length > 0 && onSelectFollowUp && (
                <div className="chat-followups">
                  <p className="chat-followups-title">{followUpsLabel}</p>
                  <SuggestionList>
                    {followUps.map((question, qIdx) => (
                      <Suggestion
                        key={qIdx}
                        label={question}
                        onClick={() => onSelectFollowUp(question)}
                      />
                    ))}
                  </SuggestionList>
                </div>
              )}
            </div>
          );
        })}

        {isSubmitting && !messages.some((m) => m.streaming) && (
          <div className="chat-msg-row msg-assistant">
            <div className="msg-avatar-col">
              <div className="assistant-avatar is-thinking">
                <Sparkles size={15} />
              </div>
            </div>
            <div className="msg-body-col">
              <div className="msg-meta-header">
                <strong>{assistantName}</strong>
              </div>
              <div className="msg-thinking-bubble">
                <span className="thinking-dot" />
                <span>{thinkingLabel}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
