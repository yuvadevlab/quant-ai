/**
 * @file src/features/chat/components/ChatPage.tsx
 * @description Master AI Financial Copilot page wrapper connected to the backend inference engine.
 * @author yuva.devlab@gmail.com
 */

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { ChatMessageType } from "@/constants/market.constants";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";
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
  const copy = CHAT_COPY;

  const [messages, setMessages] = useState<ConversationItem[]>([
    {
      type: ChatMessageType.ASSISTANT,
      id: 1,
      time: "09:45 AM",
      text: copy.INITIAL_MESSAGES.FIRST_ASSISTANT,
      hasSignal: true,
    },
    {
      type: ChatMessageType.USER,
      id: 2,
      time: "09:46 AM",
      text: copy.INITIAL_MESSAGES.USER_QUERY,
    },
    {
      type: ChatMessageType.ASSISTANT,
      id: 3,
      time: "09:46 AM",
      text: copy.INITIAL_MESSAGES.SECOND_ASSISTANT,
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
              <strong>{copy.THREAD.SESSION_TITLE}</strong>
            </div>
            <div className="model-chip">
              <Sparkles size={13} />
              <span>{copy.THREAD.MODEL_BADGE}</span>
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
