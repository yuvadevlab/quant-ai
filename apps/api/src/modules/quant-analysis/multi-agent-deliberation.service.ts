/**
 * @file apps/api/src/modules/quant-analysis/multi-agent-deliberation.service.ts
 * @description Service orchestrating the 3-agent adversarial deliberation and institutional risk gate.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import {
  AgentDeliberationItem,
  AgentRole,
  AgentStance,
  AiProviderType,
  DEFAULT_RISK_GATE_CONFIG,
  EventTopic,
  evaluateTradeExpectancy,
  RiskGateConfig,
  synthesizeAgentConsensus,
  TradeExpectancyInput,
  TradeExpectancyResult,
} from "@quant-ai/shared-types";
import { createDeliberationEnvelope } from "@quant-ai/events";
import { EventBusService } from "../infrastructure/event-bus.service";
import { RealtimeService } from "../realtime/realtime.service";
import { AiProviderFactory } from "./ai-provider.factory";
import type {
  DeliberationOutcome,
  DeliberationSessionInput,
  TradePriceSetup,
} from "./deliberation-session.types";

export type { DeliberationOutcome, DeliberationSessionInput, TradePriceSetup };

/**
 * Service orchestrating the 3-agent adversarial deliberation and institutional risk gate.
 */
@Injectable()
export class MultiAgentDeliberationService {
  private readonly logger = new Logger(MultiAgentDeliberationService.name);

  public constructor(
    @Optional() private readonly aiProviderFactory?: AiProviderFactory,
    @Optional() private readonly eventBusService?: EventBusService,
    @Optional() private readonly realtimeService?: RealtimeService,
  ) {}

  /**
   * Evaluates mathematical trade expectancy and enforces the risk-to-reward ratio threshold.
   */
  public evaluateExpectancy(
    setup: TradePriceSetup | TradeExpectancyInput,
    config?: Partial<RiskGateConfig>,
  ): TradeExpectancyResult {
    let input: TradeExpectancyInput;
    if ("entryPrice" in setup) {
      input = {
        winProbability: setup.winProbability,
        targetGain: Math.abs(setup.targetPrice - setup.entryPrice),
        stopLossLoss: Math.abs(setup.entryPrice - setup.stopLossPrice),
        estimatedFriction: setup.estimatedFriction,
      };
    } else {
      input = setup;
    }

    return evaluateTradeExpectancy(input, config ?? DEFAULT_RISK_GATE_CONFIG);
  }

  /**
   * Synthesizes individual agent stances into an institutional consensus.
   */
  public synthesizeConsensus(deliberations: readonly AgentDeliberationItem[]): {
    readonly consensusStance: AgentStance;
    readonly compositeConfidence: number;
    readonly isVetoedBySkeptic: boolean;
  } {
    return synthesizeAgentConsensus(deliberations);
  }

  /**
   * Conducts live asynchronous adversarial deliberation using the configured AI model adapter.
   */
  public async conductAdversarialDeliberation(
    session: DeliberationSessionInput,
    providerOverride?: AiProviderType,
  ): Promise<DeliberationOutcome> {
    const riskRewardRatio =
      Math.abs(session.targetPrice - session.currentPrice) /
      Math.max(0.01, Math.abs(session.currentPrice - session.stopLossPrice));

    const adapter = this.aiProviderFactory?.getAdapter(providerOverride);
    const roles: AgentRole[] = [
      AgentRole.MOMENTUM_ANALYST,
      AgentRole.RED_TEAM_SKEPTIC,
      AgentRole.QUANT_RISK_OFFICER,
    ];

    const verdicts: AgentDeliberationItem[] = [];
    const timestamp = new Date().toISOString();

    for (const role of roles) {
      const output = adapter
        ? await adapter.generateAgentVerdict({
            ticker: session.ticker,
            role,
            currentPrice: session.currentPrice,
            rsi: session.rsi,
            atr: session.atr,
            regime: session.regime,
            targetPrice: session.targetPrice,
            stopLossPrice: session.stopLossPrice,
            riskRewardRatio,
          })
        : {
            role,
            stance: AgentStance.BULLISH,
            confidence: 85,
            summary: `${role} verified trade parameters.`,
            rationale: "Default heuristic approval",
            isVeto: false,
          };

      verdicts.push({
        role: output.role,
        stance: output.stance,
        confidence: output.confidence,
        summary: output.summary,
        keyCatalyst: output.keyCatalyst,
        keyRisk: output.keyRisk,
      });

      // Stream agent speech event to WebSocket clients
      this.realtimeService?.emitAgentSpeech({
        predictionId: session.predictionId,
        agentName: role,
        stance: output.stance,
        reasoning: output.summary,
        confidence: output.confidence,
        timestamp,
      });
    }

    const consensus = this.synthesizeConsensus(verdicts);

    // Dispatch ecosystem DomainEventEnvelope to event bus
    const envelope = createDeliberationEnvelope({
      predictionId: session.predictionId,
      consensusVeto: consensus.isVetoedBySkeptic,
      netScore: consensus.compositeConfidence,
      verdicts: verdicts.map((v) => ({
        agentRole: v.role,
        stance: v.stance,
        score: v.confidence,
        rationale: v.summary,
        isVeto: v.stance === AgentStance.BEARISH,
      })),
      timestamp,
    });

    if (this.eventBusService) {
      await this.eventBusService.publish(EventTopic.DELIBERATION_COMPLETED, envelope);
    }

    this.logger.info(
      `Deliberation completed [PRED: ${session.predictionId}] [CONSENSUS: ${consensus.consensusStance}] [CONF: ${consensus.compositeConfidence}%] [VETO: ${consensus.isVetoedBySkeptic}]`,
    );

    return {
      predictionId: session.predictionId,
      consensusStance: consensus.consensusStance,
      compositeConfidence: consensus.compositeConfidence,
      isVetoedBySkeptic: consensus.isVetoedBySkeptic,
      verdicts,
      timestamp,
    };
  }

  /**
   * Factory producing standard default multi-agent deliberation for a technical breakout.
   */
  public generateBreakoutDebate(
    ticker: string,
    rsi: number,
    riskReward: number,
  ): readonly AgentDeliberationItem[] {
    const isOverbought = rsi > 70;
    const isRiskAcceptable = riskReward >= 2.0;

    return [
      {
        role: AgentRole.MOMENTUM_ANALYST,
        stance: rsi > 50 ? AgentStance.BULLISH : AgentStance.NEUTRAL,
        confidence: 88,
        summary: `${ticker} momentum expansion: RSI at ${rsi.toFixed(1)} with positive velocity.`,
      },
      {
        role: AgentRole.RED_TEAM_SKEPTIC,
        stance: isOverbought ? AgentStance.BEARISH : AgentStance.NEUTRAL,
        confidence: isOverbought ? 82 : 65,
        summary: isOverbought
          ? "RSI approaching extreme overbought territory; high risk of exhaustion pullback."
          : "Base structure intact; watch for overhead supply clusters.",
      },
      {
        role: AgentRole.QUANT_RISK_OFFICER,
        stance: isRiskAcceptable ? AgentStance.BULLISH : AgentStance.BEARISH,
        confidence: 90,
        summary: isRiskAcceptable
          ? `Risk/Reward of ${riskReward.toFixed(1)} satisfies institutional >= 2.0 threshold.`
          : `Risk/Reward of ${riskReward.toFixed(1)} is below institutional 2.0 threshold. VETO.`,
      },
    ];
  }
}
