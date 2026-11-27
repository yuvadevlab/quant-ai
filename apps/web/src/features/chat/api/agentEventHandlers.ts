/**
 * @file src/features/chat/api/agentEventHandlers.ts
 * @description Maps incoming AgentStreamEvent SSE frames onto frontend state ports.
 */

import {
  AgentActivityKind,
  AgentMode,
  AgentRunLogLevel,
  AgentStreamEventType,
  AgentToolStatus,
  ExecutionPhase,
  PhaseStatus,
  type AgentActivity,
  type AgentRunLogEntry,
  type AgentStreamEvent,
} from "@quant-ai/shared-types";
import type { ChatReplyPayload } from "./sendChatMessage";

let runStartTime = Date.now();
let logSeq = 0;

/** Resets the relative timestamp clock at the start of each SSE run. */
export function resetRunStartTime(): void {
  runStartTime = Date.now();
  logSeq = 0;
}

/** Creates a client-side telemetry log entry when synthesizing phase/tool logs. */
export function makeLog(
  level: AgentRunLogLevel,
  message: string,
  detail?: string,
): AgentRunLogEntry {
  return {
    id: `clog-${runStartTime}-${++logSeq}`,
    elapsedMs: Date.now() - runStartTime,
    level,
    message,
    ...(detail ? { detail } : {}),
  };
}

/** Canonical activity key for an execution phase event. */
export function phaseKey(phase: ExecutionPhase, turn?: number, pendingAction?: boolean): string {
  const base = `phase:${phase}:${turn ?? 0}`;
  return pendingAction ? `${base}:pending` : base;
}

/** Port interface bridging SSE events to React state reducers. */
export interface AgentEventPort {
  readonly onConversation: (conversationId: string) => void;
  readonly onMode?: (mode: AgentMode) => void;
  readonly appendLog: (log: AgentRunLogEntry) => void;
  readonly appendReasoning: (content: string) => void;
  readonly appendText: (content: string) => void;
  readonly replaceText: (content: string) => void;
  readonly appendActivity: (activity: AgentActivity) => void;
  readonly updateActivity: (tool: string, patch: Partial<AgentActivity>) => void;
  readonly setSuggestions: (suggestions: readonly string[]) => void;
  readonly onComplete: (payload: ChatReplyPayload) => void;
  readonly failStream: (error: string) => void;
  readonly endStream: () => void;
}

/** Reduces a single SSE event into `AgentEventPort`. Returns true when the stream terminates. */
export function handleAgentStreamEvent(event: AgentStreamEvent, port: AgentEventPort): boolean {
  switch (event.type) {
    case AgentStreamEventType.CONVERSATION:
      port.onConversation(event.conversationId);
      return false;

    case AgentStreamEventType.RUN:
      resetRunStartTime();
      port.appendLog(
        makeLog(AgentRunLogLevel.SYS, `Agent run initialized: ${event.runId.slice(0, 8)}`),
      );
      port.appendActivity({
        tool: "phase:agent_started",
        kind: AgentActivityKind.PHASE,
        status: AgentToolStatus.RUNNING,
      });
      return false;

    case AgentStreamEventType.MODE:
      port.appendLog(
        makeLog(
          AgentRunLogLevel.SYS,
          event.mode === AgentMode.AGENT
            ? "Agent mode — live market tools enabled"
            : "Advisor mode — quantitative fast reply",
        ),
      );
      port.onMode?.(event.mode);
      return false;

    case AgentStreamEventType.LOG:
      port.appendLog(event.entry ?? makeLog(event.level, event.message, event.detail));
      return false;

    case AgentStreamEventType.REASONING:
      port.appendReasoning(event.content);
      return false;

    case AgentStreamEventType.TOKEN:
      port.appendText(event.content);
      return false;

    case AgentStreamEventType.TOKEN_REPLACE:
      port.replaceText(event.content);
      return false;

    case AgentStreamEventType.PHASE: {
      const key = phaseKey(event.phase, event.turn, event.pendingAction);
      if (event.status === PhaseStatus.START) {
        if (event.phase === ExecutionPhase.LOADING_CONTEXT) {
          port.updateActivity("phase:agent_started", { status: AgentToolStatus.SUCCESS });
        }
        port.appendActivity({
          tool: key,
          kind: AgentActivityKind.PHASE,
          status: AgentToolStatus.RUNNING,
        });
      } else {
        const detail =
          event.toolCalls !== undefined
            ? event.toolCalls === 0
              ? "Prepared quantitative response"
              : `Executed ${event.toolCalls} tool${event.toolCalls === 1 ? "" : "s"}`
            : undefined;
        port.updateActivity(key, {
          status: AgentToolStatus.SUCCESS,
          ...(detail ? { detail } : {}),
        });
      }
      return false;
    }

    case AgentStreamEventType.TOOL_CALL:
      port.appendLog(makeLog(AgentRunLogLevel.TOOL, `Invoking ${event.tool}...`, event.detail));
      port.appendActivity({
        tool: event.tool,
        kind: AgentActivityKind.TOOL,
        status: AgentToolStatus.RUNNING,
        ...(event.label ? { label: event.label } : {}),
      });
      return false;

    case AgentStreamEventType.TOOL_RESULT:
      port.appendLog(
        makeLog(
          AgentRunLogLevel.TOOL,
          `${event.tool} ${event.ok ? "✓" : "✕"}`,
          event.summary ?? (event.ok ? "Completed" : "Error"),
        ),
      );
      port.updateActivity(event.tool, {
        status: event.ok ? AgentToolStatus.SUCCESS : AgentToolStatus.ERROR,
        ...(event.summary ? { summary: event.summary } : {}),
        ...(event.label ? { label: event.label } : {}),
      });
      return false;

    case AgentStreamEventType.SUGGESTIONS:
      port.setSuggestions(event.suggestions);
      return false;

    case AgentStreamEventType.COMPLETE:
      port.onComplete(event.payload as unknown as ChatReplyPayload);
      return false;

    case AgentStreamEventType.ERROR:
      port.appendLog(makeLog(AgentRunLogLevel.ERR, event.error));
      port.failStream(event.error);
      return true;

    case AgentStreamEventType.DONE:
      port.endStream();
      return true;
  }
}
