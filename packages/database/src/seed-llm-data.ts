/**
 * @file packages/database/src/seed-llm-data.ts
 * @description Master catalog of AI providers and models with deprecation metadata for seeding.
 * @author yuva.devlab@gmail.com
 */

export interface SeedModelDef {
  readonly name: string;
  readonly modelIdentifier: string;
  readonly description: string;
  readonly contextWindow: number;
  readonly isDefault: boolean;
  readonly isEnabled: boolean;
  readonly isDeprecated: boolean;
  readonly deprecatedAt?: Date;
  readonly deprecationNote?: string;
  readonly sortOrder: number;
  readonly capabilities: Record<string, unknown>;
}

export interface SeedProviderDef {
  readonly name: string;
  readonly slug: string;
  readonly providerType: string;
  readonly description: string;
  readonly baseUrl?: string;
  readonly isEnabled: boolean;
  readonly sortOrder: number;
  readonly models: readonly SeedModelDef[];
}

export const PROVIDER_SEEDS: readonly SeedProviderDef[] = [
  {
    name: "Google Gemini",
    slug: "google-gemini",
    providerType: "gemini",
    description: "Frontier multimodal reasoning engines with 1M+ token context windows.",
    isEnabled: true,
    sortOrder: 1,
    models: [
      {
        name: "Gemini 2.5 Pro",
        modelIdentifier: "gemini-2.5-pro",
        description: "Primary institutional multi-agent reasoning and deliberation engine.",
        contextWindow: 1048576,
        isDefault: true,
        isEnabled: true,
        isDeprecated: false,
        sortOrder: 1,
        capabilities: { reasoning: true, multimodal: true, tools: true },
      },
      {
        name: "Gemini 2.5 Flash",
        modelIdentifier: "gemini-2.5-flash",
        description: "Sub-second low-latency tick classification and micro-regime detection.",
        contextWindow: 1048576,
        isDefault: false,
        isEnabled: true,
        isDeprecated: false,
        sortOrder: 2,
        capabilities: { streaming: true, fastInference: true },
      },
      {
        name: "Gemini 1.5 Pro (Legacy)",
        modelIdentifier: "gemini-1.5-pro",
        description: "Historical model preserved in database for audit trail & backtest logging.",
        contextWindow: 1048576,
        isDefault: false,
        isEnabled: false,
        isDeprecated: true,
        deprecatedAt: new Date("2026-06-01T00:00:00.000Z"),
        deprecationNote: "Superseded by Gemini 2.5 Pro for live market deliberations.",
        sortOrder: 10,
        capabilities: { reasoning: true },
      },
    ],
  },
  {
    name: "Anthropic Claude",
    slug: "anthropic",
    providerType: "anthropic",
    description: "Frontier reasoning and hybrid thinking models for deep risk skepticism.",
    isEnabled: true,
    sortOrder: 2,
    models: [
      {
        name: "Claude 3.7 Sonnet",
        modelIdentifier: "claude-3-7-sonnet",
        description: "Hybrid thinking architecture specialized in counter-trend risk analysis.",
        contextWindow: 200000,
        isDefault: false,
        isEnabled: true,
        isDeprecated: false,
        sortOrder: 1,
        capabilities: { extendedThinking: true, analysis: true },
      },
      {
        name: "Claude 3.5 Sonnet (Legacy)",
        modelIdentifier: "claude-3-5-sonnet-20241022",
        description: "Historical risk engine model preserved for regulatory trade audit trail.",
        contextWindow: 200000,
        isDefault: false,
        isEnabled: false,
        isDeprecated: true,
        deprecatedAt: new Date("2026-05-15T00:00:00.000Z"),
        deprecationNote: "Deprecated in favor of Claude 3.7 Sonnet with extended thinking.",
        sortOrder: 10,
        capabilities: { analysis: true },
      },
    ],
  },
  {
    name: "Ollama Local Edge",
    slug: "ollama",
    providerType: "ollama",
    description: "On-premise zero-cloud latency inference for proprietary trading desks.",
    baseUrl: "http://localhost:11434",
    isEnabled: true,
    sortOrder: 3,
    models: [
      {
        name: "DeepSeek R1 14B",
        modelIdentifier: "deepseek-r1:14b",
        description: "Local chain-of-thought statistical and mathematical quant reasoner.",
        contextWindow: 65536,
        isDefault: false,
        isEnabled: true,
        isDeprecated: false,
        sortOrder: 1,
        capabilities: { chainOfThought: true, offline: true },
      },
    ],
  },
  {
    name: "Groq LPUs",
    slug: "groq",
    providerType: "groq",
    description: "Ultra-fast deterministic LPU hardware inference engine.",
    isEnabled: true,
    sortOrder: 4,
    models: [
      {
        name: "Llama 3.3 70B Versatile",
        modelIdentifier: "llama-3.3-70b-versatile",
        description: "Sub-50ms token generation for high-velocity order-book sentiment parsing.",
        contextWindow: 131072,
        isDefault: false,
        isEnabled: true,
        isDeprecated: false,
        sortOrder: 1,
        capabilities: { ultraFast: true },
      },
    ],
  },
  {
    name: "Simulated Quant Engine",
    slug: "simulated",
    providerType: "simulated",
    description: "Deterministic local testing and fallback simulation engine.",
    isEnabled: true,
    sortOrder: 5,
    models: [
      {
        name: "Simulated Quant v1",
        modelIdentifier: "simulated-quant-v1",
        description: "Zero-cost local statistical simulation for automated testing and CI.",
        contextWindow: 32768,
        isDefault: false,
        isEnabled: true,
        isDeprecated: false,
        sortOrder: 1,
        capabilities: { deterministic: true },
      },
    ],
  },
];
