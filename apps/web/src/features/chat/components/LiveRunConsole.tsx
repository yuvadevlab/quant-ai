/**
 * @file src/features/chat/components/LiveRunConsole.tsx
 * @description Real-time agent execution console powered by @quant-ai/ui Terminal.
 */

import { useMemo } from "react";
import { AgentRunLogLevel, type AgentRunLogEntry } from "@quant-ai/shared-types";
import { Terminal, TerminalEntryLevel, TerminalHeight, type TerminalEntry } from "@quant-ai/ui";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";

export interface LiveRunConsoleProps {
  readonly logs?: readonly AgentRunLogEntry[];
  readonly isStreaming?: boolean;
  readonly className?: string;
}

const LOG_LEVEL_MAP: Record<AgentRunLogLevel, TerminalEntryLevel> = {
  [AgentRunLogLevel.SYS]: TerminalEntryLevel.SYS,
  [AgentRunLogLevel.CTX]: TerminalEntryLevel.CTX,
  [AgentRunLogLevel.TOOL]: TerminalEntryLevel.TOOL,
  [AgentRunLogLevel.LLM]: TerminalEntryLevel.LLM,
  [AgentRunLogLevel.STREAM]: TerminalEntryLevel.INFO,
  [AgentRunLogLevel.ACTION]: TerminalEntryLevel.ACTION,
  [AgentRunLogLevel.DONE]: TerminalEntryLevel.DONE,
  [AgentRunLogLevel.ERR]: TerminalEntryLevel.ERR,
};

/**
 * Displays live server-streamed telemetry entries with elapsed timestamps and copy support.
 */
export function LiveRunConsole({ logs = [], isStreaming = false, className }: LiveRunConsoleProps) {
  const entries = useMemo<TerminalEntry[]>(
    () =>
      logs.map((log) => ({
        id: log.id,
        elapsedMs: log.elapsedMs,
        level: LOG_LEVEL_MAP[log.level] ?? TerminalEntryLevel.SYS,
        message: log.message,
        ...(log.detail ? { detail: log.detail } : {}),
      })),
    [logs],
  );

  return (
    <Terminal
      className={className}
      command={CHAT_COPY.LIVE_CONSOLE.TITLE}
      entries={entries}
      isStreaming={isStreaming}
      autoScroll
      emptyText={CHAT_COPY.LIVE_CONSOLE.EMPTY}
      height={TerminalHeight.MD}
      windowControls={false}
    />
  );
}
