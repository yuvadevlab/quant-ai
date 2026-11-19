/**
 * @file src/features/chat/components/ChatThread.tsx
 * @description Conversation thread displaying messages, trader queries, and embedded signal cards.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Signal } from "@/components/quantai/data";

export interface ConversationItem {
  readonly type: "user" | "assistant";
  readonly text: string;
  readonly id: number;
  readonly time: string;
  readonly hasSignal?: boolean;
}

export interface ChatThreadProps {
  readonly messages: readonly ConversationItem[];
  readonly featuredSignal?: Signal;
}

export function ChatThread({ messages, featuredSignal }: ChatThreadProps) {
  return (
    <div className="chat-messages-scroll">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-msg-row ${msg.type === "assistant" ? "msg-assistant" : "msg-user"}`}
        >
          <div className="msg-avatar-col">
            {msg.type === "assistant" ? (
              <div className="assistant-avatar">
                <Sparkles size={15} />
              </div>
            ) : (
              <div className="user-avatar">Y</div>
            )}
          </div>

          <div className="msg-body-col">
            <div className="msg-meta-header">
              <strong>{msg.type === "assistant" ? "QuantAI Copilot" : "You (Trader)"}</strong>
              <time>{msg.time}</time>
            </div>

            <div className="msg-text-bubble">
              <p>{msg.text}</p>

              {msg.hasSignal && featuredSignal && (
                <div className="embedded-signal-box">
                  <div className="embedded-signal-header">
                    <div>
                      <span className="signal-id-tag">{featuredSignal.id}</span>
                      <strong className="embedded-symbol">{featuredSignal.symbol}</strong>
                      <span className="company-sub">{featuredSignal.companyName}</span>
                    </div>
                    <div className="signal-badge-col">
                      <span className="direction-badge badge-buy">{featuredSignal.direction}</span>
                      <span className="horizon-badge">{featuredSignal.horizon}</span>
                    </div>
                  </div>

                  <div className="price-matrix-grid">
                    <div className="matrix-cell">
                      <span className="cell-label">ENTRY ZONE</span>
                      <span className="cell-val mono">{featuredSignal.entry}</span>
                    </div>
                    <div className="matrix-cell">
                      <span className="cell-label">TARGET 1</span>
                      <span className="cell-val mono text-gain">{featuredSignal.target1}</span>
                    </div>
                    <div className="matrix-cell">
                      <span className="cell-label">TARGET 2</span>
                      <span className="cell-val mono text-gain">{featuredSignal.target2}</span>
                    </div>
                    <div className="matrix-cell">
                      <span className="cell-label">STOP LOSS</span>
                      <span className="cell-val mono text-loss">{featuredSignal.stop}</span>
                    </div>
                  </div>

                  <div className="embedded-footer">
                    <span className="conviction-text">
                      Conviction: <strong>{featuredSignal.confidence}</strong> · Risk/Reward 1:2.6
                    </span>
                    <Link
                      to="/predictions/$id"
                      params={{ id: featuredSignal.id }}
                      className="btn-inspect-trajectory"
                    >
                      <span>Inspect Trajectory Cone</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
