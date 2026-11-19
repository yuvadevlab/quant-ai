import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Signal, TrajectoryPoint } from "@quant-ai/contracts";
import { PredictionsService } from "./predictions.service";

/**
 * Controller exposing Prediction Lab query endpoints.
 */
@ApiTags("Predictions")
@Controller("predictions")
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  /**
   * Retrieves all predictions from the ledger.
   *
   * @returns Array of Signal records.
   */
  @Get()
  @ApiOperation({ summary: "Get all market predictions" })
  findAll(): readonly Signal[] {
    return this.predictionsService.findAll();
  }

  /**
   * Retrieves detailed prediction analytics by ID.
   *
   * @param id The prediction identifier (e.g. PRED-8942).
   * @returns Signal record with trajectory and agent deliberation details.
   */
  @Get(":id")
  @ApiOperation({ summary: "Get detailed prediction by ID" })
  @ApiParam({ name: "id", example: "PRED-8942" })
  findById(@Param("id") id: string): Signal {
    return this.predictionsService.findById(id);
  }

  /**
   * Retrieves price projection trajectory points with quantile confidence cones.
   *
   * @param id The prediction identifier.
   * @returns Array of trajectory points.
   */
  @Get(":id/trajectory")
  @ApiOperation({ summary: "Get prediction trajectory quantile confidence cone" })
  @ApiParam({ name: "id", example: "PRED-8942" })
  getTrajectory(@Param("id") id: string): readonly TrajectoryPoint[] {
    return this.predictionsService.getTrajectory(id);
  }
}
