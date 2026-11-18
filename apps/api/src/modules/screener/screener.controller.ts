import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ScreenerService } from "./screener.service";
import { ScreenerItem, ScreenerQueryDto } from "./screener.types";

/**
 * Controller exposing quantitative screener and momentum scan endpoints.
 */
@ApiTags("Screener")
@Controller("screener")
export class ScreenerController {
  constructor(private readonly screenerService: ScreenerService) {}

  /**
   * Retrieves all instruments in the screener universe.
   *
   * @returns Array of ScreenerItem records.
   */
  @Get()
  @ApiOperation({ summary: "Get all screened market instruments" })
  findAll(): readonly ScreenerItem[] {
    return this.screenerService.findAll();
  }

  /**
   * Retrieves instruments with high volume surges (>= 2.0x average volume).
   *
   * @returns Array of volume anomaly candidates.
   */
  @Get("volume-surge")
  @ApiOperation({ summary: "Get instruments experiencing volume surge" })
  findVolumeSurges(): readonly ScreenerItem[] {
    return this.screenerService.findVolumeSurges();
  }

  /**
   * Retrieves instruments undergoing active technical breakouts.
   *
   * @returns Array of breakout candidates.
   */
  @Get("breakouts")
  @ApiOperation({ summary: "Get active breakout candidates" })
  findBreakouts(): readonly ScreenerItem[] {
    return this.screenerService.findBreakouts();
  }

  /**
   * Filters instruments using custom quantitative thresholds.
   *
   * @param query Filter criteria.
   * @returns Filtered array of ScreenerItem records.
   */
  @Post("filter")
  @HttpCode(200)
  @ApiOperation({ summary: "Filter instrument universe by quantitative parameters" })
  filter(@Body() query: ScreenerQueryDto): readonly ScreenerItem[] {
    return this.screenerService.filter(query);
  }
}
