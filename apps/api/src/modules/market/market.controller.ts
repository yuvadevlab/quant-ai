import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IndexQuote, MarketService } from "./market.service";

/**
 * Controller exposing real-time and snapshot market intelligence endpoints.
 */
@ApiTags("Market")
@Controller("market")
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  /**
   * Retrieves active benchmark indices.
   *
   * @returns Array of IndexQuote objects.
   */
  @Get("indices")
  @ApiOperation({ summary: "Get benchmark index quotes and sparklines" })
  getIndices(): readonly IndexQuote[] {
    return this.marketService.getBenchmarkIndices();
  }
}
