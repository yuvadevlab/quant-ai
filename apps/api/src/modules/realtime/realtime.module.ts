/**
 * @fileoverview NestJS Module encapsulating WebSocket gateway and real-time dispatch service.
 */

import { Module, Global } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";
import { RealtimeService } from "./realtime.service";

/**
 * Global Realtime Module providing real-time WebSocket capabilities across the API.
 */
@Global()
@Module({
  providers: [RealtimeGateway, RealtimeService],
  exports: [RealtimeGateway, RealtimeService],
})
export class RealtimeModule {}
