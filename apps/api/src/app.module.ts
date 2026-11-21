import { Module } from "@nestjs/common";
import { InfrastructureModule } from "./modules/infrastructure/infrastructure.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { HealthModule } from "./modules/health/health.module";
import { MarketModule } from "./modules/market/market.module";
import { PredictionsModule } from "./modules/predictions/predictions.module";
import { QuantAnalysisModule } from "./modules/quant-analysis/quant-analysis.module";
import { ScreenerModule } from "./modules/screener/screener.module";
import { ChatModule } from "./modules/chat/chat.module";
import { PortfolioModule } from "./modules/portfolio/portfolio.module";
import { LlmModelsModule } from "./modules/llm-models/llm-models.module";
import { AuthModule } from "./modules/auth/auth.module";

/**
 * Root application module aggregating core domain and infrastructure modules.
 */
@Module({
  imports: [
    InfrastructureModule,
    AuthModule,
    RealtimeModule,
    HealthModule,
    MarketModule,
    PredictionsModule,
    ScreenerModule,
    QuantAnalysisModule,
    ChatModule,
    PortfolioModule,
    LlmModelsModule,
  ],
})
export class AppModule {}
