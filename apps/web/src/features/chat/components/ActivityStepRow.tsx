/**
 * @file src/features/chat/components/ActivityStepRow.tsx
 * @description Individual execution step row with contextual Lucide icons, Shimmer, and duration.
 */

import {
  BarChart3,
  Brain,
  Check,
  Database,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";
import {
  AgentActivityKind,
  AgentToolName,
  AgentToolStatus,
  type AgentActivity,
} from "@quant-ai/shared-types";
import { Shimmer, cn } from "@quant-ai/ui";
import { activityLabel, formatDuration } from "../utils/deriveRunState";

export interface ActivityStepRowProps {
  readonly activity: AgentActivity;
  readonly expanded?: boolean;
  readonly isCurrent?: boolean;
}

function StepContextIcon({ activity }: { readonly activity: AgentActivity }) {
  const cls = "qt-timeline-header-icon qt-timeline-header-icon--pending";
  if (activity.kind === AgentActivityKind.APPROVAL) {
    return <ShieldCheck className={cls} aria-hidden="true" />;
  }
  if (activity.kind === AgentActivityKind.PHASE) {
    if (activity.tool.startsWith("phase:loading_context")) {
      return <Database className={cls} aria-hidden="true" />;
    }
    return <Brain className={cls} aria-hidden="true" />;
  }
  switch (activity.tool) {
    case AgentToolName.LIVE_QUOTE:
    case AgentToolName.OPTION_CHAIN:
      return <TrendingUp className={cls} aria-hidden="true" />;
    case AgentToolName.PREDICTION_SETUP:
      return <BarChart3 className={cls} aria-hidden="true" />;
    case AgentToolName.RISK_GUARDRAIL:
      return <ShieldCheck className={cls} aria-hidden="true" />;
    default:
      return <Wrench className={cls} aria-hidden="true" />;
  }
}

function StatusIcon({ activity }: { readonly activity: AgentActivity }) {
  if (activity.status === AgentToolStatus.SUCCESS) {
    return (
      <Check
        className="qt-timeline-header-icon qt-timeline-header-icon--muted"
        aria-hidden="true"
      />
    );
  }
  if (activity.status === AgentToolStatus.RUNNING) {
    return (
      <Loader2
        className="qt-timeline-header-icon qt-timeline-header-icon--streaming qt-icon-spin"
        aria-hidden="true"
      />
    );
  }
  if (activity.status === AgentToolStatus.ERROR) {
    return (
      <X className="qt-timeline-header-icon qt-timeline-header-icon--error" aria-hidden="true" />
    );
  }
  return <StepContextIcon activity={activity} />;
}

/** One row of the live activity stream. */
export function ActivityStepRow({
  activity,
  expanded = false,
  isCurrent = false,
}: ActivityStepRowProps) {
  const duration =
    activity.startedAt && activity.completedAt
      ? formatDuration(activity.completedAt - activity.startedAt)
      : null;
  const detail = activity.summary ?? activity.detail;
  const label = activityLabel(activity);

  return (
    <li
      className={cn("qt-timeline-item", isCurrent && "is-current")}
      aria-current={isCurrent ? "step" : undefined}
    >
      <span className="qt-timeline-status-icon-box">
        <StatusIcon activity={activity} />
      </span>
      <span className="qt-timeline-item-content">
        <span
          className={cn(
            "qt-timeline-item-title",
            activity.status === AgentToolStatus.RUNNING && "qt-timeline-item-title--running",
            activity.status === AgentToolStatus.SUCCESS && "qt-timeline-item-title--success",
            activity.status === AgentToolStatus.ERROR && "qt-timeline-item-title--error",
            activity.status === AgentToolStatus.PENDING && "qt-timeline-item-title--pending",
          )}
        >
          {activity.status === AgentToolStatus.RUNNING ? <Shimmer>{label}</Shimmer> : label}
        </span>
        {detail && <span className="qt-timeline-item-detail">{detail}</span>}
      </span>
      {expanded && duration && <span className="qt-timeline-item-duration">{duration}</span>}
    </li>
  );
}
