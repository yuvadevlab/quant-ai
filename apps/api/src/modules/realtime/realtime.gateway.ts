/**
 * @fileoverview WebSocket gateway for low-latency market ticks and deliberation streams.
 * @author yuva.devlab@gmail.com
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@yuva-devlab/logger";
import {
  DefaultNetworkHost,
  HttpMethod,
  RealtimeClientEvent,
  RealtimeRoom,
  RealtimeServerEvent,
  RealtimeSubscriptionStatus,
  WsNamespace,
} from "@quant-ai/shared-types";
import type {
  ClientSubscriptionPayload,
  RealtimeTickPayload,
  RealtimeRegimePayload,
  RealtimeAgentSpeechPayload,
  RealtimeSignalPayload,
} from "./realtime.types";

/**
 * Socket.IO Realtime Gateway for QuantAI workstation.
 */
@WebSocketGateway({
  cors: {
    origin: DefaultNetworkHost.WILDCARD,
    methods: [HttpMethod.GET, HttpMethod.POST],
  },
  namespace: WsNamespace.REALTIME,
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  public server!: Server;

  /**
   * Handles new client connection and greets with server state.
   */
  public handleConnection(client: Socket): void {
    this.logger.info(`[handleConnection] Client connected: ${client.id}`);
    client.emit(RealtimeServerEvent.CONNECTED, {
      clientId: client.id,
      timestamp: new Date().toISOString(),
      roomsAvailable: Object.values(RealtimeRoom),
    });
  }

  /**
   * Handles client disconnection.
   */
  public handleDisconnect(client: Socket): void {
    this.logger.info(`[handleDisconnect] Client disconnected: ${client.id}`);
  }

  /**
   * Subscribes client to a specific real-time topic room.
   */
  @SubscribeMessage(RealtimeClientEvent.SUBSCRIBE)
  public handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ClientSubscriptionPayload,
  ): { status: RealtimeSubscriptionStatus; room: string } {
    if (!payload?.room) {
      return {
        status: RealtimeSubscriptionStatus.ERROR,
        room: RealtimeSubscriptionStatus.INVALID,
      };
    }
    client.join(payload.room);
    this.logger.debug(`[handleSubscribe] Client ${client.id} joined ${payload.room}`);
    return {
      status: RealtimeSubscriptionStatus.SUBSCRIBED,
      room: payload.room,
    };
  }

  /**
   * Unsubscribes client from a specific topic room.
   */
  @SubscribeMessage(RealtimeClientEvent.UNSUBSCRIBE)
  public handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ClientSubscriptionPayload,
  ): { status: RealtimeSubscriptionStatus; room: string } {
    if (!payload?.room) {
      return {
        status: RealtimeSubscriptionStatus.ERROR,
        room: RealtimeSubscriptionStatus.INVALID,
      };
    }
    client.leave(payload.room);
    this.logger.debug(`[handleUnsubscribe] Client ${client.id} left ${payload.room}`);
    return {
      status: RealtimeSubscriptionStatus.UNSUBSCRIBED,
      room: payload.room,
    };
  }

  /**
   * Responds to client heartbeat ping.
   */
  @SubscribeMessage(RealtimeClientEvent.PING)
  public handlePing(@ConnectedSocket() client: Socket): void {
    client.emit(RealtimeServerEvent.PONG, {
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Broadcasts a market index tick to subscribers in TICKERS room.
   */
  public broadcastTick(payload: RealtimeTickPayload): void {
    if (!this.server) return;
    this.server.to(RealtimeRoom.TICKERS).emit(RealtimeServerEvent.TICK, payload);
  }

  /**
   * Broadcasts market regime shifts to subscribers in REGIMES room.
   */
  public broadcastRegimeChange(payload: RealtimeRegimePayload): void {
    if (!this.server) return;
    this.server.to(RealtimeRoom.REGIMES).emit(RealtimeServerEvent.REGIME_CHANGE, payload);
  }

  /**
   * Broadcasts signal trajectory updates to SIGNALS room.
   */
  public broadcastSignalUpdate(payload: RealtimeSignalPayload): void {
    if (!this.server) return;
    this.server.to(RealtimeRoom.SIGNALS).emit(RealtimeServerEvent.SIGNAL_UPDATE, payload);
  }

  /**
   * Broadcasts multi-agent deliberation speech tokens to DELIBERATION room.
   */
  public broadcastAgentSpeech(payload: RealtimeAgentSpeechPayload): void {
    if (!this.server) return;
    this.server.to(RealtimeRoom.DELIBERATION).emit(RealtimeServerEvent.AGENT_SPEECH, payload);
  }
}
