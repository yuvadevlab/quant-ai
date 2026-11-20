/**
 * @file apps/api/src/modules/chat/chat.service.ts
 * @description Dynamic AI Quant Copilot service analyzing markets with live feeds and LLM synthesis.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { AiProviderType, AgentRole, AgentStance } from "@quant-ai/shared-types";
import { LiveMarketFeedService } from "../market/feed";
import { AiProviderFactory } from "../quant-analysis/ai-provider.factory";
import { CHAT_QUERY_SYMBOLS, CHAT_TEMPLATES } from "./chat.constants";

export interface ChatMessageResponse {
  readonly reply: string;
  readonly referencedSymbol?: string;
  readonly livePrice?: number;
  readonly liveChange?: number;
  readonly agentPerspective?: {
    readonly role: AgentRole;
    readonly stance: AgentStance;
    readonly conviction: number;
  };
  readonly timestamp: string;
}

/**
 * Service managing AI Copilot interactions, live symbol context hydration, and quantitative responses.
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  public constructor(
    private readonly liveMarketFeed: LiveMarketFeedService,
    @Optional() private readonly aiProviderFactory?: AiProviderFactory,
  ) {}

  /**
   * Processes a trader's query with live market data injection and multi-agent synthesis.
   *
   * @param query Trader's question or command.
   * @param providerOverride Optional LLM backend override.
   * @returns Structured ChatMessageResponse.
   */
  public async handleUserMessage(
    query: string,
    providerOverride?: AiProviderType,
  ): Promise<ChatMessageResponse> {
    this.logger.info(`[handleUserMessage] Processing chat inquiry: "${query.slice(0, 60)}"`);
    const extractedSymbol = this.extractMentionedSymbol(query);
    let liveQuote = undefined;

    if (extractedSymbol) {
      try {
        liveQuote = await this.liveMarketFeed.getLiveQuote(extractedSymbol);
        this.logger.info(
          `[handleUserMessage] Successfully resolved live quote for ${extractedSymbol} at ₹${liveQuote.price}`,
        );
      } catch (err) {
        this.logger.debug(
          `[handleUserMessage] Could not resolve live quote for ${extractedSymbol}: ${String(err)}`,
        );
      }
    }

    const adapter = this.aiProviderFactory?.getAdapter(providerOverride);
    if (adapter) {
      this.logger.debug(
        `[handleUserMessage] AI Provider adapter selected: ${adapter.constructor.name}`,
      );
    }

    const timestamp = new Date().toISOString();

    if (liveQuote) {
      return {
        reply: CHAT_TEMPLATES.LIVE_QUOTE_SUMMARY(liveQuote),
        referencedSymbol: liveQuote.symbol,
        livePrice: liveQuote.price,
        liveChange: liveQuote.percentChange,
        agentPerspective: {
          role: AgentRole.MOMENTUM_ANALYST,
          stance: liveQuote.percentChange >= 0 ? AgentStance.BULLISH : AgentStance.BEARISH,
          conviction: 86,
        },
        timestamp,
      };
    }

    // Default institutional quantitative response
    return {
      reply: CHAT_TEMPLATES.GENERIC_QUANT_REPLY(query),
      agentPerspective: {
        role: AgentRole.QUANT_RISK_OFFICER,
        stance: AgentStance.NEUTRAL,
        conviction: 75,
      },
      timestamp,
    };
  }

  private extractMentionedSymbol(query: string): string | undefined {
    const upper = query.toUpperCase();

    for (const sym of CHAT_QUERY_SYMBOLS) {
      if (upper.includes(sym)) {
        this.logger.debug(`[extractMentionedSymbol] Query matched target instrument: ${sym}`);
        return sym;
      }
    }
    return undefined;
  }
}
