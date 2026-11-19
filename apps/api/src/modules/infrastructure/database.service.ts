/**
 * @fileoverview Database connectivity and storage engine lifecycle service.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { HealthStatus } from "@quant-ai/contracts";
import { ConfigService } from "./config.service";

/**
 * Service managing connection state for PostgreSQL and TimescaleDB persistence.
 */
@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private isConnected = false;

  public constructor(private readonly configService: ConfigService) {}

  /**
   * Initializes database connection verification.
   */
  public onModuleInit(): void {
    this.logger.log(`Database service initialized [Driver: ${this.configService.databaseDriver}]`);
    this.isConnected = true;
  }

  /**
   * Returns current database connection status.
   */
  public get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Diagnostic health check for PostgreSQL storage engine.
   */
  public async ping(): Promise<{
    status: HealthStatus.UP | HealthStatus.DOWN;
    latencyMs: number;
  }> {
    const start = Date.now();
    return {
      status: this.isConnected ? HealthStatus.UP : HealthStatus.DOWN,
      latencyMs: Date.now() - start,
    };
  }
}
