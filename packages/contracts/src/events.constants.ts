/**
 * @fileoverview Event topics, cache keys, and real-time WebSocket protocol contracts.
 * @author yuva.devlab@gmail.com
 */

/**
 * Event bus and Kafka/Redpanda topic definitions.
 */
export enum EventTopic {
  MARKET_TICKS = "quantai.market.ticks",
  SIGNALS_GENERATED = "quantai.signals.generated",
  REGIME_TRANSITIONS = "quantai.regimes.transitions",
  DELIBERATION_SPEECH = "quantai.deliberation.speech",
  ORDER_EXECUTED = "quantai.orders.executed",
}

/**
 * Low-latency key-value cache namespaces.
 */
export const CachePrefix = {
  TICKER: "cache:ticker:",
  ORDER_BOOK: "cache:orderbook:",
  PREDICTION: "cache:prediction:",
  REGIME: "cache:regime:",
  RATE_LIMIT: "cache:ratelimit:",
} as const;

/**
 * WebSocket subscription room identifiers.
 */
export enum RealtimeRoom {
  TICKERS = "room:tickers",
  SIGNALS = "room:signals",
  ORDER_BOOK = "room:order_book",
  REGIMES = "room:regimes",
  DELIBERATION = "room:deliberation",
}

/**
 * Inbound events emitted by WebSocket clients.
 */
export enum RealtimeClientEvent {
  SUBSCRIBE = "client:subscribe",
  UNSUBSCRIBE = "client:unsubscribe",
  PING = "client:ping",
}

/**
 * Outbound real-time events pushed to subscribers.
 */
export enum RealtimeServerEvent {
  CONNECTED = "server:connected",
  TICK = "server:tick",
  SIGNAL_UPDATE = "server:signal_update",
  REGIME_CHANGE = "server:regime_change",
  AGENT_SPEECH = "server:agent_speech",
  PONG = "server:pong",
}

/**
 * Subscription operation statuses.
 */
export enum RealtimeSubscriptionStatus {
  SUBSCRIBED = "subscribed",
  UNSUBSCRIBED = "unsubscribed",
  ERROR = "error",
  INVALID = "invalid",
}
