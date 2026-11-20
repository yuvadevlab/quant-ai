/**
 * @file src/features/chat/components/ChatThread.tsx
 * @description Conversation thread displaying messages, trader queries, and embedded signal cards.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Signal } from "@/components/quantai/data";
import { ChatMessageType } from "@/constants/market.constants";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";

export interface ConversationItem {
  readonly type: ChatMessageType;
  readonly text: string;
  readonly id: number;
  readonly time: string;
  readonly hasSignal?: boolean;
}

export interface ChatThreadProps {
  readonly messages: readonly ConversationItem[];
  readonly featuredSignal?: Signal | undefined;
}

export function ChatThread({ messages, featuredSignal }: ChatThreadProps) {
  const copy = CHAT_COPY.THREAD;

  return (
    <div className="chat-messages-scroll">
      {messages.map((msg) => {
        const isAssistant = msg.type === ChatMessageType.ASSISTANT;

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
                <strong>{isAssistant ? copy.ASSISTANT_NAME : copy.USER_NAME}</strong>
                <time>{msg.time}</time>
              </div>

              <div className="msg-text-bubble">
                <p>{msg.text}</p>

                {msg.hasSignal && featuredSignal && (
                  <div className="chat-signal-embed">
                    <div className="embed-header">
                      <span className="embed-badge">{copy.EMBEDDED_SETUP}</span>
                      <span className="embed-id">{featuredSignal.id}</span>
                    </div>

                    <div className="embed-content">
                      <div className="embed-main">
                        <span className="embed-symbol">{featuredSignal.symbol}</span>
                        <span className="embed-company">{featuredSignal.companyName}</span>
                      </div>
                      <div className="embed-details">
                        <span className="embed-dir badge-buy">{featuredSignal.direction}</span>
                        <span className="embed-entry">
                          {copy.ENTRY_PREFIX} {featuredSignal.entry}
                        </span>
                        <span className="embed-target">
                          {copy.TARGET_PREFIX} {featuredSignal.target1}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/predictions/$id"
                      params={{ id: featuredSignal.id }}
                      className="embed-action-btn"
                    >
                      <span>{copy.VIEW_TRAJECTORY}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
