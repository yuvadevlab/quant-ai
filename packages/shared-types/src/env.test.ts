/**
 * @fileoverview Unit tests for environment parsing and Zod schemas.
 * @author yuva.devlab@gmail.com
 */

import { describe, it, expect } from "vitest";
import { NodeEnvironment, DatabaseDriver, EventBrokerType, AiProviderType } from "./env.enums";
import {
  NetworkPort,
  DefaultConnectionUrl,
  DefaultNetworkHost,
  DefaultAiModel,
} from "./env.constants";
import { parseApiEnv, parseWebEnv, parseQuantEngineEnv } from "./env.schema";

describe("Environment Configuration Contracts", () => {
  it("provides sensible defaults for ApiEnvironment when empty record is passed", () => {
    const config = parseApiEnv({});
    expect(config.NODE_ENV).toBe(NodeEnvironment.DEVELOPMENT);
    expect(config.PORT).toBe(NetworkPort.API);
    expect(config.WS_PORT).toBe(NetworkPort.WS);
    expect(config.DATABASE_DRIVER).toBe(DatabaseDriver.POSTGRESQL);
    expect(config.DATABASE_URL).toBe(DefaultConnectionUrl.DATABASE);
    expect(config.REDIS_URL).toBe(DefaultConnectionUrl.REDIS);
    expect(config.KAFKA_BROKERS).toBe(DefaultConnectionUrl.KAFKA_BROKERS);
    expect(config.CORS_ORIGIN).toBe(DefaultNetworkHost.WILDCARD);
    expect(config.EVENT_BROKER).toBe(EventBrokerType.MEMORY);
    expect(config.AI_PROVIDER).toBe(AiProviderType.CLINE);
    expect(config.CLINE_BASE_URL).toBe(DefaultConnectionUrl.CLINE_BASE_URL);
    expect(config.CLINE_MODEL).toBe(DefaultAiModel.CLINE_DEFAULT);
    expect(config.CLINE_CHAT_MODEL).toBe(DefaultAiModel.CLINE_CHAT);
  });

  it("correctly overrides API environment properties when provided", () => {
    const customPort = 5000;
    const customWsPort = 5001;
    const customDbUrl = "postgresql://prod_user:secret@db.quantai.internal:5432/quantai_prod";
    const customKafka = "redpanda-1:9092,redpanda-2:9092";

    const config = parseApiEnv({
      NODE_ENV: NodeEnvironment.PRODUCTION,
      PORT: customPort,
      WS_PORT: customWsPort,
      DATABASE_URL: customDbUrl,
      DATABASE_DRIVER: DatabaseDriver.TIMESCALE,
      EVENT_BROKER: EventBrokerType.REDPANDA,
      KAFKA_BROKERS: customKafka,
    });

    expect(config.NODE_ENV).toBe(NodeEnvironment.PRODUCTION);
    expect(config.PORT).toBe(customPort);
    expect(config.WS_PORT).toBe(customWsPort);
    expect(config.DATABASE_DRIVER).toBe(DatabaseDriver.TIMESCALE);
    expect(config.DATABASE_URL).toBe(customDbUrl);
    expect(config.EVENT_BROKER).toBe(EventBrokerType.REDPANDA);
    expect(config.KAFKA_BROKERS).toBe(customKafka);
  });

  it("parses WebEnvironment with Vite URLs", () => {
    const customApiUrl = "https://api.quantai.in/api";
    const customWsUrl = "wss://ws.quantai.in";

    const config = parseWebEnv({
      PORT: NetworkPort.WEB,
      VITE_API_URL: customApiUrl,
      VITE_WS_URL: customWsUrl,
    });

    expect(config.PORT).toBe(NetworkPort.WEB);
    expect(config.VITE_API_URL).toBe(customApiUrl);
    expect(config.VITE_WS_URL).toBe(customWsUrl);
  });

  it("parses QuantEngineEnvironment", () => {
    const config = parseQuantEngineEnv({
      PORT: NetworkPort.QUANT_ENGINE,
      POSTGRES_URL: DefaultConnectionUrl.DATABASE,
    });

    expect(config.PORT).toBe(NetworkPort.QUANT_ENGINE);
    expect(config.POSTGRES_URL).toBe(DefaultConnectionUrl.DATABASE);
  });
});
