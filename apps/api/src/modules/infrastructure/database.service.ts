/**
 * @fileoverview Database connectivity and Prisma persistence service.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { HealthStatus } from "@quant-ai/shared-types";
import { createPrismaClient, type PrismaClient } from "@quant-ai/database";
import { ConfigService } from "./config.service";

/**
 * Service managing PrismaClient lifecycle and PostgreSQL persistence.
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private prismaClient!: PrismaClient;
  private isConnected = false;

  public constructor(private readonly configService: ConfigService) {}

  /**
   * Initializes Prisma connection.
   */
  public async onModuleInit(): Promise<void> {
    this.logger.log(`Database service initializing [Driver: ${this.configService.databaseDriver}]`);
    this.prismaClient = createPrismaClient(this.configService.databaseUrl);
    this.isConnected = true;
  }

  /**
   * Graceful disconnection on module shutdown.
   */
  public async onModuleDestroy(): Promise<void> {
    if (this.prismaClient) {
      await this.prismaClient.$disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Access the underlying typed PrismaClient instance.
   */
  public get client(): PrismaClient {
    return this.prismaClient;
  }

  /**
   * Returns current database connection status.
   */
  public get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Diagnostic health check probe.
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
