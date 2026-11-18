/**
 * @file src/features/chat/components/ChatPage.tsx
 * @description Master AI Financial Copilot page wrapper.
 * Composes workstation shell, header banner, conversation thread, prompt suggestions, and composer form.
 */

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { ChatHeader } from "./ChatHeader";
import { ChatThread, type ConversationItem } from "./ChatThread";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatComposer } from "./ChatComposer";
import type { ChatInitialData } from "../api/getChatData";

export interface ChatPageProps {
  readonly initialData: ChatInitialData;
}

export function ChatPage({ initialData }: ChatPageProps) {
  const [prompt, setPrompt] = useState("");
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
    <QuantShell>
      <div className="desk-container">
        <ChatHeader />

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

          <ChatThread messages={messages} featuredSignal={initialData.featuredSignal} />
          <ChatSuggestions onSelectPrompt={setPrompt} />
          <ChatComposer prompt={prompt} onPromptChange={setPrompt} onSubmit={submitPrompt} />
        </div>
      </div>
    </QuantShell>
  );
}
