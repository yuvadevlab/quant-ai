/**
 * @file apps/api/src/modules/portfolio/portfolio.controller.ts
 * @description Controller exposing paper portfolio and simulated risk ledger endpoints.
 * @author yuva.devlab@gmail.com
 */

import { Controller, Get } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import type { PortfolioSummary } from "./portfolio.types";

/**
 * REST controller for paper trading portfolio and performance metrics.
 */
@Controller("portfolio")
export class PortfolioController {
  public constructor(private readonly portfolioService: PortfolioService) {}

  /**
   * Retrieves active simulated portfolio positions, margins, and equity marks.
   */
  @Get()
  public getPortfolio(): PortfolioSummary {
    return this.portfolioService.getPortfolioSummary();
  }
}
