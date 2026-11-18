import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Health and operational readiness controller.
 */
@ApiTags("Health")
@Controller("health")
export class HealthController {
  /**
   * Performs an operational readiness check.
   *
   * @returns Health status object with service uptime and version.
   */
  @Get()
  @ApiOperation({ summary: "Service readiness probe" })
  check() {
    return {
      status: "healthy",
      service: "@quant-ai/api",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
