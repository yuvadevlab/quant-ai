/**
 * @file apps/api/src/modules/chat/chat.types.ts
 * @description Type definitions and contracts for AI Copilot chat sessions and messages.
 * @author yuva.devlab@gmail.com
 */

import type { AiProviderType, AgentRole, AgentStance } from "@quant-ai/shared-types";

export interface ChatSessionSummary {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly messageCount?: number;
}

export interface ChatSessionMessageItem {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly createdAt: string;
}

export interface ChatSessionDetail extends ChatSessionSummary {
  readonly messages: ChatSessionMessageItem[];
}

export interface ChatMessageResponse {
  readonly reply: string;
  readonly sessionId?: string;
  readonly referencedSymbol?: string;
  readonly livePrice?: number;
  readonly liveChange?: number;
  readonly agentPerspective?: {
    readonly role: AgentRole;
    readonly stance: AgentStance;
    readonly conviction: number;
  };
  readonly timestamp: string;
}

export interface SendChatMessageDto {
  readonly message: string;
  readonly sessionId?: string;
  readonly providerOverride?: AiProviderType;
}
