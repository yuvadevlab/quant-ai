/**
 * @file apps/api/src/modules/chat/chat-stream.ts
 * @description Execution log tracker, tool-plan tag filter, parallel read-only tool batching, and SSE token streaming.
 */

import {
  AgentRunLogLevel,
  AgentStreamEventType,
  type AgentRunLogEntry,
  type AgentStreamEvent,
} from "@quant-ai/shared-types";
import type { ChatMessageResponse } from "./chat.types";

export type ChatStreamEmitter = (event: AgentStreamEvent) => void;

const TOKEN_STREAM_DELAY_MS = 10;
const TOOL_PLAN_REGEX = /<tool_plan>[\s\S]*?<\/tool_plan>/gi;
const PARTIAL_OPEN_TAG = "<tool_plan>";
const PARTIAL_CLOSE_TAG = "</tool_plan>";

/** Strips any `<tool_plan>...</tool_plan>` blocks from completed text. */
export function stripToolPlanTags(text: string): string {
  return text.replace(TOOL_PLAN_REGEX, "").trim();
}

/**
 * Stateful streaming filter that suppresses `<tool_plan>...</tool_plan>` blocks
 * from user-visible token/reasoning streams even when split across chunks.
 */
export class ToolPlanStreamFilter {
  private buffer = "";
  private insideTag = false;

  public push(chunk: string): string {
    this.buffer += chunk;
    let out = "";

    while (this.buffer.length > 0) {
      if (this.insideTag) {
        const closeIdx = this.buffer.toLowerCase().indexOf(PARTIAL_CLOSE_TAG);
        if (closeIdx === -1) {
          const keep = Math.min(this.buffer.length, PARTIAL_CLOSE_TAG.length - 1);
          this.buffer = this.buffer.slice(-keep);
          break;
        }
        this.buffer = this.buffer.slice(closeIdx + PARTIAL_CLOSE_TAG.length);
        this.insideTag = false;
      } else {
        const openIdx = this.buffer.toLowerCase().indexOf(PARTIAL_OPEN_TAG);
        if (openIdx === -1) {
          const safeLen = Math.max(0, this.buffer.length - (PARTIAL_OPEN_TAG.length - 1));
          if (safeLen > 0) {
            out += this.buffer.slice(0, safeLen);
            this.buffer = this.buffer.slice(safeLen);
          }
          break;
        }
        out += this.buffer.slice(0, openIdx);
        this.buffer = this.buffer.slice(openIdx + PARTIAL_OPEN_TAG.length);
        this.insideTag = true;
      }
    }
    return out;
  }

  public flush(): string {
    if (this.insideTag) {
      this.buffer = "";
      return "";
    }
    const remaining = this.buffer;
    this.buffer = "";
    return remaining;
  }
}

/** Descriptor for a tool invocation executed through `executeToolBatch`. */
export interface ToolBatchTask<TResult> {
  readonly tool: string;
  readonly label?: string;
  readonly detail?: string;
  readonly isReadOnly: boolean;
  readonly run: () => Promise<TResult>;
  readonly summarize?: (result: TResult) => { readonly ok: boolean; readonly summary: string };
}

/**
 * Executes a batch of tools: consecutive `isReadOnly: true` tasks run in parallel
 * via `Promise.all`, while mutating tasks run sequentially.
 */
export async function executeToolBatch<TResult>(
  tasks: readonly ToolBatchTask<TResult>[],
  emit: ChatStreamEmitter | undefined,
  signal?: AbortSignal,
): Promise<TResult[]> {
  const results: TResult[] = [];
  let idx = 0;

  const runSingle = async (task: ToolBatchTask<TResult>): Promise<TResult> => {
    if (signal?.aborted) {
      throw new Error("Stream aborted by client");
    }
    emit?.({
      type: AgentStreamEventType.TOOL_CALL,
      tool: task.tool,
      ...(task.label ? { label: task.label } : {}),
      ...(task.detail ? { detail: task.detail } : {}),
    });
    const res = await task.run();
    const status = task.summarize?.(res) ?? { ok: true, summary: "Completed" };
    emit?.({
      type: AgentStreamEventType.TOOL_RESULT,
      tool: task.tool,
      ok: status.ok,
      summary: status.summary,
      ...(task.label ? { label: task.label } : {}),
    });
    return res;
  };

  while (idx < tasks.length) {
    const current = tasks[idx];
    if (!current.isReadOnly) {
      results.push(await runSingle(current));
      idx++;
      continue;
    }

    const parallelGroup: ToolBatchTask<TResult>[] = [];
    while (idx < tasks.length && tasks[idx].isReadOnly) {
      parallelGroup.push(tasks[idx]);
      idx++;
    }
    const groupResults = await Promise.all(parallelGroup.map((task) => runSingle(task)));
    results.push(...groupResults);
  }

  return results;
}

export interface ChatRunTracker {
  readonly logs: AgentRunLogEntry[];
  readonly emit: ChatStreamEmitter | undefined;
  readonly log: (level: AgentRunLogLevel, message: string, detail?: string) => void;
  readonly streamReasoning: (text: string) => Promise<void>;
  readonly streamTokens: (reply: string) => Promise<void>;
}

/** Creates a per-request execution log tracker and SSE event emitter. */
export function createChatRunTracker(
  emit?: ChatStreamEmitter,
  signal?: AbortSignal,
): ChatRunTracker {
  const startedAt = Date.now();
  const logs: AgentRunLogEntry[] = [];
  let seq = 0;

  const log = (level: AgentRunLogLevel, message: string, detail?: string): void => {
    const entry: AgentRunLogEntry = {
      id: `log-${startedAt}-${++seq}`,
      elapsedMs: Date.now() - startedAt,
      level,
      message,
      ...(detail ? { detail } : {}),
    };
    logs.push(entry);
    emit?.({ type: AgentStreamEventType.LOG, level, message, detail, entry });
  };

  const streamText = async (
    text: string,
    eventType: AgentStreamEventType.REASONING | AgentStreamEventType.TOKEN,
    delayMs: number,
  ): Promise<void> => {
    if (!emit || !text) return;
    const filter = new ToolPlanStreamFilter();
    const chunks = text.match(/\S+\s*/g) ?? [text];
    const batchSize = chunks.length > 160 ? 5 : 3;
    for (let i = 0; i < chunks.length; i += batchSize) {
      if (signal?.aborted) return;
      const visible = filter.push(chunks.slice(i, i + batchSize).join(""));
      if (visible) {
        emit({ type: eventType, content: visible });
      }
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    const tail = filter.flush();
    if (tail && !signal?.aborted) {
      emit({ type: eventType, content: tail });
    }
  };

  return {
    logs,
    emit,
    log,
    streamReasoning: (text) => streamText(text, AgentStreamEventType.REASONING, 6),
    streamTokens: (reply) => streamText(reply, AgentStreamEventType.TOKEN, TOKEN_STREAM_DELAY_MS),
  };
}

/** Helper to build a final ChatMessageResponse with execution logs attached. */
export function withExecutionLogs(
  response: Omit<ChatMessageResponse, "logs">,
  tracker: ChatRunTracker,
): ChatMessageResponse {
  return {
    ...response,
    logs: tracker.logs,
  };
}
