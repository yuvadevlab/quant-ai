/**
 * @file apps/api/src/modules/chat/chat.types.ts
 * @description Type definitions and contracts for AI Copilot chat sessions and messages.
 */

import type {
  AiProviderType,
  AgentRole,
  AgentStance,
  AgentRunLogEntry,
} from "@quant-ai/shared-types";
export {
  AgentRunLogLevel,
  AgentStreamEventType,
  type AgentRunLogEntry,
  type AgentStreamEvent,
} from "@quant-ai/shared-types";

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

export interface EmbeddedSignalSetup {
  readonly id: string;
  readonly symbol: string;
  readonly instrument: string;
  readonly companyName?: string;
  readonly direction: "BUY" | "SELL" | string;
  readonly horizon: string;
  readonly entry: string;
  readonly target1: string;
  readonly target2: string;
  readonly stop: string;
  readonly last: string;
  readonly status: "Active" | "Target hit" | "Stop loss hit" | "Expired" | string;
  readonly mfe: string;
  readonly mae: string;
  readonly time: string;
  readonly confidence?: string;
  readonly catalysts?: readonly string[];
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
  readonly signalData?: EmbeddedSignalSetup;
  readonly predictionId?: string;
  readonly followUps?: readonly string[];
  readonly logs?: readonly AgentRunLogEntry[];
  readonly timestamp: string;
}

export interface SendChatMessageDto {
  readonly message?: string;
  readonly query?: string;
  readonly sessionId?: string;
  readonly providerOverride?: AiProviderType;
}
