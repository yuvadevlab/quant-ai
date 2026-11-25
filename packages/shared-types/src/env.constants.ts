/**
 * @fileoverview Canonical environment keys, network ports, hostnames, and default connection strings.
 * @author yuva.devlab@gmail.com
 */

/**
 * Standard environment variable names across all services.
 */
export enum EnvKey {
  NODE_ENV = "NODE_ENV",
  PORT = "PORT",
  WS_PORT = "WS_PORT",
  WEB_PORT = "WEB_PORT",
  CORS_ORIGIN = "CORS_ORIGIN",
  DATABASE_URL = "DATABASE_URL",
  DATABASE_DRIVER = "DATABASE_DRIVER",
  REDIS_URL = "REDIS_URL",
  REDIS_HOST = "REDIS_HOST",
  REDIS_PORT = "REDIS_PORT",
  KAFKA_BROKERS = "KAFKA_BROKERS",
  EVENT_BROKER = "EVENT_BROKER",
  QUANT_ENGINE_URL = "QUANT_ENGINE_URL",
  QUANT_ENGINE_PORT = "QUANT_ENGINE_PORT",
  JWT_SECRET = "JWT_SECRET",
  AI_PROVIDER = "AI_PROVIDER",
  AI_PROVIDER_AGENT = "AI_PROVIDER_AGENT",
  AI_PROVIDER_CHAT = "AI_PROVIDER_CHAT",
  CLINE_BASE_URL = "CLINE_BASE_URL",
  CLINE_API_PATH = "CLINE_API_PATH",
  CLINE_API_KEY = "CLINE_API_KEY",
  CLINE_MODEL = "CLINE_MODEL",
  CLINE_AGENT_MODEL = "CLINE_AGENT_MODEL",
  CLINE_CHAT_MODEL = "CLINE_CHAT_MODEL",
  CLINE_ANALYSIS_MODEL = "CLINE_ANALYSIS_MODEL",
  GEMINI_API_KEY = "GEMINI_API_KEY",
  ANTHROPIC_API_KEY = "ANTHROPIC_API_KEY",
  GROQ_API_KEY = "GROQ_API_KEY",
  OLLAMA_BASE_URL = "OLLAMA_BASE_URL",
  AI_GATEWAY_URL = "AI_GATEWAY_URL",
  YAHOO_FINANCE_BASE_URL = "YAHOO_FINANCE_BASE_URL",
  YAHOO_FINANCE_FALLBACK_URL = "YAHOO_FINANCE_FALLBACK_URL",
  NSE_INDIA_API_URL = "NSE_INDIA_API_URL",
  SHOONYA_WS_URL = "SHOONYA_WS_URL",
  SHOONYA_BASE_URL = "SHOONYA_BASE_URL",
  KITE_WS_URL = "KITE_WS_URL",
  KITE_BASE_URL = "KITE_BASE_URL",
  MARKET_FEED_USER_AGENT = "MARKET_FEED_USER_AGENT",
  VITE_API_URL = "VITE_API_URL",
  VITE_WS_URL = "VITE_WS_URL",
  VITE_PORT = "VITE_PORT",
  MODE = "MODE",
}

/**
 * Canonical port assignments for local and docker networking.
 */
export enum NetworkPort {
  WEB = 3005,
  API = 4005,
  WS = 4006,
  QUANT_ENGINE = 8000,
  POSTGRES = 5432,
  REDIS = 6379,
  KAFKA_EXTERNAL = 19092,
  KAFKA_INTERNAL = 9092,
  REDPANDA_ADMIN = 9644,
  REDPANDA_SCHEMA = 8081,
}

/**
 * Default network hosts and IP addresses.
 */
export const DefaultNetworkHost = {
  LOCALHOST: "localhost",
  LOCAL_IP: "127.0.0.1",
  WILDCARD: "*",
} as const;

/**
 * Default fallback connection URLs for local development and testing.
 */
export const DefaultConnectionUrl = {
  DATABASE: "postgresql://quantai:quantai_secret@localhost:5432/quantai_db",
  REDIS: "redis://localhost:6379",
  KAFKA_BROKERS: "localhost:19092",
  QUANT_ENGINE: "http://localhost:8000",
  API_GATEWAY: "http://localhost:4005/api",
  WS_GATEWAY: "ws://localhost:4006",
  CORS_DEV_WEB: "http://localhost:3005",
  CORS_DEV_WEB_IP: "http://127.0.0.1:3005",
  CLINE_BASE_URL: "https://api.cline.bot/api/v1",
  CLINE_API_PATH: "/chat/completions",
  YAHOO_FINANCE_BASE_URL: "https://query2.finance.yahoo.com/v8/finance/chart",
  YAHOO_FINANCE_FALLBACK_URL: "https://query1.finance.yahoo.com/v8/finance/chart",
  NSE_INDIA_API_URL: "https://www.nseindia.com/api/allIndices",
  SHOONYA_WS_URL: "wss://api.shoonya.com/NorenWSAPI/",
  SHOONYA_BASE_URL: "https://api.shoonya.com/NorenWSTP/",
  KITE_WS_URL: "wss://ws.kite.trade",
  KITE_BASE_URL: "https://api.kite.trade",
} as const;

/**
 * Default multi-purpose AI model identifiers conforming to DevLab standards.
 */
export const DefaultAiModel = {
  CLINE_DEFAULT: "nvidia/nemotron-3.5-super-vl:free",
  CLINE_AGENT: "nvidia/nemotron-3.5-super-vl:free",
  CLINE_CHAT: "upstage/solar-mini4",
  CLINE_ANALYSIS: "meta-llama/llama-3.3-70b-instruct:free",
} as const;

/**
 * Canonical HTTP headers and User-Agent signatures for upstream data feeds.
 */
export const DefaultHttpHeader = {
  MARKET_FEED_USER_AGENT:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
} as const;

/**
 * Fallback development secrets (strictly for local development).
 */
export const DefaultSecret = {
  DEV_JWT: "quantai-super-secret-jwt-key-development",
} as const;
