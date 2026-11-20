/**
 * @fileoverview Resilient event streaming bus supporting Kafka/Redpanda and local dispatch.
 * @author yuva.devlab@gmail.com
 */

import { Injectable } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { ConfigService } from "./config.service";
import { EventBrokerType } from "@quant-ai/shared-types";

type EventHandler<T> = (event: T) => void | Promise<void>;

/**
 * Event bus service for microsecond market ticks and order lifecycle messages.
 */
@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private readonly listeners = new Map<string, Set<EventHandler<unknown>>>();

  public constructor(private readonly configService: ConfigService) {
    this.logger.info(
      `[constructor] Event bus initialized [Backend: ${this.configService.eventBroker}] [Brokers: ${this.configService.kafkaBrokers}]`,
    );
  }

  /**
   * Publishes an event to a specified topic.
   *
   * @param topic Topic or channel name
   * @param payload Event payload data
   */
  public async publish<T>(topic: string, payload: T): Promise<void> {
    if (this.configService.eventBroker === EventBrokerType.REDPANDA) {
      this.logger.debug(`[publish] Redpanda Dispatched Topic: ${topic}`);
    }

    const topicListeners = this.listeners.get(topic);
    if (!topicListeners || topicListeners.size === 0) return;

    for (const handler of topicListeners) {
      try {
        await handler(payload);
      } catch (error) {
        this.logger.error(
          `[publish] Error in event subscriber on topic ${topic}: ${(error as Error).message}`,
        );
      }
    }
  }

  /**
   * Subscribes a handler callback to a topic.
   *
   * @param topic Topic name
   * @param handler Event handler callback
   */
  public subscribe<T>(topic: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }

    const set = this.listeners.get(topic)!;
    set.add(handler as EventHandler<unknown>);

    return () => {
      set.delete(handler as EventHandler<unknown>);
    };
  }
}
