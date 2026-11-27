/**
 * @file src/test/chat-stream.test.ts
 * @description Unit tests for chat scroll policy, run state derivation, and streaming message reducers.
 */

import { describe, expect, it } from "vitest";
import {
  AgentActivityKind,
  AgentChatRole,
  AgentRunLogLevel,
  AgentToolName,
  AgentToolStatus,
} from "@quant-ai/shared-types";
import type { ChatThreadMessage } from "@quant-ai/ui";
import {
  distanceFromBottom,
  isNearBottom,
  SCROLL_BOTTOM_THRESHOLD_PX,
} from "../features/chat/utils/scrollPolicy";
import {
  activityLabel,
  deriveRunState,
  formatDuration,
} from "../features/chat/utils/deriveRunState";
import {
  appendActivityReducer,
  appendLogReducer,
  appendReasoningReducer,
  appendTextReducer,
  updateActivityReducer,
} from "../features/chat/api/agentMessageReducers";

describe("scrollPolicy", () => {
  it("computes distanceFromBottom and isNearBottom against threshold", () => {
    expect(distanceFromBottom(1000, 500, 450)).toBe(50);
    expect(isNearBottom(1000, 500, 450)).toBe(true);
    expect(isNearBottom(1000, 400, 450)).toBe(false);
    expect(isNearBottom(1000, 1000 - 450 - SCROLL_BOTTOM_THRESHOLD_PX, 450)).toBe(true);
  });
});

describe("deriveRunState", () => {
  it("derives active, completed, and error states from activities", () => {
    const running = deriveRunState(
      [
        {
          tool: AgentToolName.LIVE_QUOTE,
          kind: AgentActivityKind.TOOL,
          status: AgentToolStatus.RUNNING,
          startedAt: 1000,
        },
      ],
      true,
    );
    expect(running.isActive).toBe(true);
    expect(running.isComplete).toBe(false);
    expect(running.currentTool).toBe(AgentToolName.LIVE_QUOTE);

    const done = deriveRunState(
      [
        {
          tool: AgentToolName.LIVE_QUOTE,
          kind: AgentActivityKind.TOOL,
          status: AgentToolStatus.SUCCESS,
          startedAt: 1000,
          completedAt: 1850,
        },
      ],
      false,
    );
    expect(done.isComplete).toBe(true);
    expect(done.durationMs).toBe(850);
    expect(formatDuration(850)).toBe("850ms");
    expect(formatDuration(2500)).toBe("2.5s");
    expect(
      activityLabel({
        tool: "phase:loading_context:0",
        kind: AgentActivityKind.PHASE,
        status: AgentToolStatus.RUNNING,
      }),
    ).toBe("Loading market context");
  });
});

describe("agentMessageReducers", () => {
  const base: ChatThreadMessage[] = [
    { id: 1, type: AgentChatRole.USER, text: "NIFTY setup?", time: "18:00" },
    { id: 2, type: AgentChatRole.ASSISTANT, text: "", time: "18:00", streaming: true },
  ];

  it("appends logs, reasoning, activities, and streamed tokens immutably", () => {
    let state = appendLogReducer(base, {
      id: "l1",
      elapsedMs: 5,
      level: AgentRunLogLevel.SYS,
      message: "Guardrails ok",
    });
    state = appendReasoningReducer(state, "Checking NIFTY");
    expect(state[1]?.reasoningStreaming).toBe(true);

    state = appendActivityReducer(state, {
      tool: AgentToolName.LIVE_QUOTE,
      kind: AgentActivityKind.TOOL,
      status: AgentToolStatus.RUNNING,
    });
    state = updateActivityReducer(state, AgentToolName.LIVE_QUOTE, {
      status: AgentToolStatus.SUCCESS,
      summary: "25,884.5",
    });
    state = appendTextReducer(state, "NIFTY is bullish.");

    expect(state[1]?.logs).toHaveLength(1);
    expect(state[1]?.activities?.[0]?.status).toBe(AgentToolStatus.SUCCESS);
    expect(state[1]?.reasoningStreaming).toBe(false);
    expect(state[1]?.text).toBe("NIFTY is bullish.");
  });
});
