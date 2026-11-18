import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChevronRight,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { signals } from "./data";
import { QuantLayout } from "./layout";

const quickPrompts = [
  { icon: Zap, label: "Scan Nifty 50 expiry momentum" },
  { icon: Target, label: "BankNifty 51,200 CE options structure" },
  { icon: ArrowUpRight, label: "Analyze Reliance 15m breakout" },
  { icon: ShieldCheck, label: "Explain automated invalidation rules" },
];

type ConversationItem = {
  type: "user" | "assistant";
  text: string;
  id: number;
  time: string;
  hasSignal?: boolean;
};

export function ChatWorkspace() {
  const [prompt, setPrompt] = useState("");
  const featured = signals[0];

  const [messages, setMessages] = useState<ConversationItem[]>([
    {
      type: "assistant",
      id: 1,
      time: "09:45 AM",
      text: "Reliance Industries is demonstrating institutional accumulation above the 20 EMA after an opening range breakout. Technical momentum is confirmed by a +42% volume expansion and heavy Call unwinding at 2,450 CE. Below is the multi-agent consensus trade structure:",
      hasSignal: true,
    },
    {
      type: "user",
      id: 2,
      time: "09:46 AM",
      text: "What specific criteria would invalidate this trade hypothesis?",
    },
    {
      type: "assistant",
      id: 3,
      time: "09:46 AM",
      text: "The deterministic Risk Guardian agent has established two strict invalidation rules: \n1. A 15-minute candle close below the ₹2,402 stop-loss level.\n2. A reversal in options flow where 2,450 CE sees fresh writing of >30,000 contracts without spot price progression. If either condition triggers, the position is immediately flagged for automated exit.",
    },
  ]);

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = prompt.trim();
    if (!question) return;

    const userMsgId = Date.now();
    const timeStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((current) => [
      ...current,
      { type: "user", text: question, id: userMsgId, time: timeStr },
      {
        type: "assistant",
        text: `Analysis for “${question}”: Multi-agent inference synthesis indicates strong bullish breadth across Nifty benchmark components. Key resistance sits at 24,220 with primary support confirmed at 24,100. Risk models recommend capping intraday exposure to 1.0% capital per signal.`,
        id: userMsgId + 1,
        time: timeStr,
      },
    ]);
    setPrompt("");
  }

  return (
    <QuantLayout active="chat">
      <div className="desk-container">
        {/* Header */}
        <div className="desk-header">
          <div>
            <div className="desk-breadcrumb">
              <span>INTELLIGENCE</span>
              <ChevronRight size={14} />
              <span className="current">AI FINANCIAL COPILOT</span>
            </div>
            <h1 className="desk-title">AI Financial Copilot</h1>
            <p className="desk-subtitle">
              Interactive multi-agent quantitative analyst. Query setups, examine options chain
              dynamics, and evaluate market regime hypotheses in real time.
            </p>
          </div>
          <div className="desk-actions">
            <span className="paper-trading-tag">
              <Bot size={15} />
              <span>MULTI-AGENT CONSENSUS MODE</span>
            </span>
          </div>
        </div>

        {/* Chat Thread Workspace */}
        <div className="chat-thread-card">
          <div className="chat-thread-header">
            <div className="thread-title-wrap">
              <span className="thread-pulse" />
              <strong>Session: Indian Market Intelligence & Strategy Deliberation</strong>
            </div>
            <div className="model-chip">
              <Sparkles size={13} />
              <span>Gemini 2.0 / Ollama Llama-3-70B</span>
            </div>
          </div>

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

                    {msg.hasSignal && featured && (
                      <div className="embedded-signal-box">
                        <div className="embedded-signal-header">
                          <div>
                            <span className="signal-id-tag">{featured.id}</span>
                            <strong className="embedded-symbol">{featured.symbol}</strong>
                            <span className="company-sub">{featured.companyName}</span>
                          </div>
                          <div className="signal-badge-col">
                            <span className="direction-badge badge-buy">{featured.direction}</span>
                            <span className="horizon-badge">{featured.horizon}</span>
                          </div>
                        </div>

                        <div className="price-matrix-grid">
                          <div className="matrix-cell">
                            <span className="cell-label">ENTRY ZONE</span>
                            <span className="cell-val mono">{featured.entry}</span>
                          </div>
                          <div className="matrix-cell">
                            <span className="cell-label">TARGET 1</span>
                            <span className="cell-val mono text-gain">{featured.target1}</span>
                          </div>
                          <div className="matrix-cell">
                            <span className="cell-label">TARGET 2</span>
                            <span className="cell-val mono text-gain">{featured.target2}</span>
                          </div>
                          <div className="matrix-cell">
                            <span className="cell-label">STOP LOSS</span>
                            <span className="cell-val mono text-loss">{featured.stop}</span>
                          </div>
                        </div>

                        <div className="embedded-footer">
                          <span className="conviction-text">
                            Conviction: <strong>{featured.confidence}</strong> · Risk/Reward 1:2.6
                          </span>
                          <Link
                            to="/predictions/$id"
                            params={{ id: featured.id }}
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

          {/* Quick Prompt Starters */}
          <div className="quick-prompts-bar">
            <span className="prompts-label">QUICK PROMPTS:</span>
            <div className="prompts-scroll">
              {quickPrompts.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="quick-prompt-btn"
                  onClick={() => setPrompt(label)}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Form */}
          <form className="chat-input-bar" onSubmit={submitPrompt}>
            <div className="input-field-wrap">
              <input
                type="text"
                placeholder="Ask QuantAI about a symbol, pattern, options setup, or risk condition..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="chat-prompt-input"
              />
              <span className="kbd-shortcut">Enter to send</span>
            </div>
            <button type="submit" className="btn-chat-send" title="Send query to Copilot">
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </QuantLayout>
  );
}
