import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { IndexCategory, IndexQuote } from "@quant-ai/contracts";
import { MarketService } from "./market.service";

/**
 * Controller exposing real-time and snapshot market intelligence endpoints.
 * Author: yuva.devlab@gmail.com
 */
@ApiTags("Market")
@Controller("market")
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  /**
   * Retrieves active benchmark indices across market capitalization and sector categories.
   *
   * @param category Optional index category filter.
   * @returns Array of IndexQuote objects.
   */
  @Get("indices")
  @ApiOperation({ summary: "Get benchmark index quotes and sparklines" })
  @ApiQuery({ name: "category", enum: IndexCategory, required: false })
  getIndices(@Query("category") category?: IndexCategory): readonly IndexQuote[] {
    return this.marketService.getIndicesByCategory(category);
  }
}
