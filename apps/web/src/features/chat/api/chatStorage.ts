/**
 * @file src/features/chat/api/chatStorage.ts
 * @description In-memory and sessionStorage persistence adapter for conversational threads.
 * Provides 0ms instant thread switching without UI jitter or skeleton flashing,
 * mirroring the architecture pattern established in FinAI & OrchestrAI.
 */

import type { ChatThreadMessage, ChatSessionHistoryItem } from "@quant-ai/ui";

const CHAT_CACHE_PREFIX = "quantai_chat_thread_";
const CHAT_SESSIONS_KEY = "quantai_chat_sessions_catalog";

/**
 * Loads cached conversation messages from browser sessionStorage.
 */
export function loadCachedMessages(conversationId: string): ChatThreadMessage[] | null {
  if (typeof window === "undefined" || !conversationId) return null;
  try {
    const raw = sessionStorage.getItem(`${CHAT_CACHE_PREFIX}${conversationId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as ChatThreadMessage[]) : null;
  } catch {
    return null;
  }
}

/**
 * Persists conversation messages to browser sessionStorage for instant zero-latency retrieval.
 */
export function saveCachedMessages(
  conversationId: string,
  messages: readonly ChatThreadMessage[],
): void {
  if (typeof window === "undefined" || !conversationId || messages.length === 0) return;
  try {
    sessionStorage.setItem(`${CHAT_CACHE_PREFIX}${conversationId}`, JSON.stringify(messages));
  } catch {
    // Graceful storage quota fallback
  }
}

/**
 * Removes cached conversation messages from sessionStorage when a conversation is deleted.
 */
export function removeCachedMessages(conversationId: string): void {
  if (typeof window === "undefined" || !conversationId) return;
  try {
    sessionStorage.removeItem(`${CHAT_CACHE_PREFIX}${conversationId}`);
  } catch {
    // Graceful fallback
  }
}

/**
 * Loads the list of cached conversation sessions from sessionStorage.
 */
export function loadCachedSessions(): ChatSessionHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CHAT_SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChatSessionHistoryItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Saves or updates a conversation session in the local cache catalog.
 */
export function saveCachedSession(session: ChatSessionHistoryItem): void {
  if (typeof window === "undefined" || !session.id) return;
  try {
    const current = loadCachedSessions();
    const filtered = current.filter((s) => s.id !== session.id);
    const updated = [session, ...filtered];
    sessionStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updated));
  } catch {
    // Graceful fallback
  }
}

/**
 * Removes a conversation session from the local cache catalog.
 */
export function removeCachedSession(sessionId: string): void {
  if (typeof window === "undefined" || !sessionId) return;
  try {
    const current = loadCachedSessions();
    const updated = current.filter((s) => s.id !== sessionId);
    sessionStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updated));
  } catch {
    // Graceful fallback
  }
}
