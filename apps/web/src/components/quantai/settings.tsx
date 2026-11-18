/**
 * @file apps/web/src/components/quantai/settings.tsx
 * @description Platform Configuration & Risk Governance workstation desk.
 */

import { Check, ChevronRight, Cpu, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { QuantLayout } from "./layout";

type ModelProviderKey = "gemini" | "ollama" | "anthropic" | "openai";

interface ProviderOption {
  readonly id: ModelProviderKey;
  readonly name: string;
  readonly tag: string;
  readonly tagClass?: string;
  readonly desc: string;
}

const PROVIDERS: readonly ProviderOption[] = [
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
];

/**
 * Settings and platform configuration workstation desk.
 *
 * @returns Rendered JSX SettingsWorkspace element.
 */
export function SettingsWorkspace() {
  const [selectedProvider, setSelectedProvider] = useState<ModelProviderKey>("gemini");
  const [maxRisk, setMaxRisk] = useState("1.0%");
  const [dailyMaxDrawdown, setDailyMaxDrawdown] = useState("3.0%");
  const [autoTrailingSL, setAutoTrailingSL] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <QuantLayout active="settings">
      <div className="desk-container">
        {/* Header */}
        <div className="desk-header">
          <div>
            <div className="desk-breadcrumb">
              <span>WORKSTATION</span>
              <ChevronRight size={14} />
              <span className="current">SETTINGS & RISK CONTROLS</span>
            </div>
            <h1 className="desk-title">Platform Configuration & Risk Governance</h1>
            <p className="desk-subtitle">
              Manage AI model engine providers, deterministic risk limits, DevLab Portal SSO
              integration, and data feed parameters.
            </p>
          </div>
          <div className="desk-actions">
            <button type="button" className="btn-primary" onClick={handleSave}>
              {saved ? (
                <>
                  <Check size={16} />
                  <span>Preferences Saved</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="settings-cards-grid">
          {/* Section 1: AI Model Engine Provider */}
          <div className="desk-panel">
            <div className="panel-heading">
              <div className="panel-title-wrap">
                <Cpu size={18} className="panel-icon" />
                <div>
                  <h2 className="panel-title">AI Engine & Model Provider</h2>
                  <p className="panel-subtext">
                    Switch between multi-provider backends. Dynamic runtime abstraction layer.
                  </p>
                </div>
              </div>
            </div>

            <div className="settings-options-list">
              {PROVIDERS.map((provider) => (
                <label
                  key={provider.id}
                  className={`provider-radio-card ${selectedProvider === provider.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="modelProvider"
                    value={provider.id}
                    checked={selectedProvider === provider.id}
                    onChange={() => setSelectedProvider(provider.id)}
                  />
                  <div className="provider-info">
                    <div className="provider-name-row">
                      <strong>{provider.name}</strong>
                      <span className={`provider-tag ${provider.tagClass ?? ""}`}>
                        {provider.tag}
                      </span>
                    </div>
                    <p className="provider-desc">{provider.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Deterministic Risk Management */}
          <div className="desk-panel">
            <div className="panel-heading">
              <div className="panel-title-wrap">
                <ShieldCheck size={18} className="panel-icon" />
                <div>
                  <h2 className="panel-title">Deterministic Risk Limits</h2>
                  <p className="panel-subtext">
                    Hardcoded limits enforced by Risk Guardian. LLM cannot override these rules.
                  </p>
                </div>
              </div>
            </div>

            <div className="settings-fields-list">
              <div className="settings-field-row">
                <div>
                  <strong>Max Risk Per Signal</strong>
                  <p>Maximum allowable capital risk per single trade recommendation.</p>
                </div>
                <select
                  className="sector-select"
                  value={maxRisk}
                  onChange={(e) => setMaxRisk(e.target.value)}
                >
                  <option value="0.5%">0.5% (Conservative)</option>
                  <option value="1.0%">1.0% (Standard Quantitative)</option>
                  <option value="1.5%">1.5% (Aggressive)</option>
                  <option value="2.0%">2.0% (Max Ceiling)</option>
                </select>
              </div>

              <div className="settings-field-row">
                <div>
                  <strong>Daily Max Drawdown Circuit Breaker</strong>
                  <p>Auto-pause all signal generation if daily losses hit this threshold.</p>
                </div>
                <select
                  className="sector-select"
                  value={dailyMaxDrawdown}
                  onChange={(e) => setDailyMaxDrawdown(e.target.value)}
                >
                  <option value="2.0%">2.0% Daily Loss</option>
                  <option value="3.0%">3.0% Daily Loss (Default)</option>
                  <option value="5.0%">5.0% Daily Loss</option>
                </select>
              </div>

              <div className="settings-field-row">
                <div>
                  <strong>Automated Trailing Stop Loss</strong>
                  <p>Automatically advance stop loss to entry level once Target 1 is achieved.</p>
                </div>
                <label className="switch-wrapper">
                  <input
                    type="checkbox"
                    checked={autoTrailingSL}
                    onChange={(e) => setAutoTrailingSL(e.target.checked)}
                  />
                  <span className="switch-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: DevLab Portal SSO Integration */}
          <div className="desk-panel">
            <div className="panel-heading">
              <div className="panel-title-wrap">
                <User size={18} className="panel-icon" />
                <div>
                  <h2 className="panel-title">DevLab Portal SSO & Identity</h2>
                  <p className="panel-subtext">
                    Centralized authentication across Yuva DevLab ecosystem.
                  </p>
                </div>
              </div>
            </div>

            <div className="sso-status-card">
              <div className="sso-row">
                <span className="sso-label">AUTHENTICATION STATUS</span>
                <span className="text-gain font-semibold">Authenticated via DevLab Portal SSO</span>
              </div>
              <div className="sso-row">
                <span className="sso-label">LINKED ACCOUNT</span>
                <span className="mono">yuva.devlab@gmail.com</span>
              </div>
              <div className="sso-row">
                <span className="sso-label">ROLE & ACCESS</span>
                <span>Principal Quantitative Trader (Super Admin)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QuantLayout>
  );
}
