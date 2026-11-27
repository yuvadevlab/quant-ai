/**
 * @file apps/api/src/modules/chat/chat.service.ts
 * @description Dynamic AI Quant Strategist service analyzing markets with live feeds, parallel tools, and SSE streaming.
 */

import { Injectable, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { randomUUID } from "crypto";
import {
  AiProviderType,
  AgentMode,
  AgentRole,
  AgentRunLogLevel,
  AgentStance,
  AgentStreamEventType,
  AgentToolName,
  AiModelPurpose,
  ExecutionPhase,
  PhaseStatus,
} from "@quant-ai/shared-types";
import { extractFollowUpQuestions } from "@quant-ai/prompts";
import { LiveMarketFeedService } from "../market/feed";
import { AiProviderFactory } from "../quant-analysis/ai-provider.factory";
import { DatabaseService } from "../infrastructure/database.service";
import { PredictionsService } from "../predictions/predictions.service";
import { fetchUsableChatQuote } from "./chat-market-data";
import { BENCHMARK_INDEX_SYMBOLS } from "./chat.constants";
import { evaluateChatGuardrails } from "./chat-guardrails";
import { extractMentionedSymbol, isOptionChainInquiry } from "./chat-symbol-extractor";
import { formatOptionChainAdvisory } from "./chat-option-chain";
import { mapSignalToEmbeddedSetup, resolvePredictionForChat } from "./chat-prediction-bridge";
import { formatEquityAdvisory, formatGenericAdvisory } from "./chat-advisor";
import {
  getChatSessions,
  getChatSession,
  deleteChatSession,
  persistChatMessages,
} from "./chat-sessions";
import type { ChatSessionSummary, ChatSessionDetail, ChatMessageResponse } from "./chat.types";
import {
  createChatRunTracker,
  executeToolBatch,
  stripToolPlanTags,
  withExecutionLogs,
  type ChatStreamEmitter,
  type ToolBatchTask,
} from "./chat-stream";

export type { ChatSessionSummary, ChatSessionDetail, ChatMessageResponse };

/**
 * Service managing AI Strategist interactions, parallel market tool execution, and SSE streaming.
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly inMemorySessions = new Map<string, ChatSessionDetail>();

  public constructor(
    @Optional() private readonly liveMarketFeed?: LiveMarketFeedService,
    @Optional() private readonly aiProviderFactory?: AiProviderFactory,
    @Optional() private readonly databaseService?: DatabaseService,
    @Optional() private readonly predictionsService?: PredictionsService,
  ) {}

  public async getSessions(): Promise<ChatSessionSummary[]> {
    return getChatSessions(this.databaseService, this.inMemorySessions, this.logger);
  }

  public async getSession(id: string): Promise<ChatSessionDetail | null> {
    return getChatSession(id, this.databaseService, this.inMemorySessions, this.logger);
  }

  public async deleteSession(id: string): Promise<boolean> {
    return deleteChatSession(id, this.databaseService, this.inMemorySessions);
  }

  /** Processes a trader's query with live market data injection, parallel read-only tools, and SSE streaming. */
  public async handleUserMessage(
    query: string,
    sessionId?: string,
    providerOverride?: AiProviderType,
    emit?: ChatStreamEmitter,
    signalAbort?: AbortSignal,
  ): Promise<ChatMessageResponse> {
    const runId = randomUUID();
    const activeSessionId = sessionId || `session-${Date.now()}`;
    const sessionTitle = query.slice(0, 42) || "New Discussion";
    const timestamp = new Date().toISOString();
    const tracker = createChatRunTracker(emit, signalAbort);

    emit?.({ type: AgentStreamEventType.RUN, runId });
    emit?.({ type: AgentStreamEventType.CONVERSATION, conversationId: activeSessionId });
    emit?.({
      type: AgentStreamEventType.PHASE,
      phase: ExecutionPhase.LOADING_CONTEXT,
      status: PhaseStatus.START,
    });

    tracker.log(AgentRunLogLevel.SYS, "Evaluating safety & domain guardrails...");
    const guardrail = evaluateChatGuardrails(query);
    if (!guardrail.allowed && guardrail.reply) {
      this.logger.warn(`[handleUserMessage] Blocked chat inquiry [REASON: ${guardrail.reason}]`);
      tracker.log(AgentRunLogLevel.ERR, `Blocked by guardrail (${guardrail.reason ?? "POLICY"}).`);
      emit?.({
        type: AgentStreamEventType.PHASE,
        phase: ExecutionPhase.LOADING_CONTEXT,
        status: PhaseStatus.END,
      });
      await persistChatMessages(
        activeSessionId,
        sessionTitle,
        query,
        guardrail.reply,
        this.databaseService,
        this.inMemorySessions,
        this.logger,
      );
      await tracker.streamTokens(guardrail.reply);
      return withExecutionLogs(
        {
          reply: guardrail.reply,
          sessionId: activeSessionId,
          agentPerspective: {
            role: AgentRole.QUANT_RISK_OFFICER,
            stance: AgentStance.NEUTRAL,
            conviction: 100,
          },
          timestamp,
        },
        tracker,
      );
    }

    const safeQuery = guardrail.sanitizedQuery;
    const priorSession = sessionId ? await this.getSession(sessionId) : null;
    const history = (priorSession?.messages ?? []).slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const extractedSymbol = extractMentionedSymbol(safeQuery);
    const isOptionQuery = isOptionChainInquiry(safeQuery);
    const isIndex = Boolean(
      extractedSymbol && BENCHMARK_INDEX_SYMBOLS.some((idx) => extractedSymbol.includes(idx)),
    );

    emit?.({
      type: AgentStreamEventType.PHASE,
      phase: ExecutionPhase.LOADING_CONTEXT,
      status: PhaseStatus.END,
    });
    tracker.log(
      AgentRunLogLevel.CTX,
      `Loaded ${history.length} prior turn${history.length === 1 ? "" : "s"}`,
      extractedSymbol ? `Instrument: ${extractedSymbol}` : "Macro / Quant Mode",
    );
    emit?.({
      type: AgentStreamEventType.MODE,
      mode: extractedSymbol ? AgentMode.AGENT : AgentMode.ADVISOR,
    });

    const adapter = this.aiProviderFactory?.getAdapter(
      providerOverride,
      undefined,
      AiModelPurpose.CHAT,
    );
    const adapterName = adapter ? adapter.constructor.name : "DeterministicQuantEngine";

    let liveQuote: Awaited<ReturnType<typeof fetchUsableChatQuote>> | undefined;
    let predictionResult: Awaited<ReturnType<typeof resolvePredictionForChat>> | undefined;

    if (extractedSymbol) {
      tracker.log(
        AgentRunLogLevel.TOOL,
        `Dispatching parallel read-only tools for ${extractedSymbol}...`,
      );
      const tasks: ToolBatchTask<unknown>[] = [
        {
          tool: AgentToolName.LIVE_QUOTE,
          label: `Fetching live market feed for ${extractedSymbol}`,
          isReadOnly: true,
          run: () =>
            this.liveMarketFeed
              ? fetchUsableChatQuote(this.liveMarketFeed, extractedSymbol, this.logger)
              : Promise.resolve(undefined),
          summarize: (res) => {
            const q = res as typeof liveQuote;
            return q
              ? {
                  ok: true,
                  summary: `${q.symbol}: ₹${q.price.toLocaleString("en-IN")} (${q.percentChange >= 0 ? "+" : ""}${q.percentChange.toFixed(2)}%)`,
                }
              : { ok: false, summary: `No live quote for ${extractedSymbol}` };
          },
        },
        ...(!isOptionQuery && !isIndex
          ? [
              {
                tool: AgentToolName.PREDICTION_SETUP,
                label: `Resolving multi-agent setup for ${extractedSymbol}`,
                isReadOnly: true,
                run: () =>
                  resolvePredictionForChat(
                    this.predictionsService,
                    extractedSymbol,
                    query,
                    this.logger,
                  ),
                summarize: (res: unknown) => {
                  const pred = res as typeof predictionResult;
                  return pred?.signal
                    ? {
                        ok: true,
                        summary: `${pred.signal.id} (${pred.signal.direction}, ${pred.signal.confidence}% conf)`,
                      }
                    : { ok: true, summary: "No active prediction setup" };
                },
              },
            ]
          : []),
      ];

      const results = await executeToolBatch(tasks, emit, signalAbort);
      liveQuote = results[0] as typeof liveQuote;
      predictionResult = results[1] as typeof predictionResult;
    }

    emit?.({
      type: AgentStreamEventType.PHASE,
      phase: ExecutionPhase.MODEL_TURN,
      status: PhaseStatus.START,
      turn: 1,
    });

    const reasoningSummary = liveQuote
      ? `Ground context on ${liveQuote.symbol} at ₹${liveQuote.price.toLocaleString("en-IN")} (${liveQuote.percentChange >= 0 ? "+" : ""}${liveQuote.percentChange.toFixed(2)}%). Evaluating ${isOptionQuery || isIndex ? "derivatives regime & OI bands" : "multi-agent technical & risk setup"} via ${adapterName}.`
      : `Evaluating quantitative risk & regime inquiry via ${adapterName} without an active ticker quote.`;
    await tracker.streamReasoning(reasoningSummary);

    let reply: string;
    let role = AgentRole.QUANT_RISK_OFFICER;
    let stance = AgentStance.NEUTRAL;
    let conviction = 75;
    let signalData: ChatMessageResponse["signalData"];
    let predictionId: string | undefined;

    if (liveQuote && (isOptionQuery || isIndex)) {
      const baseTelemetry = formatOptionChainAdvisory(liveQuote);
      tracker.log(
        AgentRunLogLevel.LLM,
        `Synthesizing derivatives & index regime via ${adapterName}...`,
      );
      const aiReply = await adapter?.generateChatReply?.({
        query: safeQuery,
        symbol: liveQuote.symbol,
        marketContext: baseTelemetry,
        history,
      });
      reply = stripToolPlanTags(aiReply?.trim() ? aiReply : baseTelemetry);
      role = AgentRole.MACRO_ANALYST;
      stance = liveQuote.percentChange >= 0 ? AgentStance.BULLISH : AgentStance.BEARISH;
      conviction = 88;
    } else if (liveQuote && extractedSymbol) {
      const signal = predictionResult?.signal;
      signalData = signal ? mapSignalToEmbeddedSetup(signal) : undefined;
      predictionId = signal?.id;
      const baseAdvisory = formatEquityAdvisory(
        liveQuote,
        signal,
        predictionResult?.isRevision ?? false,
        predictionResult?.priorId,
      );
      tracker.log(AgentRunLogLevel.LLM, `Synthesizing equity thesis via ${adapterName}...`);
      const aiReply = await adapter?.generateChatReply?.({
        query: safeQuery,
        symbol: liveQuote.symbol,
        marketContext: baseAdvisory,
        history,
      });
      reply = stripToolPlanTags(aiReply?.trim() ? aiReply : baseAdvisory);
      role = AgentRole.MOMENTUM_ANALYST;
      stance = liveQuote.percentChange >= 0 ? AgentStance.BULLISH : AgentStance.BEARISH;
      conviction = signal ? signal.confidence : 82;
    } else {
      const baseGeneric = extractedSymbol
        ? `Verified market data for ${extractedSymbol} is currently unavailable. No current price, option-chain reading, or trade setup can be provided until a provider-backed quote is available.`
        : formatGenericAdvisory(query);
      if (!extractedSymbol) {
        tracker.log(
          AgentRunLogLevel.LLM,
          `Synthesizing quantitative guidance via ${adapterName}...`,
        );
      }
      const aiReply = extractedSymbol
        ? undefined
        : await adapter?.generateChatReply?.({ query: safeQuery, history });
      reply = stripToolPlanTags(aiReply?.trim() ? aiReply : baseGeneric);
    }

    emit?.({
      type: AgentStreamEventType.PHASE,
      phase: ExecutionPhase.MODEL_TURN,
      status: PhaseStatus.END,
      turn: 1,
      toolCalls: extractedSymbol ? (isOptionQuery || isIndex ? 1 : 2) : 0,
    });
    tracker.log(AgentRunLogLevel.LLM, `Generated ${reply.length} chars of synthesis.`);

    const followUps = extractFollowUpQuestions(reply);
    await persistChatMessages(
      activeSessionId,
      sessionTitle,
      query,
      reply,
      this.databaseService,
      this.inMemorySessions,
      this.logger,
    );
    tracker.log(AgentRunLogLevel.DONE, "Synthesis complete & persisted to session history.");
    await tracker.streamTokens(reply);
    if (followUps.length > 0) {
      emit?.({ type: AgentStreamEventType.SUGGESTIONS, suggestions: followUps });
    }

    return withExecutionLogs(
      {
        reply,
        sessionId: activeSessionId,
        ...(liveQuote
          ? {
              referencedSymbol: liveQuote.symbol,
              livePrice: liveQuote.price,
              liveChange: liveQuote.percentChange,
            }
          : {}),
        followUps,
        agentPerspective: { role, stance, conviction },
        ...(signalData ? { signalData } : {}),
        ...(predictionId ? { predictionId } : {}),
        timestamp,
      },
      tracker,
    );
  }
}
