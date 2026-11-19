import { Module } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { RealtimeModule } from "../realtime/realtime.module";
import { AiProviderFactory } from "./ai-provider.factory";
import { MarketRegimeService } from "./market-regime.service";
import { MultiAgentDeliberationService } from "./multi-agent-deliberation.service";
import { TechnicalAnalysisService } from "./technical-analysis.service";

/**
 * Module providing quantitative analysis, regime classification, and multi-agent deliberation.
 */
@Module({
  imports: [InfrastructureModule, RealtimeModule],
  providers: [
    AiProviderFactory,
    MarketRegimeService,
    MultiAgentDeliberationService,
    TechnicalAnalysisService,
  ],
  exports: [
    AiProviderFactory,
    MarketRegimeService,
    MultiAgentDeliberationService,
    TechnicalAnalysisService,
  ],
})
export class QuantAnalysisModule {}
