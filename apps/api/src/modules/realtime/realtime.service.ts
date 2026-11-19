/**
 * @fileoverview Service providing high-level broadcasting methods for real-time workstation updates.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Logger } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";
import type {
  RealtimeTickPayload,
  RealtimeRegimePayload,
  RealtimeAgentSpeechPayload,
  RealtimeSignalPayload,
} from "./realtime.types";

/**
 * Service managing real-time push dispatches to connected workstation clients.
 */
@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  public constructor(private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Publishes market tick updates to WebSocket clients.
   *
   * @param tick Market tick data payload
   */
  public emitTick(tick: RealtimeTickPayload): void {
    try {
      this.realtimeGateway.broadcastTick(tick);
    } catch (error) {
      this.logger.warn(`Failed to broadcast tick: ${(error as Error).message}`);
    }
  }

  /**
   * Publishes market regime transitions to WebSocket clients.
   *
   * @param regime Regime shift payload
   */
  public emitRegimeChange(regime: RealtimeRegimePayload): void {
    try {
      this.realtimeGateway.broadcastRegimeChange(regime);
    } catch (error) {
      this.logger.warn(`Failed to broadcast regime change: ${(error as Error).message}`);
    }
  }

  /**
   * Publishes signal updates to WebSocket clients.
   *
   * @param signal Signal update payload
   */
  public emitSignalUpdate(signal: RealtimeSignalPayload): void {
    try {
      this.realtimeGateway.broadcastSignalUpdate(signal);
    } catch (error) {
      this.logger.warn(`Failed to broadcast signal update: ${(error as Error).message}`);
    }
  }

  /**
   * Publishes multi-agent reasoning verdict updates to WebSocket clients.
   *
   * @param speech Multi-agent deliberation speech payload
   */
  public emitAgentSpeech(speech: RealtimeAgentSpeechPayload): void {
    try {
      this.realtimeGateway.broadcastAgentSpeech(speech);
    } catch (error) {
      this.logger.warn(`Failed to broadcast agent speech: ${(error as Error).message}`);
    }
  }
}
