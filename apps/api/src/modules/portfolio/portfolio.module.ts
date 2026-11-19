/**
 * @file apps/api/src/modules/portfolio/portfolio.module.ts
 * @description NestJS module for simulated paper trading portfolio services.
 * @author yuva.devlab@gmail.com
 */

import { Module } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { MarketModule } from "../market/market.module";
import { PortfolioController } from "./portfolio.controller";
import { PortfolioService } from "./portfolio.service";

/**
 * Module managing paper portfolio, marks to market, and position ledgers.
 */
@Module({
  imports: [InfrastructureModule, MarketModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
