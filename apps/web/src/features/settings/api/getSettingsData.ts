/**
 * @file src/features/settings/api/getSettingsData.ts
 * @description Dynamic database-backed data provider for AI model registry and risk settings.
 */

export interface ProviderOption {
  readonly id: string;
  readonly name: string;
  readonly providerSlug: string;
  readonly tag: string;
  readonly tagClass?: string;
  readonly desc: string;
  readonly isDeprecated?: boolean;
  readonly isDefault?: boolean;
  readonly contextWindow?: number;
}

export interface SettingsData {
  readonly selectedProvider: string;
  readonly maxRisk: string;
  readonly dailyMaxDrawdown: string;
  readonly autoTrailingSL: boolean;
  readonly providers: readonly ProviderOption[];
  readonly userEmail: string;
  readonly role: string;
}

const FALLBACK_PROVIDERS: readonly ProviderOption[] = [
  {
    id: "gemini-2.5-pro",
    providerSlug: "google-gemini",
    name: "Gemini 2.5 Pro",
    tag: "DEFAULT / REASONING PRO",
    tagClass: "tag-active",
    desc: "Institutional multi-agent reasoning, complex cross-market hypotheses synthesis.",
    isDefault: true,
    isDeprecated: false,
    contextWindow: 1048576,
  },
  {
    id: "gemini-2.5-flash",
    providerSlug: "google-gemini",
    name: "Gemini 2.5 Flash",
    tag: "STREAMING / LOW-LATENCY",
    desc: "Sub-second tick classification, order-book delta analysis, real-time regime shifts.",
    isDefault: false,
    isDeprecated: false,
    contextWindow: 1048576,
  },
  {
    id: "claude-3-7-sonnet",
    providerSlug: "anthropic",
    name: "Claude 3.7 Sonnet",
    tag: "HYBRID THINKING",
    desc: "Extended thinking architecture specialized in counter-trend risk skepticism.",
    isDefault: false,
    isDeprecated: false,
    contextWindow: 200000,
  },
  {
    id: "deepseek-r1:14b",
    providerSlug: "ollama",
    name: "DeepSeek R1 14B (Local Edge)",
    tag: "ON-PREM / ZERO COST",
    desc: "Private local chain-of-thought mathematical quant reasoner running on edge hardware.",
    isDefault: false,
    isDeprecated: false,
    contextWindow: 65536,
  },
  {
    id: "gemini-1.5-pro",
    providerSlug: "google-gemini",
    name: "Gemini 1.5 Pro (Legacy)",
    tag: "DEPRECATED (HISTORICAL AUDIT)",
    tagClass: "tag-deprecated",
    desc: "Historical baseline model preserved in database for trade audit logs & backtests.",
    isDefault: false,
    isDeprecated: true,
    contextWindow: 1048576,
  },
];

interface RawDbModel {
  id: string;
  name: string;
  modelIdentifier: string;
  description?: string;
  contextWindow?: number;
  isDefault?: boolean;
  isDeprecated?: boolean;
  provider?: {
    slug: string;
    name: string;
  };
}

/**
 * Fetches dynamic AI models and providers from database registry with graceful fallback.
 */
export async function getSettingsData(): Promise<SettingsData> {
  let providers: ProviderOption[] = [...FALLBACK_PROVIDERS];
  let selectedProvider = "gemini-2.5-pro";

  try {
    const res = await fetch("/api/models?includeDeprecated=true");
    if (res.ok) {
      const data: RawDbModel[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        providers = data.map((m) => {
          let tag = m.isDefault
            ? "DEFAULT / REASONING"
            : (m.provider?.name?.toUpperCase() ?? "MODEL");
          let tagClass = m.isDefault ? "tag-active" : "";

          if (m.isDeprecated) {
            tag = "DEPRECATED (HISTORICAL AUDIT)";
            tagClass = "tag-deprecated";
          }

          if (m.isDefault) {
            selectedProvider = m.modelIdentifier;
          }

          return {
            id: m.modelIdentifier,
            name: m.name,
            providerSlug: m.provider?.slug ?? "custom",
            tag,
            tagClass,
            desc: m.description ?? "Database registered institutional quantitative model.",
            isDefault: Boolean(m.isDefault),
            isDeprecated: Boolean(m.isDeprecated),
            ...(m.contextWindow ? { contextWindow: m.contextWindow } : {}),
          };
        });
      }
    }
  } catch {
    // Fall back to seeded models if offline
  }

  return {
    selectedProvider,
    maxRisk: "1.0%",
    dailyMaxDrawdown: "3.0%",
    autoTrailingSL: true,
    userEmail: "yuva.devlab@gmail.com",
    role: "Principal Quantitative Trader (Super Admin)",
    providers,
  };
}
