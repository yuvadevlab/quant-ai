/**
 * @fileoverview Strongly-typed configuration service validated against @quant-ai/shared-types.
 * @author yuva.devlab@gmail.com
 */

import { Injectable } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import {
  parseApiEnv,
  type ApiEnvironment,
  NodeEnvironment,
  EventBrokerType,
  DatabaseDriver,
  AiProviderType,
} from "@quant-ai/shared-types";

/**
 * Validated configuration provider for the NestJS API gateway.
 */
@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly envConfig: ApiEnvironment;

  public constructor() {
    this.envConfig = parseApiEnv(process.env);
    this.logger.info(
      `[constructor] Config loaded [ENV: ${this.envConfig.NODE_ENV}] [PORT: ${this.envConfig.PORT}] [BROKER: ${this.envConfig.EVENT_BROKER}] [AI: ${this.envConfig.AI_PROVIDER}]`,
    );
  }

  /** Gets active Node environment */
  public get nodeEnv(): NodeEnvironment {
    return this.envConfig.NODE_ENV;
  }

  /** Whether the server is running in production mode */
  public get isProduction(): boolean {
    return this.envConfig.NODE_ENV === NodeEnvironment.PRODUCTION;
  }

  /** HTTP port for REST endpoints */
  public get port(): number {
    return this.envConfig.PORT;
  }

  /** WebSocket gateway port */
  public get wsPort(): number {
    return this.envConfig.WS_PORT;
  }

  /** Database connection string */
  public get databaseUrl(): string {
    return this.envConfig.DATABASE_URL;
  }

  /** Storage engine driver */
  public get databaseDriver(): DatabaseDriver {
    return this.envConfig.DATABASE_DRIVER;
  }

  /** Redis connection URL */
  public get redisUrl(): string {
    return this.envConfig.REDIS_URL;
  }

  /** Kafka / Redpanda broker list */
  public get kafkaBrokers(): string {
    return this.envConfig.KAFKA_BROKERS;
  }

  /** Active event broker backend */
  public get eventBroker(): EventBrokerType {
    return this.envConfig.EVENT_BROKER;
  }

  /** Python Quantitative Engine microservice URL */
  public get quantEngineUrl(): string {
    return this.envConfig.QUANT_ENGINE_URL;
  }

  /** CORS permitted origin */
  public get corsOrigin(): string {
    return this.envConfig.CORS_ORIGIN;
  }

  /** JWT Secret key */
  public get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  /** Configured primary AI model provider */
  public get aiProvider(): AiProviderType {
    return this.envConfig.AI_PROVIDER;
  }

  /** Agent role specific provider override (e.g. for heavy reasoning) */
  public get aiProviderAgent(): AiProviderType | undefined {
    return this.envConfig.AI_PROVIDER_AGENT;
  }

  /** Chat role specific provider override (e.g. for fast conversational responses) */
  public get aiProviderChat(): AiProviderType | undefined {
    return this.envConfig.AI_PROVIDER_CHAT;
  }

  /** Cline API Gateway base URL */
  public get clineBaseUrl(): string {
    return this.envConfig.CLINE_BASE_URL;
  }

  /** Cline API path */
  public get clineApiPath(): string {
    return this.envConfig.CLINE_API_PATH;
  }

  /** Cline API authentication key */
  public get clineApiKey(): string {
    return this.envConfig.CLINE_API_KEY ?? "";
  }

  /** Default Cline model */
  public get clineModel(): string {
    return this.envConfig.CLINE_MODEL;
  }

  /** Specialized Cline model for deliberation & agent reasoning */
  public get clineAgentModel(): string {
    return this.envConfig.CLINE_AGENT_MODEL;
  }

  /** Specialized Cline model for fast chat & copilot interactions */
  public get clineChatModel(): string {
    return this.envConfig.CLINE_CHAT_MODEL;
  }

  /** Specialized Cline model for statistical and technical pattern recognition */
  public get clineAnalysisModel(): string {
    return this.envConfig.CLINE_ANALYSIS_MODEL;
  }

  /** Google Gemini API Key */
  public get geminiApiKey(): string {
    return this.envConfig.GEMINI_API_KEY ?? "";
  }

  /** Anthropic Claude API Key */
  public get anthropicApiKey(): string {
    return this.envConfig.ANTHROPIC_API_KEY ?? "";
  }

  /** Groq API Key */
  public get groqApiKey(): string {
    return this.envConfig.GROQ_API_KEY ?? "";
  }

  /** Local Ollama endpoint base URL */
  public get ollamaBaseUrl(): string {
    return this.envConfig.OLLAMA_BASE_URL ?? "http://localhost:11434";
  }

  /** Primary Yahoo Finance chart endpoint */
  public get yahooFinanceBaseUrl(): string {
    return this.envConfig.YAHOO_FINANCE_BASE_URL;
  }

  /** Secondary Yahoo Finance fallback endpoint */
  public get yahooFinanceFallbackUrl(): string {
    return this.envConfig.YAHOO_FINANCE_FALLBACK_URL;
  }

  /** NSE India allIndices endpoint */
  public get nseIndiaApiUrl(): string {
    return this.envConfig.NSE_INDIA_API_URL;
  }

  /** Finvasia Shoonya WebSocket streaming gateway */
  public get shoonyaWsUrl(): string {
    return this.envConfig.SHOONYA_WS_URL;
  }

  /** Finvasia Shoonya REST trade portal base URL */
  public get shoonyaBaseUrl(): string {
    return this.envConfig.SHOONYA_BASE_URL;
  }

  /** Zerodha Kite Connect WebSocket streaming gateway */
  public get kiteWsUrl(): string {
    return this.envConfig.KITE_WS_URL;
  }

  /** Zerodha Kite Connect REST API gateway */
  public get kiteBaseUrl(): string {
    return this.envConfig.KITE_BASE_URL;
  }

  /** Browser User-Agent string for upstream market feed requests */
  public get marketFeedUserAgent(): string {
    return this.envConfig.MARKET_FEED_USER_AGENT;
  }
}
