/**
 * @fileoverview Health and operational readiness controller.
 * @author yuva.devlab@gmail.com
 */

import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  ApiSegment,
  HealthStatus,
  ServiceIdentity,
  SwaggerSummary,
  SwaggerTag,
} from "@quant-ai/shared-types";
import { ConfigService } from "../infrastructure/config.service";
import { DatabaseService } from "../infrastructure/database.service";

/**
 * Health and operational readiness controller.
 */
@ApiTags(SwaggerTag.HEALTH)
@Controller(ApiSegment.HEALTH)
export class HealthController {
  public constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Performs an operational readiness check with infrastructure diagnostics.
   *
   * @returns Health status object with uptime, database, and broker state.
   */
  @Get()
  @ApiOperation({ summary: SwaggerSummary.HEALTH_CHECK })
  public async check() {
    const dbPing = await this.databaseService.ping();

    return {
      status: HealthStatus.HEALTHY,
      service: ServiceIdentity.API_NAME,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      infrastructure: {
        environment: this.configService.nodeEnv,
        database: {
          driver: this.configService.databaseDriver,
          status: dbPing.status,
          latencyMs: dbPing.latencyMs,
        },
        eventBroker: {
          type: this.configService.eventBroker,
          brokers: this.configService.kafkaBrokers,
        },
      },
    };
  }
}
