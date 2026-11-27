/**
 * @file packages/shared-types/src/agent-stream.enums.ts
 * @description Enum-first SSE protocol, execution phase, log level, and activity status definitions.
 */

/** Canonical SSE event types emitted by the AI Strategist agent stream. */
export enum AgentStreamEventType {
  RUN = "run",
  CONVERSATION = "conversation",
  MODE = "mode",
  PHASE = "phase",
  LOG = "log",
  REASONING = "reasoning",
  TOOL_CALL = "tool_call",
  TOOL_RESULT = "tool_result",
  TOKEN = "token",
  TOKEN_REPLACE = "token_replace",
  SUGGESTIONS = "suggestions",
  COMPLETE = "complete",
  ERROR = "error",
  DONE = "done",
}

/** High-level execution phases within an agent turn. */
export enum ExecutionPhase {
  LOADING_CONTEXT = "loading_context",
  MODEL_TURN = "model_turn",
  TOOL_EXECUTION = "tool_execution",
}

/** Lifecycle status for an execution phase boundary event. */
export enum PhaseStatus {
  START = "start",
  END = "end",
}

/** Real-time telemetry log entry severity / category levels. */
export enum AgentRunLogLevel {
  SYS = "SYS",
  CTX = "CTX",
  TOOL = "TOOL",
  LLM = "LLM",
  STREAM = "STREAM",
  ACTION = "ACTION",
  DONE = "DONE",
  ERR = "ERR",
}

/** Lifecycle status of an individual tool call or execution step. */
export enum AgentToolStatus {
  PENDING = "pending",
  RUNNING = "running",
  SUCCESS = "success",
  ERROR = "error",
}

/** Confirmation card lifecycle status. */
export enum AgentConfirmationStatus {
  PENDING = "pending",
  EXECUTED = "executed",
  REJECTED = "rejected",
  FAILED = "failed",
}

/** Kind of activity step rendered in the timeline. */
export enum AgentActivityKind {
  TOOL = "tool",
  PHASE = "phase",
  APPROVAL = "approval",
}

/** Operating mode resolved for a given turn. */
export enum AgentMode {
  AGENT = "agent",
  ADVISOR = "advisor",
}

/** Conversation participant roles. */
export enum AgentChatRole {
  USER = "user",
  ASSISTANT = "assistant",
}

/** Canonical QuantAI domain tool identifiers. */
export enum AgentToolName {
  RISK_GUARDRAIL = "risk.guardrail",
  CONTEXT_HISTORY = "context.history",
  SYMBOL_RESOLVER = "market.resolveSymbol",
  LIVE_QUOTE = "market.liveQuote",
  OPTION_CHAIN = "derivatives.optionChain",
  PREDICTION_SETUP = "predictions.resolveSetup",
  LLM_SYNTHESIS = "llm.synthesize",
}
