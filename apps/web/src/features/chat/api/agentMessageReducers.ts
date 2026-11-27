/**
 * @file src/features/chat/api/agentMessageReducers.ts
 * @description Pure immutable reducers for streaming assistant messages, logs, reasoning, and activities.
 */

import {
  AgentChatRole,
  AgentMode,
  AgentToolStatus,
  type AgentActivity,
  type AgentRunLogEntry,
} from "@quant-ai/shared-types";
import type { ChatThreadMessage } from "@quant-ai/ui";
import type { ChatReplyPayload } from "./sendChatMessage";

function patchLastAssistant(
  prev: ChatThreadMessage[],
  updater: (last: ChatThreadMessage) => ChatThreadMessage,
): ChatThreadMessage[] {
  if (prev.length === 0) return prev;
  const copy = [...prev];
  const last = copy[copy.length - 1];
  if (!last || last.type !== AgentChatRole.ASSISTANT) return prev;
  copy[copy.length - 1] = updater(last);
  return copy;
}

export function appendLogReducer(
  prev: ChatThreadMessage[],
  log: AgentRunLogEntry,
): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({ ...last, logs: [...(last.logs ?? []), log] }));
}

export function setModeReducer(prev: ChatThreadMessage[], mode: AgentMode): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({ ...last, mode }));
}

export function appendReasoningReducer(
  prev: ChatThreadMessage[],
  content: string,
): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({
    ...last,
    reasoning: (last.reasoning ?? "") + content,
    reasoningStreaming: true,
    reasoningStartedAt: last.reasoningStartedAt ?? Date.now(),
  }));
}

export function appendTextReducer(prev: ChatThreadMessage[], content: string): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({
    ...last,
    text: last.text + content,
    reasoningStreaming: false,
    reasoningCompletedAt:
      last.reasoningStreaming && !last.reasoningCompletedAt
        ? Date.now()
        : last.reasoningCompletedAt,
  }));
}

export function replaceTextReducer(
  prev: ChatThreadMessage[],
  content: string,
): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({
    ...last,
    text: content,
    reasoningStreaming: false,
  }));
}

export function appendActivityReducer(
  prev: ChatThreadMessage[],
  activity: AgentActivity,
): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({
    ...last,
    activities: [...(last.activities ?? []), { ...activity, startedAt: Date.now() }],
  }));
}

export function updateActivityReducer(
  prev: ChatThreadMessage[],
  tool: string,
  patch: Partial<AgentActivity>,
): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => {
    const activities = [...(last.activities ?? [])];
    for (let i = activities.length - 1; i >= 0; i--) {
      const current = activities[i];
      if (current && current.tool === tool) {
        const isCompleting =
          current.status === AgentToolStatus.RUNNING &&
          patch.status &&
          patch.status !== AgentToolStatus.RUNNING;
        activities[i] = {
          ...current,
          ...patch,
          ...(isCompleting && !current.completedAt ? { completedAt: Date.now() } : {}),
        };
        break;
      }
    }
    return { ...last, activities };
  });
}

export function setSuggestionsReducer(
  prev: ChatThreadMessage[],
  suggestions: readonly string[],
): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({ ...last, followUps: suggestions }));
}

export function applyCompleteReducer(
  prev: ChatThreadMessage[],
  payload: ChatReplyPayload,
  fallbackSignal?: ChatThreadMessage["signalData"],
): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({
    ...last,
    text: payload.reply || last.text,
    streaming: false,
    reasoningStreaming: false,
    reasoningCompletedAt: last.reasoningCompletedAt ?? Date.now(),
    hasSignal: Boolean(payload.signalData) || Boolean(fallbackSignal),
    ...(payload.logs && payload.logs.length > 0 ? { logs: payload.logs } : {}),
    ...(payload.signalData ? { signalData: payload.signalData } : {}),
    ...(payload.followUps ? { followUps: payload.followUps } : {}),
    ...(payload.agentPerspective?.role ? { agentRole: payload.agentPerspective.role } : {}),
  }));
}

export function failStreamReducer(prev: ChatThreadMessage[], error: string): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({
    ...last,
    error,
    streaming: false,
    reasoningStreaming: false,
  }));
}

export function endStreamReducer(prev: ChatThreadMessage[]): ChatThreadMessage[] {
  return patchLastAssistant(prev, (last) => ({
    ...last,
    streaming: false,
    reasoningStreaming: false,
    reasoningCompletedAt:
      last.reasoningStreaming && !last.reasoningCompletedAt
        ? Date.now()
        : last.reasoningCompletedAt,
  }));
}
