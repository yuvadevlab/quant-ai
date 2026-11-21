/**
 * @fileoverview Database connectivity and Prisma persistence service.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { HealthStatus } from "@quant-ai/shared-types";
import { SystemConfigKey } from "@quant-ai/quant-core";
import {
  createPrismaClient,
  seedLlmProvidersAndModels,
  type PrismaClient,
} from "@quant-ai/database";
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
    this.logger.info(
      `[onModuleInit] Database service initializing [Driver: ${this.configService.databaseDriver}]`,
    );
    this.prismaClient = createPrismaClient(this.configService.databaseUrl);
    this.isConnected = true;

    try {
      const count = await this.prismaClient.llmModel.count();
      if (count === 0) {
        this.logger.info(
          "[onModuleInit] Seeding initial LLM providers and models into database...",
        );
        await seedLlmProvidersAndModels(this.prismaClient);
        this.logger.info("[onModuleInit] Seeded LLM providers and models successfully.");
      }

      const configCount = await this.prismaClient.systemConfig.count();
      if (configCount === 0) {
        this.logger.info("[onModuleInit] Seeding initial configurable market parameters...");
        await this.prismaClient.systemConfig.createMany({
          data: [
            {
              key: SystemConfigKey.MARKET_BREADTH,
              description:
                "Configurable market breadth, institutional flows, and regime thresholds",
              value: {
                totalUniverseCount: 2214,
                fiiNetCr: 2145.0,
                diiNetCr: 1280.0,
                fiiCurrencyPrefix: "₹",
                fiiUnitSuffix: "Cr",
                vixLowThreshold: 15.0,
                vixHighThreshold: 22.0,
                bullishRegime: "Institutional Accumulation",
                cautiousRegime: "Distribution & Profit Taking",
                neutralRegime: "Consolidation & Rangebound",
                lowVolText: "Low Volatility",
                elevatedVolText: "Elevated Volatility",
                highVolText: "Extreme Volatility",
              },
            },
            {
              key: SystemConfigKey.SECTOR_MOMENTUM,
              description: "Configurable sector momentum classification percentage thresholds",
              value: {
                strongThreshold: 1.5,
                moderateThreshold: 0.5,
                weakThreshold: -1.0,
              },
            },
          ],
        });
        this.logger.info("[onModuleInit] Seeded market configs successfully.");
      }
    } catch (error) {
      this.logger.warn(`[onModuleInit] Could not seed initial database assets: ${String(error)}`);
    }
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
