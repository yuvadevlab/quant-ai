/**
 * @file packages/ui/src/components/ChatExecutionConsole.tsx
 * @description Collapsible live execution log console powered by @yuva-devlab/ui Terminal.
 */

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Terminal as TerminalIcon } from "lucide-react";
import { Terminal, TerminalEntryLevel, TerminalHeight, type TerminalEntry } from "../index";
import type { ChatExecutionLogEntry } from "../types";

export interface ChatExecutionConsoleProps {
  readonly logs: readonly ChatExecutionLogEntry[];
  readonly isStreaming?: boolean;
  readonly title?: string;
  readonly streamingLabel?: string;
  readonly completedLabel?: string;
}

function mapLogLevel(level: string): TerminalEntryLevel {
  switch (level.toUpperCase()) {
    case "SYS":
      return TerminalEntryLevel.SYS;
    case "CTX":
      return TerminalEntryLevel.CTX;
    case "TOOL":
      return TerminalEntryLevel.TOOL;
    case "LLM":
      return TerminalEntryLevel.LLM;
    case "DONE":
      return TerminalEntryLevel.DONE;
    case "ERR":
      return TerminalEntryLevel.ERR;
    default:
      return TerminalEntryLevel.INFO;
  }
}

/**
 * Collapsible execution log console that auto-expands while streaming and
 * collapses into a compact summary once synthesis completes.
 */
export function ChatExecutionConsole({
  logs,
  isStreaming = false,
  title = "Live Execution Trace",
  streamingLabel = "Running",
  completedLabel = "steps",
}: ChatExecutionConsoleProps): React.ReactElement | null {
  const [expanded, setExpanded] = useState<boolean>(isStreaming);

  useEffect(() => {
    setExpanded(isStreaming);
  }, [isStreaming]);

  const entries = useMemo<TerminalEntry[]>(
    () =>
      logs.map((entry) => ({
        id: entry.id,
        timestamp: `${(entry.elapsedMs / 1000).toFixed(2)}s`,
        level: mapLogLevel(entry.level),
        message: entry.detail ? `${entry.message} — ${entry.detail}` : entry.message,
      })),
    [logs],
  );

  if (logs.length === 0) return null;

  const latest = logs[logs.length - 1];
  const durationSec = ((latest?.elapsedMs ?? 0) / 1000).toFixed(2);

  return (
    <div className={`chat-exec-console ${isStreaming ? "is-streaming" : ""}`}>
      <button
        type="button"
        className="chat-exec-header"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span className="chat-exec-header-left">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <TerminalIcon size={13} className="chat-exec-icon" />
          <span className="chat-exec-title">{title}</span>
          <span className={`chat-exec-badge ${isStreaming ? "is-live" : ""}`}>
            {isStreaming ? streamingLabel : `${logs.length} ${completedLabel} · ${durationSec}s`}
          </span>
        </span>
        {!expanded && latest && <span className="chat-exec-summary">{latest.message}</span>}
      </button>

      {expanded && (
        <div className="chat-exec-body">
          <Terminal
            entries={entries}
            isStreaming={isStreaming}
            autoScroll
            height={TerminalHeight.SM}
            windowControls={false}
          />
        </div>
      )}
    </div>
  );
}
