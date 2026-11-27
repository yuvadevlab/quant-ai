/**
 * @file src/features/chat/api/sendChatMessage.ts
 * @description API client for sending trader prompts and managing Copilot sessions.
 */

import { WEB_ENV } from "@/constants/env.constants";
import { ApiRoute } from "@/constants/routes.constants";
import type { ChatSessionHistoryItem, ChatThreadMessage, TableSignalItem } from "@quant-ai/ui";

export interface ChatReplyPayload {
  readonly reply: string;
  readonly sessionId?: string;
  readonly referencedSymbol?: string;
  readonly livePrice?: number;
  readonly liveChange?: number;
  readonly signalData?: TableSignalItem;
  readonly predictionId?: string;
  readonly followUps?: readonly string[];
  readonly logs?: readonly AgentRunLogEntry[];
  readonly agentPerspective?: {
    readonly role: string;
    readonly stance: string;
    readonly conviction: number;
  };
  readonly timestamp: string;
}

export interface ChatSessionDetailPayload {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly messages: Array<{
    readonly id: string;
    readonly role: "user" | "assistant";
    readonly content: string;
    readonly createdAt: string;
  }>;
}

function getApiEndpoint(route: string): string {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  if (typeof window !== "undefined") {
    // In browser client, use relative endpoint so Vite proxy forwards to backend cleanly
    return normalizedRoute;
  }
  const base = (WEB_ENV.VITE_API_URL || "http://localhost:4005").replace(/\/api\/?$/, "");
  return `${base}${normalizedRoute}`;
}

function buildServiceUnavailableReply(statusOrReason?: string): string {
  const detail = statusOrReason ? ` (${statusOrReason})` : "";
  return (
    `### ⚠️ AI Strategist Service Unavailable\n\n` +
    `Could not reach the QuantAI live inference backend${detail}. ` +
    `No simulated or cached market thesis was generated.\n\n` +
    `Please ensure the QuantAI API server is running on port 4005 and try your query again.`
  );
}

/**
 * Sends a chat message to the QuantAI backend and retrieves AI reasoning.
 */
export async function sendChatMessage(
  message: string,
  sessionId?: string,
): Promise<ChatReplyPayload> {
  const endpoint = getApiEndpoint(ApiRoute.CHAT_MESSAGE);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status}`);
    }

    return (await res.json()) as ChatReplyPayload;
  } catch (err) {
    const reason = err instanceof Error ? err.message : undefined;
    return {
      reply: buildServiceUnavailableReply(reason),
      sessionId: sessionId || `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Fetches all past conversation sessions from the API.
 */
export async function fetchChatSessions(): Promise<ChatSessionHistoryItem[]> {
  const endpoint = getApiEndpoint("/api/chat/sessions");
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    return (await res.json()) as ChatSessionHistoryItem[];
  } catch {
    return [];
  }
}

/**
 * Fetches full message history for a specific conversation session.
 */
export async function fetchChatSession(
  sessionId: string,
): Promise<ChatSessionDetailPayload | null> {
  const endpoint = getApiEndpoint(`/api/chat/sessions/${encodeURIComponent(sessionId)}`);
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return (await res.json()) as ChatSessionDetailPayload;
  } catch {
    return null;
  }
}

/**
 * Deletes a conversation session from the API.
 */
export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const endpoint = getApiEndpoint(`/api/chat/sessions/${encodeURIComponent(sessionId)}`);
  try {
    const res = await fetch(endpoint, { method: "DELETE", signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

import type { AgentRunLogEntry, AgentStreamEvent } from "@quant-ai/shared-types";
import { handleAgentStreamEvent, type AgentEventPort } from "./agentEventHandlers";

/**
 * Streams a trader's message query over SSE and dispatches events into the AgentEventPort.
 */
export async function sendChatMessageStream(
  message: string,
  sessionId: string | undefined,
  port: AgentEventPort,
  signal?: AbortSignal,
): Promise<void> {
  const endpoint = getApiEndpoint(ApiRoute.CHAT_STREAM);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ message, ...(sessionId ? { sessionId } : {}) }),
    ...(signal ? { signal } : {}),
  });

  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      let event: AgentStreamEvent;
      try {
        event = JSON.parse(raw) as AgentStreamEvent;
      } catch {
        continue;
      }

      if (handleAgentStreamEvent(event, port)) return;
    }
  }
}

/**
 * Converts a backend session message into a UI ChatThreadMessage.
 */
export function mapSessionMessageToUi(msg: {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}): ChatThreadMessage {
  const time = new Date(msg.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return {
    id: msg.id,
    type: msg.role === "assistant" ? "assistant" : "user",
    text: msg.content,
    time,
  };
}
