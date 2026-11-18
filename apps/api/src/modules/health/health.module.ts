import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";

/**
 * Health module providing container liveness and readiness probes.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
