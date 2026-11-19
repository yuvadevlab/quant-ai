import { Module } from "@nestjs/common";
import { MarketRegimeService } from "./market-regime.service";
import { MultiAgentDeliberationService } from "./multi-agent-deliberation.service";
import { TechnicalAnalysisService } from "./technical-analysis.service";

/**
 * Module providing quantitative analysis, regime classification, and multi-agent deliberation.
 */
@Module({
  providers: [MarketRegimeService, MultiAgentDeliberationService, TechnicalAnalysisService],
  exports: [MarketRegimeService, MultiAgentDeliberationService, TechnicalAnalysisService],
})
export class QuantAnalysisModule {}
