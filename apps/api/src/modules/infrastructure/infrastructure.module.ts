/**
 * @fileoverview Global Infrastructure Module providing database, cache, event bus, and config services.
 * @author yuva.devlab@gmail.com
 */

import { Module, Global } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { DatabaseService } from "./database.service";
import { RedisService } from "./redis.service";
import { EventBusService } from "./event-bus.service";

/**
 * Global infrastructure module providing centralized persistence, cache, and streaming capabilities.
 */
@Global()
@Module({
  providers: [ConfigService, DatabaseService, RedisService, EventBusService],
  exports: [ConfigService, DatabaseService, RedisService, EventBusService],
})
export class InfrastructureModule {}
