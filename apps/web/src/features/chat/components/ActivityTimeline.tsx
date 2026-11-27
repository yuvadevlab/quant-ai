/**
 * @file src/features/chat/components/ActivityTimeline.tsx
 * @description Unified Copilot-style thinking, steps, and live console block for AI Strategist.
 */

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  ListTree,
  Loader2,
  Sparkles,
  Terminal as TerminalIcon,
} from "lucide-react";
import {
  AgentActivityKind,
  AgentToolStatus,
  type AgentActivity,
  type AgentRunLogEntry,
} from "@quant-ai/shared-types";
import { Shimmer, cn } from "@quant-ai/ui";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";
import { deriveRunState, formatDuration, standbyLabel } from "../utils/deriveRunState";
import { ActivityStepRow } from "./ActivityStepRow";
import { LiveRunConsole } from "./LiveRunConsole";

const COLLAPSED_ROWS = 3;

export interface ActivityTimelineProps {
  readonly activities?: readonly AgentActivity[] | undefined;
  readonly logs?: readonly AgentRunLogEntry[] | undefined;
  readonly reasoning?: string | undefined;
  readonly reasoningStreaming?: boolean | undefined;
  readonly reasoningStartedAt?: number | undefined;
  readonly reasoningCompletedAt?: number | undefined;
  readonly isStreaming: boolean;
  readonly hasText?: boolean | undefined;
}

/**
 * Unified Copilot-style execution & reasoning timeline.
 * Combines live shimmer status, reasoning block, step list, and Terminal live console.
 */
export function ActivityTimeline({
  activities = [],
  logs = [],
  reasoning = "",
  reasoningStreaming = false,
  reasoningStartedAt,
  reasoningCompletedAt,
  isStreaming,
  hasText = false,
}: ActivityTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"steps" | "logs">("steps");
  const reasoningScrollRef = useRef<HTMLDivElement>(null);
  const state = deriveRunState(activities, isStreaming);

  useEffect(() => {
    if (reasoningStreaming && reasoningScrollRef.current) {
      reasoningScrollRef.current.scrollTop = reasoningScrollRef.current.scrollHeight;
    }
  }, [reasoning, reasoningStreaming]);

  const hasError = state.hasError;
  const hasRunningRow = activities.some((a) => a.status === AgentToolStatus.RUNNING);
  const latestLog = logs[logs.length - 1];

  const standby: AgentActivity | null =
    isStreaming && !expanded && !hasRunningRow && activities.length > 0
      ? {
          tool: "phase:standby",
          kind: AgentActivityKind.PHASE,
          status: AgentToolStatus.RUNNING,
          label: standbyLabel(hasText),
        }
      : null;

  const showRows = expanded || isStreaming;
  const visible = expanded
    ? activities
    : standby
      ? [...activities.slice(-(COLLAPSED_ROWS - 1)), standby]
      : activities.slice(-COLLAPSED_ROWS);
  const currentKey = state.currentTool;

  const copy = CHAT_COPY.ACTIVITY_TIMELINE;
  const headerTitle = expanded
    ? copy.HEADER_TITLE
    : isStreaming
      ? (latestLog?.message ?? copy.THINKING)
      : hasError
        ? copy.ISSUES
        : copy.ANALYZED;

  const summaryMeta =
    !expanded && !isStreaming
      ? [
          state.totalCount > 0 ? copy.STEP_COUNT(state.totalCount) : null,
          state.durationMs != null && state.durationMs > 0
            ? formatDuration(state.durationMs)
            : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null;

  return (
    <div className={cn("qt-timeline", isStreaming && "is-streaming")}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="qt-timeline-header"
      >
        {expanded ? (
          <ChevronUp
            className="qt-timeline-header-icon qt-timeline-header-icon--muted"
            aria-hidden="true"
          />
        ) : isStreaming ? (
          <Sparkles
            className="qt-timeline-header-icon qt-timeline-header-icon--streaming"
            aria-hidden="true"
          />
        ) : hasError ? (
          <AlertTriangle
            className="qt-timeline-header-icon qt-timeline-header-icon--error"
            aria-hidden="true"
          />
        ) : (
          <Check
            className="qt-timeline-header-icon qt-timeline-header-icon--success"
            aria-hidden="true"
          />
        )}
        <span className="qt-timeline-header-content" aria-live="polite">
          <span
            className={cn(
              "qt-timeline-header-title",
              isStreaming ? "qt-timeline-header-title--active" : "qt-timeline-header-title--idle",
            )}
          >
            {isStreaming ? <Shimmer>{headerTitle}</Shimmer> : headerTitle}
          </span>
          {summaryMeta && <span className="qt-timeline-header-meta">{summaryMeta}</span>}
        </span>
        {isStreaming && !expanded && (
          <Loader2
            className="qt-timeline-header-icon qt-timeline-header-icon--streaming qt-icon-spin"
            aria-hidden="true"
          />
        )}
        <span className="qt-timeline-header-toggle">
          {expanded ? copy.HIDE_DETAILS : copy.SHOW_DETAILS}
          <ChevronDown
            className={cn("qt-timeline-header-chevron", expanded && "is-open")}
            aria-hidden="true"
          />
        </span>
      </button>

      {expanded && (
        <div className="qt-timeline-nav">
          <div className="qt-timeline-nav-tabs">
            <button
              type="button"
              onClick={() => setViewMode("steps")}
              className={cn("qt-timeline-nav-tab", viewMode === "steps" && "is-active")}
            >
              <ListTree className="qt-timeline-nav-tab-icon" />
              <span>
                {copy.STEPS_TAB} ({activities.length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("logs")}
              className={cn("qt-timeline-nav-tab", viewMode === "logs" && "is-active")}
            >
              <TerminalIcon className="qt-timeline-nav-tab-icon" />
              <span>{copy.LIVE_CONSOLE_TAB}</span>
              {logs.length > 0 && <span className="qt-timeline-log-count">({logs.length})</span>}
              {isStreaming && <span className="qt-timeline-ping-dot" />}
            </button>
          </div>
          <span className="qt-timeline-status-text">
            {isStreaming ? copy.STREAM_ACTIVE : copy.COMPLETE}
          </span>
        </div>
      )}

      {showRows && (
        <>
          {expanded && viewMode === "logs" ? (
            <div className="qt-timeline-console-wrap">
              <LiveRunConsole logs={logs} isStreaming={isStreaming} />
            </div>
          ) : (
            <div className="qt-timeline-body">
              {reasoning && (isStreaming || expanded) && (
                <div
                  ref={reasoningScrollRef}
                  className={cn("qt-timeline-reasoning", isStreaming && "is-streaming")}
                >
                  <div className="qt-timeline-reasoning-label">
                    <Brain className="qt-timeline-reasoning-icon" aria-hidden="true" />
                    <span>
                      {reasoningStreaming ? (
                        <Shimmer>{latestLog?.message || state.statusLabel}</Shimmer>
                      ) : reasoningStartedAt && reasoningCompletedAt ? (
                        `Thought for ${formatDuration(reasoningCompletedAt - reasoningStartedAt)}`
                      ) : (
                        `Thought process · ${reasoning.trim().split(/\s+/).length} words`
                      )}
                    </span>
                  </div>
                  <p className="qt-timeline-reasoning-text">{reasoning}</p>
                </div>
              )}

              {visible.length > 0 && (
                <ul aria-label={copy.EXECUTION_STEPS} className="qt-timeline-list is-bordered">
                  {visible.map((activity, index) => (
                    <ActivityStepRow
                      key={`${activity.tool}-${index}`}
                      activity={activity}
                      expanded={expanded}
                      isCurrent={
                        !expanded &&
                        activity.status === AgentToolStatus.RUNNING &&
                        (activity.tool === currentKey || activity.tool === "phase:standby")
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
