/**
 * @fileoverview Controller exposing real-time and snapshot market intelligence endpoints.
 * @author yuva.devlab@gmail.com
 */

import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  ApiSegment,
  IndexCategory,
  IndexQuote,
  SwaggerSummary,
  SwaggerTag,
} from "@quant-ai/contracts";
import { MarketService } from "./market.service";

/**
 * Controller exposing real-time and snapshot market intelligence endpoints.
 */
@ApiTags(SwaggerTag.MARKET)
@Controller(ApiSegment.MARKET)
export class MarketController {
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
  public getIndices(@Query("category") category?: IndexCategory): readonly IndexQuote[] {
    return this.marketService.getIndicesByCategory(category);
  }
}
