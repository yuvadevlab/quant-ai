/**
 * @file src/features/chat/components/ChatPage.tsx
 * @description Master AI Financial Copilot page wrapper connected to the backend inference engine.
 * @author yuva.devlab@gmail.com
 */

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { ChatMessageType } from "@/constants/market.constants";
import { ChatHeader } from "./ChatHeader";
import { ChatThread, type ConversationItem } from "./ChatThread";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatComposer } from "./ChatComposer";
import type { ChatInitialData } from "../api/getChatData";
import { sendChatMessage } from "../api/sendChatMessage";

export interface ChatPageProps {
  readonly initialData: ChatInitialData;
}

export function ChatPage({ initialData }: ChatPageProps) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<ConversationItem[]>([
    {
      type: ChatMessageType.ASSISTANT,
      id: 1,
      time: "09:45 AM",
      text: "Reliance Industries is demonstrating institutional accumulation above the 20 EMA after an opening range breakout. Technical momentum is confirmed by volume expansion and Call unwinding at 3,000 CE. Below is the multi-agent consensus trade structure:",
      hasSignal: true,
    },
    {
      type: ChatMessageType.USER,
      id: 2,
      time: "09:46 AM",
      text: "What specific criteria would invalidate this trade hypothesis?",
    },
    {
      type: ChatMessageType.ASSISTANT,
      id: 3,
      time: "09:46 AM",
      text: "The deterministic Quant Risk Officer established two strict invalidation rules: \n1. A 15-minute candle close below the stop-loss level.\n2. A reversal in options flow where resistance calls see heavy institutional writing without spot price progression.",
    },
  ]);

  async function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = prompt.trim();
    if (!question || isSubmitting) return;

    const userMsgId = Date.now();
    const timeStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((current) => [
      ...current,
      { type: ChatMessageType.USER, text: question, id: userMsgId, time: timeStr },
    ]);
    setPrompt("");
    setIsSubmitting(true);

    try {
      const response = await sendChatMessage(question);
      setMessages((current) => [
        ...current,
        {
          type: ChatMessageType.ASSISTANT,
          text: response.reply,
          id: userMsgId + 1,
          time: timeStr,
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <QuantShell>
      <div className="desk-container">
        <ChatHeader />

        <div className="chat-thread-card">
          <div className="chat-thread-header">
            <div className="thread-title-wrap">
              <span className="thread-pulse" />
              <strong>Session: Multi-Asset Market Intelligence & Strategy Deliberation</strong>
            </div>
            <div className="model-chip">
              <Sparkles size={13} />
              <span>Multi-Agent Ensemble (Gemini / Anthropic / Groq)</span>
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
