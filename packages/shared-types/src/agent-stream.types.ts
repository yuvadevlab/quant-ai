/**
 * @file packages/shared-types/src/agent-stream.types.ts
 * @description Strongly typed SSE event contracts for AI Strategist streaming runs.
 */

import {
  AgentActivityKind,
  AgentMode,
  AgentRunLogLevel,
  AgentStreamEventType,
  AgentToolStatus,
  ExecutionPhase,
  PhaseStatus,
} from "./agent-stream.enums";

/** Structured telemetry log entry emitted during an agent run. */
export interface AgentRunLogEntry {
  readonly id: string;
  readonly elapsedMs: number;
  readonly level: AgentRunLogLevel;
  readonly message: string;
  readonly detail?: string;
}

/** Individual step or tool execution record in the ActivityTimeline. */
export interface AgentActivity {
  readonly tool: string;
  readonly kind: AgentActivityKind;
  readonly status: AgentToolStatus;
  readonly label?: string;
  readonly detail?: string;
  readonly summary?: string;
  readonly startedAt?: number;
  readonly completedAt?: number;
}

/** Discriminated union of all SSE events emitted by the QuantAI Agent stream. */
export type AgentStreamEvent =
  | { readonly type: AgentStreamEventType.RUN; readonly runId: string }
  | { readonly type: AgentStreamEventType.CONVERSATION; readonly conversationId: string }
  | { readonly type: AgentStreamEventType.MODE; readonly mode: AgentMode }
  | {
      readonly type: AgentStreamEventType.PHASE;
      readonly phase: ExecutionPhase;
      readonly status: PhaseStatus;
      readonly turn?: number;
      readonly pendingAction?: boolean;
      readonly toolCalls?: number;
    }
  | {
      readonly type: AgentStreamEventType.LOG;
      readonly level: AgentRunLogLevel;
      readonly message: string;
      readonly detail?: string;
      readonly entry?: AgentRunLogEntry;
    }
  | { readonly type: AgentStreamEventType.REASONING; readonly content: string }
  | {
      readonly type: AgentStreamEventType.TOOL_CALL;
      readonly tool: string;
      readonly label?: string;
      readonly detail?: string;
    }
  | {
      readonly type: AgentStreamEventType.TOOL_RESULT;
      readonly tool: string;
      readonly ok: boolean;
      readonly summary?: string;
      readonly label?: string;
    }
  | { readonly type: AgentStreamEventType.TOKEN; readonly content: string }
  | { readonly type: AgentStreamEventType.TOKEN_REPLACE; readonly content: string }
  | { readonly type: AgentStreamEventType.SUGGESTIONS; readonly suggestions: readonly string[] }
  | { readonly type: AgentStreamEventType.COMPLETE; readonly payload: Record<string, unknown> }
  | { readonly type: AgentStreamEventType.ERROR; readonly error: string; readonly code?: string }
  | { readonly type: AgentStreamEventType.DONE };
