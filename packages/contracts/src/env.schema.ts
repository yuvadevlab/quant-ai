/**
 * @fileoverview Zod schemas and validation parsers for multi-service environments.
 * @author yuva.devlab@gmail.com
 */

import { z } from "zod";
import { NodeEnvironment, DatabaseDriver, EventBrokerType, AiProviderType } from "./env.enums";
import {
  NetworkPort,
  DefaultNetworkHost,
  DefaultConnectionUrl,
  DefaultSecret,
} from "./env.constants";

/**
 * Zod schema for NestJS API Gateway environment variables.
 */
export const ApiEnvironmentSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvironment).default(NodeEnvironment.DEVELOPMENT),
  PORT: z.coerce.number().int().positive().default(NetworkPort.API),
  WS_PORT: z.coerce.number().int().positive().default(NetworkPort.WS),
  CORS_ORIGIN: z.string().default(DefaultNetworkHost.WILDCARD),
  DATABASE_URL: z.string().url().default(DefaultConnectionUrl.DATABASE),
  DATABASE_DRIVER: z.nativeEnum(DatabaseDriver).default(DatabaseDriver.POSTGRESQL),
  REDIS_URL: z.string().url().default(DefaultConnectionUrl.REDIS),
  KAFKA_BROKERS: z.string().default(DefaultConnectionUrl.KAFKA_BROKERS),
  EVENT_BROKER: z.nativeEnum(EventBrokerType).default(EventBrokerType.MEMORY),
  QUANT_ENGINE_URL: z.string().url().default(DefaultConnectionUrl.QUANT_ENGINE),
  JWT_SECRET: z.string().min(8).default(DefaultSecret.DEV_JWT),
  AI_PROVIDER: z.nativeEnum(AiProviderType).default(AiProviderType.GEMINI),
  GEMINI_API_KEY: z.string().optional().default(""),
});

/**
 * Zod schema for Web Workstation frontend environment variables.
 */
export const WebEnvironmentSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvironment).default(NodeEnvironment.DEVELOPMENT),
  PORT: z.coerce.number().int().positive().default(NetworkPort.WEB),
  VITE_API_URL: z.string().default(DefaultConnectionUrl.API_GATEWAY),
  VITE_WS_URL: z.string().default(DefaultConnectionUrl.WS_GATEWAY),
});

/**
 * Zod schema for Python Quantitative Engine environment variables.
 */
export const QuantEngineEnvironmentSchema = z.object({
  ENVIRONMENT: z.nativeEnum(NodeEnvironment).default(NodeEnvironment.DEVELOPMENT),
  PORT: z.coerce.number().int().positive().default(NetworkPort.QUANT_ENGINE),
  POSTGRES_URL: z.string().default(DefaultConnectionUrl.DATABASE),
  REDIS_URL: z.string().default(DefaultConnectionUrl.REDIS),
  KAFKA_BROKERS: z.string().default(DefaultConnectionUrl.KAFKA_BROKERS),
  AI_GATEWAY_URL: z.string().optional().default(""),
  GEMINI_API_KEY: z.string().optional().default(""),
});

/**
 * Safely parses and validates API Gateway environment records.
 *
 * @param env Raw key-value dictionary representing environment variables
 * @returns Validated ApiEnvironment configuration
 */
export function parseApiEnv(env: Record<string, unknown>): z.infer<typeof ApiEnvironmentSchema> {
  return ApiEnvironmentSchema.parse(env);
}

/**
 * Safely parses and validates Web workstation environment records.
 *
 * @param env Raw key-value dictionary representing environment variables
 * @returns Validated WebEnvironment configuration
 */
export function parseWebEnv(env: Record<string, unknown>): z.infer<typeof WebEnvironmentSchema> {
  return WebEnvironmentSchema.parse(env);
}

/**
 * Safely parses and validates Python Quantitative Engine environment records.
 *
 * @param env Raw key-value dictionary representing environment variables
 * @returns Validated QuantEngineEnvironment configuration
 */
export function parseQuantEngineEnv(
  env: Record<string, unknown>,
): z.infer<typeof QuantEngineEnvironmentSchema> {
  return QuantEngineEnvironmentSchema.parse(env);
}
