/**
 * @file apps/api/src/modules/chat/chat-sessions.ts
 * @description Manages persistence and retrieval of Copilot conversation threads.
 * @author yuva.devlab@gmail.com
 */

import { Logger } from "@yuva-devlab/logger";
import type { DatabaseService } from "../infrastructure/database.service";
import type { ChatSessionSummary, ChatSessionDetail } from "./chat.types";

/**
 * Retrieves summary list of past conversation sessions from DB or in-memory fallback.
 */
export async function getChatSessions(
  databaseService: DatabaseService | undefined,
  inMemorySessions: Map<string, ChatSessionDetail>,
  logger: Logger,
): Promise<ChatSessionSummary[]> {
  if (databaseService?.client) {
    try {
      const rows = await databaseService.client.chatSession.findMany({
        orderBy: { updatedAt: "desc" },
        take: 30,
        include: { _count: { select: { messages: true } } },
      });
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        messageCount: r._count.messages,
      }));
    } catch (err) {
      logger.debug(`[getChatSessions] DB query failed, using in-memory: ${String(err)}`);
    }
  }
  return Array.from(inMemorySessions.values()).map((s) => ({
    id: s.id,
    title: s.title,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    messageCount: s.messages.length,
  }));
}

/**
 * Retrieves full conversation thread detail with all messages.
 */
export async function getChatSession(
  id: string,
  databaseService: DatabaseService | undefined,
  inMemorySessions: Map<string, ChatSessionDetail>,
  logger: Logger,
): Promise<ChatSessionDetail | null> {
  if (databaseService?.client) {
    try {
      const row = await databaseService.client.chatSession.findUnique({
        where: { id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
      if (row) {
        return {
          id: row.id,
          title: row.title,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
          messages: row.messages.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            createdAt: m.createdAt.toISOString(),
          })),
        };
      }
    } catch (err) {
      logger.debug(`[getChatSession] DB query failed, using in-memory: ${String(err)}`);
    }
  }
  return inMemorySessions.get(id) ?? null;
}

/**
 * Deletes a conversation session by identifier from DB and in-memory cache.
 */
export async function deleteChatSession(
  id: string,
  databaseService: DatabaseService | undefined,
  inMemorySessions: Map<string, ChatSessionDetail>,
): Promise<boolean> {
  inMemorySessions.delete(id);
  if (databaseService?.client) {
    try {
      await databaseService.client.chatSession.delete({ where: { id } });
    } catch {
      // Safe delete
    }
  }
  return true;
}

/**
 * Persists user prompt and assistant response to DB and in-memory session ledger.
 */
export async function persistChatMessages(
  sessionId: string,
  title: string,
  userText: string,
  assistantText: string,
  databaseService: DatabaseService | undefined,
  inMemorySessions: Map<string, ChatSessionDetail>,
  logger: Logger,
): Promise<void> {
  const now = new Date().toISOString();
  const existing = inMemorySessions.get(sessionId);
  const prevMessages = existing?.messages ?? [];
  const newMessages = [
    ...prevMessages,
    { id: `msg-${Date.now()}-u`, role: "user" as const, content: userText, createdAt: now },
    {
      id: `msg-${Date.now()}-a`,
      role: "assistant" as const,
      content: assistantText,
      createdAt: now,
    },
  ];

  inMemorySessions.set(sessionId, {
    id: sessionId,
    title: existing?.title ?? title,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    messages: newMessages,
  });

  if (databaseService?.client) {
    try {
      await databaseService.client.chatSession.upsert({
        where: { id: sessionId },
        update: { updatedAt: new Date() },
        create: { id: sessionId, title, userId: "default-trader-id" },
      });
      await databaseService.client.chatMessage.createMany({
        data: [
          { sessionId, role: "user", content: userText },
          { sessionId, role: "assistant", content: assistantText },
        ],
      });
    } catch (err) {
      logger.debug(`[persistChatMessages] DB save failed: ${String(err)}`);
    }
  }
}
