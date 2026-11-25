/**
 * @fileoverview Controller exposing real-time and snapshot market intelligence endpoints.
 * @author yuva.devlab@gmail.com
 */

import { Body, Controller, Get, Patch, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Logger } from "@yuva-devlab/logger";
import {
  ApiSegment,
  IndexCategory,
  IndexQuote,
  SwaggerSummary,
  SwaggerTag,
} from "@quant-ai/shared-types";
import { MarketService } from "./market.service";
import type { MarketBreadthConfig, SectorMomentumConfig } from "./market-config.types";

/**
 * Controller exposing real-time and snapshot market intelligence endpoints.
 */
@ApiTags(SwaggerTag.MARKET)
@Controller(ApiSegment.MARKET)
export class MarketController {
  private readonly logger = new Logger(MarketController.name);

  public constructor(private readonly marketService: MarketService) {}

  /**
   * Retrieves active benchmark indices across market capitalization and sector categories.
   *
   * @param category Optional index category filter.
   * @returns Array of IndexQuote objects.
   */
  @Get(ApiSegment.INDICES)
  @ApiOperation({ summary: SwaggerSummary.BENCHMARK_INDICES })
  @ApiQuery({ name: "category", enum: IndexCategory, required: false })
  public async getIndices(
    @Query("category") category?: IndexCategory,
  ): Promise<readonly IndexQuote[]> {
    this.logger.info(`[getIndices] Fetching indices (category: ${category ?? "ALL"})`);
    await this.marketService.refreshBenchmarkIndices();
    return this.marketService.getIndicesByCategory(category);
  }

  /**
   * Retrieves live market breadth, advances/declines, and institutional flows.
   */
  @Get("breadth")
  @ApiOperation({ summary: "Live market breadth and flows" })
  public getBreadth() {
    this.logger.info("[getBreadth] Fetching dynamic market breadth and institutional flows");
    return this.marketService.getMarketBreadth();
  }

  /**
   * Retrieves sectoral momentum matrix.
   */
  @Get("sectors")
  @ApiOperation({ summary: "Sectoral performance matrix" })
  public getSectors() {
    this.logger.info("[getSectors] Fetching sectoral momentum matrix");
    return this.marketService.getSectorPerformance();
  }

  /**
   * Retrieves current configurable market parameters and thresholds.
   */
  @Get("config")
  @ApiOperation({ summary: "Market configuration parameters" })
  public getConfig() {
    this.logger.info("[getConfig] Fetching active market breadth and sector config");
    return {
      breadth: this.marketService.getBreadthConfig(),
      sector: this.marketService.getSectorConfig(),
    };
  }

  /**
   * Updates market breadth or momentum thresholds dynamically at runtime.
   */
  @Patch("config")
  @ApiOperation({ summary: "Update market configuration parameters" })
  public async updateConfig(
    @Body()
    body: {
      breadth?: Partial<MarketBreadthConfig>;
      sector?: Partial<SectorMomentumConfig>;
    },
  ) {
    this.logger.info("[updateConfig] Updating runtime market parameters");
    if (body.breadth) {
      await this.marketService.updateBreadthConfig(body.breadth);
    }
    if (body.sector) {
      await this.marketService.updateSectorConfig(body.sector);
    }
    return {
      breadth: this.marketService.getBreadthConfig(),
      sector: this.marketService.getSectorConfig(),
    };
  }
}
