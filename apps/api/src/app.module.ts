import { Module } from "@nestjs/common";
import { InfrastructureModule } from "./modules/infrastructure/infrastructure.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { HealthModule } from "./modules/health/health.module";
import { MarketModule } from "./modules/market/market.module";
import { PredictionsModule } from "./modules/predictions/predictions.module";
import { QuantAnalysisModule } from "./modules/quant-analysis/quant-analysis.module";
import { ScreenerModule } from "./modules/screener/screener.module";

/**
 * Root application module aggregating core domain and infrastructure modules.
 */
@Module({
  imports: [
    InfrastructureModule,
    RealtimeModule,
    HealthModule,
    MarketModule,
    PredictionsModule,
    ScreenerModule,
    QuantAnalysisModule,
  ],
})
export class AppModule {}
