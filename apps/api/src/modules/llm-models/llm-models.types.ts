/**
 * @file apps/api/src/modules/llm-models/llm-models.types.ts
 * @description Data contracts and DTOs for dynamic database-registered LLM providers and models.
 */

/**
 * Payload for registering a new LLM model under a provider.
 */
export interface CreateLlmModelDto {
  readonly providerId: string;
  readonly name: string;
  readonly modelIdentifier: string;
  readonly description?: string;
  readonly capabilities?: Record<string, unknown>;
  readonly defaultConfig?: Record<string, unknown>;
  readonly contextWindow?: number;
  readonly isDefault?: boolean;
  readonly isEnabled?: boolean;
  readonly sortOrder?: number;
}

/**
 * Payload for deprecating an existing model in the database without deletion.
 */
export interface DeprecateLlmModelDto {
  readonly deprecationNote?: string;
}

/**
 * Payload for registering a new provider in the database.
 */
export interface CreateLlmProviderDto {
  readonly name: string;
  readonly slug: string;
  readonly providerType: string;
  readonly description?: string;
  readonly baseUrl?: string;
  readonly config?: Record<string, unknown>;
  readonly isEnabled?: boolean;
  readonly sortOrder?: number;
}
