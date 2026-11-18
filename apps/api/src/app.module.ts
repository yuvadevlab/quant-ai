import { Module } from "@nestjs/common";
import { HealthModule } from "./modules/health/health.module";
import { MarketModule } from "./modules/market/market.module";
import { PredictionsModule } from "./modules/predictions/predictions.module";
import { ScreenerModule } from "./modules/screener/screener.module";

/**
 * Root application module aggregating core domain modules.
 */
@Module({
  imports: [HealthModule, MarketModule, PredictionsModule, ScreenerModule],
})
export class AppModule {}
