/**
 * @file apps/api/src/modules/chat/chat.service.ts
 * @description Dynamic AI Quant Copilot service analyzing markets with live feeds and LLM synthesis.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { AiProviderType, AgentRole, AgentStance, AiModelPurpose } from "@quant-ai/shared-types";
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

export type { ChatSessionSummary, ChatSessionDetail, ChatMessageResponse };

/**
 * Service managing AI Copilot interactions, live symbol context hydration, and quantitative responses.
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly inMemorySessions = new Map<string, ChatSessionDetail>();

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly predictionsService?: PredictionsService,
    @Optional() private readonly aiProviderFactory?: AiProviderFactory,
    @Optional() private readonly databaseService?: DatabaseService,
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

  /** Processes a trader's query with live market data injection and multi-agent synthesis. */
  public async handleUserMessage(
    query: string,
    sessionId?: string,
    providerOverride?: AiProviderType,
  ): Promise<ChatMessageResponse> {
    this.logger.info(`[handleUserMessage] Processing chat inquiry: "${query.slice(0, 60)}"`);
    const activeSessionId = sessionId || `session-${Date.now()}`;
    const sessionTitle = query.slice(0, 42) || "New Discussion";
    const timestamp = new Date().toISOString();

    const guardrail = evaluateChatGuardrails(query);
    if (!guardrail.allowed && guardrail.reply) {
      this.logger.warn(`[handleUserMessage] Blocked chat inquiry [REASON: ${guardrail.reason}]`);
      await persistChatMessages(
        activeSessionId,
        sessionTitle,
        query,
        guardrail.reply,
        this.databaseService,
        this.inMemorySessions,
        this.logger,
      );
      return {
        reply: guardrail.reply,
        sessionId: activeSessionId,
        agentPerspective: {
          role: AgentRole.QUANT_RISK_OFFICER,
          stance: AgentStance.NEUTRAL,
          conviction: 100,
        },
        timestamp,
      };
    }

    const safeQuery = guardrail.sanitizedQuery;
    const adapter = this.aiProviderFactory?.getAdapter(
      providerOverride,
      undefined,
      AiModelPurpose.CHAT,
    );
    if (adapter) {
      this.logger.debug(`[handleUserMessage] Active LLM backend: ${adapter.constructor.name}`);
    }

    const extractedSymbol = extractMentionedSymbol(safeQuery);
    const isOptionQuery = isOptionChainInquiry(safeQuery);

    const liveQuote = extractedSymbol
      ? await fetchUsableChatQuote(this.liveMarketFeed, extractedSymbol, this.logger)
      : undefined;

    // Benchmark Index or explicit option chain query
    const isIndex =
      extractedSymbol && BENCHMARK_INDEX_SYMBOLS.some((idx) => extractedSymbol.includes(idx));
    if (liveQuote && (isOptionQuery || isIndex)) {
      const baseTelemetry = formatOptionChainAdvisory(liveQuote);
      const aiReply = await adapter?.generateChatReply?.({
        query,
        symbol: liveQuote.symbol,
        marketContext: baseTelemetry,
      });
      const reply = aiReply?.trim() ? aiReply : baseTelemetry;

      await persistChatMessages(
        activeSessionId,
        sessionTitle,
        query,
        reply,
        this.databaseService,
        this.inMemorySessions,
        this.logger,
      );
      return {
        reply,
        sessionId: activeSessionId,
        referencedSymbol: liveQuote.symbol,
        livePrice: liveQuote.price,
        liveChange: liveQuote.percentChange,
        agentPerspective: {
          role: AgentRole.MACRO_ANALYST,
          stance: liveQuote.percentChange >= 0 ? AgentStance.BULLISH : AgentStance.BEARISH,
          conviction: 88,
        },
        timestamp,
      };
    }

    // Equity symbol query: generate/resolve setup and link to Prediction Lab
    if (liveQuote && extractedSymbol) {
      const { signal, isRevision, priorId } = await resolvePredictionForChat(
        this.predictionsService,
        extractedSymbol,
        query,
        this.logger,
      );
      const signalData = signal ? mapSignalToEmbeddedSetup(signal) : undefined;
      const baseAdvisory = formatEquityAdvisory(liveQuote, signal, isRevision, priorId);
      const aiReply = await adapter?.generateChatReply?.({
        query,
        symbol: liveQuote.symbol,
        marketContext: baseAdvisory,
      });
      const reply = aiReply?.trim() ? aiReply : baseAdvisory;

      await persistChatMessages(
        activeSessionId,
        sessionTitle,
        query,
        reply,
        this.databaseService,
        this.inMemorySessions,
        this.logger,
      );
      return {
        reply,
        sessionId: activeSessionId,
        referencedSymbol: liveQuote.symbol,
        livePrice: liveQuote.price,
        liveChange: liveQuote.percentChange,
        agentPerspective: {
          role: AgentRole.MOMENTUM_ANALYST,
          stance: liveQuote.percentChange >= 0 ? AgentStance.BULLISH : AgentStance.BEARISH,
          conviction: signal ? signal.confidence : 82,
        },
        signalData,
        predictionId: signal?.id,
        timestamp,
      };
    }

    // Fallback generic quant query
    const baseGeneric = extractedSymbol
      ? `Verified market data for ${extractedSymbol} is currently unavailable. No current price, option-chain reading, or trade setup can be provided until a provider-backed quote is available.`
      : formatGenericAdvisory(query);
    const aiReply = extractedSymbol ? undefined : await adapter?.generateChatReply?.({ query });
    const reply = aiReply?.trim() ? aiReply : baseGeneric;

    await persistChatMessages(
      activeSessionId,
      sessionTitle,
      query,
      reply,
      this.databaseService,
      this.inMemorySessions,
      this.logger,
    );
    return {
      reply,
      sessionId: activeSessionId,
      agentPerspective: {
        role: AgentRole.QUANT_RISK_OFFICER,
        stance: AgentStance.NEUTRAL,
        conviction: 75,
      },
      timestamp,
    };
  }
}
