/**
 * @file src/features/chat/components/ChatPage.tsx
 * @description Master AI Financial Copilot conversation desk connected to live inference engine.
 * Real chat UI with empty-state landing, 1st-message ID page routing, zero mock messages, and history drawer.
 * @author yuva.devlab@gmail.com
 */

import { useState, useEffect, type SyntheticEvent } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { ChatMessageType } from "@/constants/market.constants";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";
import {
  ChatHeader,
  ChatThread,
  ChatSuggestions,
  ChatComposer,
  ChatEmptyState,
  ChatHistoryDrawer,
  type ChatThreadMessage,
  type ChatSessionHistoryItem,
} from "@quant-ai/ui";
import type { ChatInitialData } from "../api/getChatData";
import {
  sendChatMessage,
  fetchChatSessions,
  fetchChatSession,
  deleteChatSession,
  mapSessionMessageToUi,
} from "../api/sendChatMessage";
import {
  loadCachedMessages,
  saveCachedMessages,
  removeCachedMessages,
  loadCachedSessions,
  saveCachedSession,
  removeCachedSession,
} from "../api/chatStorage";

export interface ChatPageProps {
  readonly initialData: ChatInitialData;
  readonly conversationId?: string | undefined;
}

export function ChatPage({ initialData, conversationId }: ChatPageProps) {
  const router = useRouter();
  const copy = CHAT_COPY;

  const [activeId, setActiveId] = useState<string | undefined>(conversationId);
  const [messages, setMessages] = useState<ChatThreadMessage[]>(() => {
    if (conversationId) {
      return loadCachedMessages(conversationId) ?? [];
    }
    return [];
  });
  const [sessions, setSessions] = useState<ChatSessionHistoryItem[]>(() => loadCachedSessions());
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Sync state if conversationId prop changes (e.g. from route change)
  useEffect(() => {
    setActiveId(conversationId);
    if (!conversationId) {
      setMessages([]);
      return;
    }
    const cached = loadCachedMessages(conversationId);
    if (cached) {
      setMessages(cached);
    } else {
      void fetchChatSession(conversationId).then((res) => {
        if (res?.messages) {
          const uiMsgs = res.messages.map(mapSessionMessageToUi);
          setMessages(uiMsgs);
          saveCachedMessages(conversationId, uiMsgs);
        }
      });
    }
  }, [conversationId]);

  // Load past conversation sessions from backend and local cache
  useEffect(() => {
    void fetchChatSessions().then((backendSessions) => {
      if (backendSessions.length > 0) {
        setSessions(backendSessions);
        for (const s of backendSessions) {
          saveCachedSession(s);
        }
      }
    });
  }, []);

  async function handleSendPrompt(questionText: string) {
    const question = questionText.trim();
    if (!question || isSubmitting) return;

    const userMsgId = Date.now();
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const userMessage: ChatThreadMessage = {
      type: ChatMessageType.USER,
      text: question,
      id: userMsgId,
      time: timeStr,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setPrompt("");
    setIsSubmitting(true);

    try {
      const response = await sendChatMessage(question, activeId);
      const newSessionId = response.sessionId ?? activeId ?? `session-${Date.now()}`;

      const assistantMessage: ChatThreadMessage = {
        type: ChatMessageType.ASSISTANT,
        text: response.reply,
        id: userMsgId + 1,
        time: timeStr,
        hasSignal: !!response.signalData || !!initialData.featuredSignal,
        ...(response.signalData ? { signalData: response.signalData } : {}),
      };

      const finalMessages = [...nextMessages, assistantMessage];
      setMessages(finalMessages);
      saveCachedMessages(newSessionId, finalMessages);

      const sessionItem: ChatSessionHistoryItem = {
        id: newSessionId,
        title: question.slice(0, 38) || "Discussion",
        updatedAt: new Date().toISOString(),
        messageCount: finalMessages.length,
      };
      saveCachedSession(sessionItem);
      setSessions((prev) => [sessionItem, ...prev.filter((s) => s.id !== newSessionId)]);

      // If this was the first message on the empty root page, land on the ID-generated page
      if (!activeId) {
        setActiveId(newSessionId);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `/chat/${encodeURIComponent(newSessionId)}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectConversation(id: string) {
    setActiveId(id);
    setHistoryOpen(false);
    void router.navigate({ to: "/chat/$id", params: { id } });
  }

  function handleStartNewChat() {
    setActiveId(undefined);
    setMessages([]);
    setPrompt("");
    setHistoryOpen(false);
    void router.navigate({ to: "/chat" });
  }

  function handleDeleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    removeCachedMessages(id);
    removeCachedSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    void deleteChatSession(id);
    if (activeId === id) {
      handleStartNewChat();
    }
  }

  async function submitPrompt(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleSendPrompt(prompt);
  }

  return (
    <QuantShell>
      <div className="desk-container">
        <ChatHeader
          onToggleHistory={() => setHistoryOpen(true)}
          historyCount={sessions.length}
          onNewChat={handleStartNewChat}
        />

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

          <ChatThread
            messages={messages}
            featuredSignal={initialData.featuredSignal}
            emptyState={<ChatEmptyState onSelectPrompt={handleSendPrompt} />}
            renderTrajectoryLink={(signal) => (
              <Link to="/predictions/$id" params={{ id: signal.id }} className="embed-action-btn">
                <span>{copy.THREAD.VIEW_TRAJECTORY}</span>
                <ArrowRight size={14} />
              </Link>
            )}
          />
          {messages.length > 0 && <ChatSuggestions onSelectPrompt={setPrompt} />}
          <ChatComposer prompt={prompt} onPromptChange={setPrompt} onSubmit={submitPrompt} />
        </div>

        <ChatHistoryDrawer
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          sessions={sessions}
          activeSessionId={activeId}
          onSelectSession={handleSelectConversation}
          onDeleteSession={handleDeleteConversation}
          onNewChat={handleStartNewChat}
        />
      </div>
    </QuantShell>
  );
}
