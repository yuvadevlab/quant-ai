/**
 * @file apps/api/src/modules/quant-analysis/deliberation.controller.ts
 * @description Controller exposing REST endpoints to trigger multi-agent deliberation and expectancy checks.
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { AiProviderType, SignalRegime } from "@quant-ai/shared-types";
import { LiveMarketFeedService } from "../market/feed";
import {
  MultiAgentDeliberationService,
  type DeliberationOutcome,
  type TradePriceSetup,
} from "./multi-agent-deliberation.service";

interface TriggerDeliberationDto {
  readonly predictionId: string;
  readonly ticker: string;
  readonly currentPrice?: number;
  readonly targetPrice?: number;
  readonly stopLossPrice?: number;
  readonly rsi?: number;
  readonly atr?: number;
  readonly regime?: SignalRegime;
  readonly providerOverride?: AiProviderType;
}

interface EvaluateExpectancyDto {
  readonly entryPrice: number;
  readonly targetPrice: number;
  readonly stopLossPrice: number;
  readonly winProbability: number;
  readonly estimatedFriction?: number;
}

/**
 * REST controller for quantitative deliberation and risk gate operations.
 */
@Controller("deliberation")
export class DeliberationController {
  private readonly logger = new Logger(DeliberationController.name);

  public constructor(
    private readonly deliberationService: MultiAgentDeliberationService,
    private readonly liveMarketFeed: LiveMarketFeedService,
  ) {}

  /**
   * Triggers asynchronous multi-agent deliberation with real-time WebSocket token streaming.
   */
  @Post("trigger")
  @HttpCode(HttpStatus.OK)
  public async triggerDeliberation(
    @Body() dto: TriggerDeliberationDto,
  ): Promise<DeliberationOutcome> {
    this.logger.info(
      `[triggerDeliberation] Triggering debate for ${dto.ticker} (${dto.predictionId})`,
    );
    let currentPrice = dto.currentPrice;
    if (typeof currentPrice !== "number" || currentPrice <= 0) {
      const live = await this.liveMarketFeed.getLiveQuote(dto.ticker);
      currentPrice = live.price;
    }

    const targetPrice = dto.targetPrice ?? Number((currentPrice * 1.03).toFixed(2));
    const stopLossPrice = dto.stopLossPrice ?? Number((currentPrice * 0.985).toFixed(2));
    const rsi = dto.rsi ?? 58.5;
    const atr = dto.atr ?? Number((currentPrice * 0.015).toFixed(2));
    const regime = dto.regime ?? SignalRegime.BULLISH_EXPANSION;

    return this.deliberationService.conductAdversarialDeliberation(
      {
        predictionId: dto.predictionId,
        ticker: dto.ticker,
        currentPrice,
        targetPrice,
        stopLossPrice,
        rsi,
        atr,
        regime,
      },
      dto.providerOverride,
    );
  }

  /**
   * Evaluates institutional trade expectancy and risk/reward threshold.
   */
  @Post("expectancy")
  @HttpCode(HttpStatus.OK)
  public evaluateExpectancy(@Body() dto: EvaluateExpectancyDto) {
    this.logger.info("[evaluateExpectancy] Evaluating trade expectancy and risk gate");
    const setup: TradePriceSetup = {
      entryPrice: dto.entryPrice,
      targetPrice: dto.targetPrice,
      stopLossPrice: dto.stopLossPrice,
      winProbability: dto.winProbability,
      estimatedFriction: dto.estimatedFriction,
    };
    return this.deliberationService.evaluateExpectancy(setup);
  }
}
