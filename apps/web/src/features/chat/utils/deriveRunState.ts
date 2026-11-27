/**
 * @file src/features/chat/utils/deriveRunState.ts
 * @description Derives aggregate run state and user-safe activity labels from streamed agent activities.
 */

import {
  AgentActivityKind,
  AgentToolName,
  AgentToolStatus,
  type AgentActivity,
} from "@quant-ai/shared-types";

export interface RunState {
  readonly isActive: boolean;
  readonly isComplete: boolean;
  readonly hasError: boolean;
  readonly completedCount: number;
  readonly totalCount: number;
  readonly currentTool: string | null;
  readonly statusLabel: string;
  readonly durationMs: number | null;
}

const TOOL_LABELS: Record<string, string> = {
  [AgentToolName.RISK_GUARDRAIL]: "Evaluating risk & domain guardrails",
  [AgentToolName.CONTEXT_HISTORY]: "Loading conversation context",
  [AgentToolName.SYMBOL_RESOLVER]: "Resolving market instrument",
  [AgentToolName.LIVE_QUOTE]: "Fetching live market telemetry",
  [AgentToolName.OPTION_CHAIN]: "Analyzing option chain & OI structure",
  [AgentToolName.PREDICTION_SETUP]: "Resolving multi-agent prediction setup",
  [AgentToolName.LLM_SYNTHESIS]: "Synthesizing quantitative thesis",
};

/** Resolves a user-friendly label for an activity entry. */
export function activityLabel(activity: AgentActivity): string {
  if (activity.label) return activity.label;
  if (activity.kind === AgentActivityKind.APPROVAL) return "Waiting for confirmation";
  if (activity.kind === AgentActivityKind.PHASE) {
    if (activity.tool.startsWith("phase:agent_started")) return "Understanding your question";
    if (activity.tool.startsWith("phase:loading_context")) return "Loading market context";
    const match = activity.tool.match(/^phase:model_turn:(\d+)/);
    if (match) {
      return Number(match[1]) <= 1 ? "Synthesizing market thesis" : "Refining quantitative step";
    }
    return "Working";
  }
  return TOOL_LABELS[activity.tool] ?? "Running market tool";
}

/** Formats millisecond durations into human-readable strings (e.g. 800ms, 4.5s). */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return `${min}m ${sec}s`;
}

/** Truthful standby label shown while SSE stream is open between steps or during token output. */
export function standbyLabel(hasText: boolean): string {
  return hasText ? "Streaming your answer" : "QuantAI is analyzing";
}

/** Computes aggregate RunState from an assistant turn's accumulated activities. */
export function deriveRunState(
  activities: readonly AgentActivity[] = [],
  isStreaming = false,
): RunState {
  const totalCount = activities.length;
  const completedCount = activities.filter(
    (a) => a.status === AgentToolStatus.SUCCESS || a.status === AgentToolStatus.ERROR,
  ).length;
  const hasError = activities.some((a) => a.status === AgentToolStatus.ERROR);
  const running = [...activities].reverse().find((a) => a.status === AgentToolStatus.RUNNING);
  const isActive = Boolean(running) || isStreaming;
  const isComplete = !isStreaming && totalCount > 0 && completedCount === totalCount;

  const starts = activities.map((a) => a.startedAt).filter((v): v is number => v !== undefined);
  const ends = activities.map((a) => a.completedAt).filter((v): v is number => v !== undefined);
  const durationMs =
    starts.length > 0 && ends.length > 0 ? Math.max(...ends) - Math.min(...starts) : null;

  return {
    isActive,
    isComplete,
    hasError,
    completedCount,
    totalCount,
    currentTool: running?.tool ?? null,
    statusLabel: running ? activityLabel(running) : standbyLabel(false),
    durationMs,
  };
}
