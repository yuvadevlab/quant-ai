/**
 * @file src/features/chat/components/ChatPage.tsx
 * @description Master AI Financial Copilot conversation desk connected to live inference engine.
 * Real chat UI with empty-state landing, 1st-message ID page routing, zero mock messages, and history drawer.
 */

import { useState, useEffect, useRef, type SyntheticEvent } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { ChatMessageType } from "@/constants/market.constants";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";
import { useBenchmarkTicks } from "@/services/market-feed.service";
import { useWorkstationSession } from "@/hooks/use-workstation-session";
import {
  ChatHeader,
  ChatContextPanel,
  ChatThread,
  ChatComposer,
  ChatEmptyState,
  ChatHistoryDrawer,
  type ChatThreadMessage,
  type ChatSessionHistoryItem,
} from "@quant-ai/ui";
import type { ChatInitialData } from "../api/getChatData";
import {
  sendChatMessage,
  sendChatMessageStream,
  fetchChatSessions,
  fetchChatSession,
  deleteChatSession,
  mapSessionMessageToUi,
  type ChatReplyPayload,
} from "../api/sendChatMessage";
import {
  appendActivityReducer,
  appendLogReducer,
  appendReasoningReducer,
  appendTextReducer,
  applyCompleteReducer,
  endStreamReducer,
  failStreamReducer,
  replaceTextReducer,
  setModeReducer,
  setSuggestionsReducer,
  updateActivityReducer,
} from "../api/agentMessageReducers";
import type { AgentEventPort } from "../api/agentEventHandlers";
import { useChatAutoScroll } from "../hooks/useChatAutoScroll";
import { ActivityTimeline } from "./ActivityTimeline";
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const { containerRef, contentRef, isAtBottom, handleScroll, scrollToBottom } =
    useChatAutoScroll();
  const { data: benchmarkTicks = [] } = useBenchmarkTicks();
  const { sessionInfo } = useWorkstationSession();

  useEffect(() => {
    if (activeId && messages.length > 0 && !isSubmitting) {
      saveCachedMessages(activeId, messages);
    }
  }, [activeId, messages, isSubmitting]);

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
    const assistantMsgId = userMsgId + 1;
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const userMessage: ChatThreadMessage = {
      type: ChatMessageType.USER,
      text: question,
      id: userMsgId,
      time: timeStr,
    };
    const streamingPlaceholder: ChatThreadMessage = {
      type: ChatMessageType.ASSISTANT,
      text: "",
      id: assistantMsgId,
      time: timeStr,
      logs: [],
      streaming: true,
    };

    const nextMessages = [...messages, userMessage, streamingPlaceholder];
    setMessages(nextMessages);
    setPrompt("");
    setIsSubmitting(true);
    scrollToBottom();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    let resolvedSessionId = activeId;
    let completedPayload: ChatReplyPayload | null = null;

    const port: AgentEventPort = {
      onConversation: (id) => {
        resolvedSessionId = resolvedSessionId ?? id;
        if (!activeId) {
          setActiveId(id);
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", `/chat/${encodeURIComponent(id)}`);
          }
        }
      },
      onMode: (mode) => setMessages((prev) => setModeReducer(prev, mode)),
      appendLog: (entry) => setMessages((prev) => appendLogReducer(prev, entry)),
      appendReasoning: (content) => setMessages((prev) => appendReasoningReducer(prev, content)),
      appendText: (content) => setMessages((prev) => appendTextReducer(prev, content)),
      replaceText: (content) => setMessages((prev) => replaceTextReducer(prev, content)),
      appendActivity: (activity) => setMessages((prev) => appendActivityReducer(prev, activity)),
      updateActivity: (tool, patch) =>
        setMessages((prev) => updateActivityReducer(prev, tool, patch)),
      setSuggestions: (suggestions) =>
        setMessages((prev) => setSuggestionsReducer(prev, suggestions)),
      onComplete: (payload) => {
        completedPayload = payload;
        setMessages((prev) => applyCompleteReducer(prev, payload, initialData.featuredSignal));
      },
      failStream: (error) => setMessages((prev) => failStreamReducer(prev, error)),
      endStream: () => setMessages((prev) => endStreamReducer(prev)),
    };

    try {
      try {
        await sendChatMessageStream(question, activeId, port, controller.signal);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setMessages((prev) => endStreamReducer(prev));
          return;
        }
        const fallback = await sendChatMessage(question, activeId);
        completedPayload = fallback;
        setMessages((prev) => applyCompleteReducer(prev, fallback, initialData.featuredSignal));
      }

      const newSessionId =
        completedPayload?.sessionId ?? resolvedSessionId ?? activeId ?? `session-${Date.now()}`;
      const sessionItem: ChatSessionHistoryItem = {
        id: newSessionId,
        title: question.slice(0, 38) || "Discussion",
        updatedAt: new Date().toISOString(),
        messageCount: nextMessages.length,
      };
      saveCachedSession(sessionItem);
      setSessions((prev) => [sessionItem, ...prev.filter((s) => s.id !== newSessionId)]);

      if (!activeId) {
        setActiveId(newSessionId);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `/chat/${encodeURIComponent(newSessionId)}`);
        }
      }
    } finally {
      abortControllerRef.current = null;
      setIsSubmitting(false);
    }
  }

  function handleStopStream() {
    abortControllerRef.current?.abort();
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
    <QuantShell fillViewport>
      <div className="desk-container advisor-workspace-viewport">
        <ChatHeader
          title={copy.HEADER.TITLE}
          onToggleHistory={() => setHistoryOpen(true)}
          historyCount={sessions.length}
          onNewChat={handleStartNewChat}
          hasMessages={messages.length > 0 || Boolean(activeId)}
        />

        <div className="advisor-workspace-grid">
          <div className="advisor-workspace-main">
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
                isSubmitting={isSubmitting}
                onSelectFollowUp={handleSendPrompt}
                assistantName={copy.THREAD.ASSISTANT_NAME}
                userName={copy.THREAD.USER_NAME}
                followUpsLabel={copy.THREAD.FOLLOW_UPS_LABEL}
                thinkingLabel={copy.THREAD.THINKING_LABEL}
                featuredSignal={initialData.featuredSignal}
                emptyState={<ChatEmptyState onSelectPrompt={handleSendPrompt} />}
                scrollContainerRef={containerRef}
                scrollContentRef={contentRef}
                onScroll={handleScroll}
                renderTimeline={(msg) => (
                  <ActivityTimeline
                    activities={msg.activities}
                    logs={msg.logs}
                    reasoning={msg.reasoning}
                    reasoningStreaming={msg.reasoningStreaming}
                    reasoningStartedAt={msg.reasoningStartedAt}
                    reasoningCompletedAt={msg.reasoningCompletedAt}
                    isStreaming={Boolean(msg.streaming)}
                    hasText={msg.text.length > 0}
                  />
                )}
                renderTrajectoryLink={(signal) => (
                  <Link
                    to="/predictions/$id"
                    params={{ id: signal.id }}
                    className="embed-action-btn"
                  >
                    <span>{copy.THREAD.VIEW_TRAJECTORY}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              />
              {!isAtBottom && messages.length > 0 && (
                <button type="button" className="qt-jump-bottom" onClick={scrollToBottom}>
                  <ArrowDown size={14} />
                  <span>{copy.COMPOSER.JUMP_TO_LATEST}</span>
                </button>
              )}
              <ChatComposer
                prompt={prompt}
                onPromptChange={setPrompt}
                onSubmit={submitPrompt}
                isSubmitting={isSubmitting}
                placeholder={copy.COMPOSER.PLACEHOLDER}
                shortcutHint={copy.COMPOSER.SHORTCUT_HINT}
                sendButtonLabel={copy.COMPOSER.SEND_BUTTON}
                onStop={handleStopStream}
                stopButtonLabel={copy.COMPOSER.STOP_BUTTON}
              />
            </div>
          </div>

          <ChatContextPanel
            ticks={benchmarkTicks}
            regimeLabel={sessionInfo.statusText}
            disabled={isSubmitting}
            onSelectPrompt={handleSendPrompt}
            quickPrompts={[
              { label: copy.SUGGESTIONS.PROMPT_NIFTY, prompt: copy.SUGGESTIONS.PROMPT_NIFTY },
              {
                label: copy.SUGGESTIONS.PROMPT_BANKNIFTY,
                prompt: copy.SUGGESTIONS.PROMPT_BANKNIFTY,
              },
              {
                label: copy.SUGGESTIONS.PROMPT_RELIANCE,
                prompt: copy.SUGGESTIONS.PROMPT_RELIANCE,
              },
              { label: copy.SUGGESTIONS.PROMPT_RULES, prompt: copy.SUGGESTIONS.PROMPT_RULES },
            ]}
          />
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
