/**
 * @fileoverview Environment, database driver, and message broker enums.
 */

/**
 * Standard runtime environment classification.
 */
export enum NodeEnvironment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
  STAGING = "staging",
}

/**
 * Database storage engine drivers.
 */
export enum DatabaseDriver {
  POSTGRESQL = "postgresql",
  TIMESCALE = "timescale",
  MEMORY = "memory",
}

/**
 * High-throughput streaming and cache broker backends.
 */
export enum EventBrokerType {
  KAFKA = "kafka",
  REDPANDA = "redpanda",
  REDIS = "redis",
  MEMORY = "memory",
}

/**
 * Multi-agent reasoning LLM providers.
 */
export enum AiProviderType {
  GEMINI = "gemini",
  ANTHROPIC = "anthropic",
  GROQ = "groq",
  OLLAMA = "ollama",
  CLINE = "cline",
  SIMULATED = "simulated",
}

/**
 * Purpose or specialized role for AI model routing.
 */
export enum AiModelPurpose {
  AGENT = "agent",
  CHAT = "chat",
  DELIBERATION = "deliberation",
  ANALYSIS = "analysis",
}
