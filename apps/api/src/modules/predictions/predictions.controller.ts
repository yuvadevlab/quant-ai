/**
 * @fileoverview Controller exposing Prediction Lab query endpoints.
 * @author yuva.devlab@gmail.com
 */

import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import {
  ApiSegment,
  Signal,
  SwaggerSummary,
  SwaggerTag,
  TrajectoryPoint,
} from "@quant-ai/contracts";
import { PredictionsService } from "./predictions.service";

/**
 * Controller exposing Prediction Lab query endpoints.
 */
@ApiTags(SwaggerTag.PREDICTIONS)
@Controller(ApiSegment.PREDICTIONS)
export class PredictionsController {
  public constructor(private readonly predictionsService: PredictionsService) {}

  /**
   * Retrieves all predictions from the ledger.
   *
   * @returns Array of Signal records.
   */
  @Get()
  @ApiOperation({ summary: SwaggerSummary.ACTIVE_PREDICTIONS })
  public findAll(): readonly Signal[] {
    return this.predictionsService.findAll();
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
  public findById(@Param("id") id: string): Signal {
    return this.predictionsService.findById(id);
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
  public getTrajectory(@Param("id") id: string): readonly TrajectoryPoint[] {
    return this.predictionsService.getTrajectory(id);
  }
}
