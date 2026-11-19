/**
 * @file src/features/settings/api/getSettingsData.ts
 * @description Data provider for Workstation Configuration and Risk Limits.
 */

export type ModelProviderKey = "gemini" | "ollama" | "anthropic" | "openai";

export interface ProviderOption {
  readonly id: ModelProviderKey;
  readonly name: string;
  readonly tag: string;
  readonly tagClass?: string;
  readonly desc: string;
}

export interface SettingsData {
  readonly selectedProvider: ModelProviderKey;
  readonly maxRisk: string;
  readonly dailyMaxDrawdown: string;
  readonly autoTrailingSL: boolean;
  readonly providers: readonly ProviderOption[];
  readonly userEmail: string;
  readonly role: string;
}

export async function getSettingsData(): Promise<SettingsData> {
  return {
    selectedProvider: "gemini",
    maxRisk: "1.0%",
    dailyMaxDrawdown: "3.0%",
    autoTrailingSL: true,
    userEmail: "yuva.devlab@gmail.com",
    role: "Principal Quantitative Trader (Super Admin)",
    providers: [
      {
        id: "gemini",
        name: "Google Gemini 2.0 Flash",
        tag: "DEFAULT / FREE TIER",
        tagClass: "tag-active",
        desc: "High throughput, sub-500ms latency, optimal for rapid market regime detection.",
      },
      {
        id: "ollama",
        name: "Local Ollama (Llama-3-70B-Instruct)",
        tag: "SELF-HOSTED / ZERO COST",
        desc: "Private quantitative deliberation engine running on local inference hardware.",
      },
      {
        id: "anthropic",
        name: "Anthropic Claude 3.5 Sonnet",
        tag: "REASONING PRO",
        desc: "Deep multi-step quantitative reasoning and complex derivatives flow synthesis.",
      },
      {
        id: "openai",
        name: "OpenAI GPT-4o",
        tag: "CLOUD PRO",
        desc: "Institutional agent capabilities and structured JSON financial tool calling.",
      },
    ],
  };
}
