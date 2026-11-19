/**
 * @fileoverview Strongly-typed configuration service validated against @quant-ai/shared-types.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Logger } from "@nestjs/common";
import {
  parseApiEnv,
  type ApiEnvironment,
  NodeEnvironment,
  EventBrokerType,
  DatabaseDriver,
} from "@quant-ai/shared-types";

/**
 * Validated configuration provider for the NestJS API gateway.
 */
@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly envConfig: ApiEnvironment;

  public constructor() {
    this.envConfig = parseApiEnv(process.env);
    this.logger.log(
      `Config loaded [ENV: ${this.envConfig.NODE_ENV}] [PORT: ${this.envConfig.PORT}] [BROKER: ${this.envConfig.EVENT_BROKER}]`,
    );
  }

  /** Gets active Node environment */
  public get nodeEnv(): NodeEnvironment {
    return this.envConfig.NODE_ENV;
  }

  /** Whether the server is running in production mode */
  public get isProduction(): boolean {
    return this.envConfig.NODE_ENV === NodeEnvironment.PRODUCTION;
  }

  /** HTTP port for REST endpoints */
  public get port(): number {
    return this.envConfig.PORT;
  }

  /** WebSocket gateway port */
  public get wsPort(): number {
    return this.envConfig.WS_PORT;
  }

  /** Database connection string */
  public get databaseUrl(): string {
    return this.envConfig.DATABASE_URL;
  }

  /** Storage engine driver */
  public get databaseDriver(): DatabaseDriver {
    return this.envConfig.DATABASE_DRIVER;
  }

  /** Redis connection URL */
  public get redisUrl(): string {
    return this.envConfig.REDIS_URL;
  }

  /** Kafka / Redpanda broker list */
  public get kafkaBrokers(): string {
    return this.envConfig.KAFKA_BROKERS;
  }

  /** Active event broker backend */
  public get eventBroker(): EventBrokerType {
    return this.envConfig.EVENT_BROKER;
  }

  /** Python Quantitative Engine microservice URL */
  public get quantEngineUrl(): string {
    return this.envConfig.QUANT_ENGINE_URL;
  }

  /** CORS permitted origin */
  public get corsOrigin(): string {
    return this.envConfig.CORS_ORIGIN;
  }

  /** JWT Secret key */
  public get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }
}
