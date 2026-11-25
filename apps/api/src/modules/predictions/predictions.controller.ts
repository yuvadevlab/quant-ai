/**
 * @fileoverview Controller exposing Prediction Lab query endpoints.
 * @author yuva.devlab@gmail.com
 */

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Logger } from "@yuva-devlab/logger";
import {
  ApiSegment,
  Signal,
  SwaggerSummary,
  SwaggerTag,
  TrajectoryPoint,
} from "@quant-ai/shared-types";
import { PredictionsService } from "./predictions.service";
import type { ResearchRunSummary } from "./research-runs.repository";

/**
 * Controller exposing Prediction Lab query endpoints.
 */
@ApiTags(SwaggerTag.PREDICTIONS)
@Controller(ApiSegment.PREDICTIONS)
export class PredictionsController {
  private readonly logger = new Logger(PredictionsController.name);

  public constructor(private readonly predictionsService: PredictionsService) {}

  /**
   * Retrieves all predictions from the ledger.
   *
   * @returns Array of Signal records.
   */
  @Get()
  @ApiOperation({ summary: SwaggerSummary.ACTIVE_PREDICTIONS })
  public findAll(): readonly Signal[] {
    this.logger.info("[findAll] Fetching all predictions from ledger");
    return this.predictionsService.findAll();
  }

  /**
   * Retrieves recent immutable analysis-run records, including scans without a prediction.
   *
   * @returns Recent research runs.
   */
  @Get("research-runs")
  public findResearchRuns(): Promise<readonly ResearchRunSummary[]> {
    return this.predictionsService.findResearchRuns();
  }

  /**
   * Retrieves detailed prediction analytics by ID.
   *
   * @param id The prediction identifier (e.g. PRED-8942).
   * @returns Signal record with trajectory and agent deliberation details.
   */
  @Get(":id")
  @ApiOperation({ summary: SwaggerSummary.PREDICTION_BY_ID })
  @ApiParam({ name: "id", example: "PRED-8942" })
  public async findById(@Param("id") id: string): Promise<Signal> {
    this.logger.info(`[findById] Fetching prediction details for ${id}`);
    return this.predictionsService.findOrGenerate(id);
  }

  /**
   * Retrieves price projection trajectory points with quantile confidence cones.
   *
   * @param id The prediction identifier.
   * @returns Array of trajectory points.
   */
  @Get(`:id/${ApiSegment.TRAJECTORY}`)
  @ApiOperation({ summary: SwaggerSummary.PREDICTION_TRAJECTORY })
  @ApiParam({ name: "id", example: "PRED-8942" })
  public async getTrajectory(@Param("id") id: string): Promise<readonly TrajectoryPoint[]> {
    this.logger.info(`[getTrajectory] Fetching trajectory points for ${id}`);
    const signal = await this.predictionsService.findOrGenerate(id);
    return signal.trajectory ?? [];
  }

  /**
   * Executes live quantitative analysis scan across database-backed dynamic universe.
   */
  @Post("analyze")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Execute live quantitative analysis scan across real market universe" })
  public async analyzeMarket(
    @Body()
    dto?: {
      readonly sector?: string;
      readonly symbols?: readonly string[];
      readonly limit?: number;
    },
  ): Promise<readonly Signal[]> {
    this.logger.info(
      `[analyzeMarket] Triggering live quantitative scan [Sector: ${dto?.sector ?? "ALL"}] [Symbols: ${dto?.symbols?.length ?? "ALL"}]`,
    );
    return this.predictionsService.runLiveMarketAnalysis(dto);
  }
}
