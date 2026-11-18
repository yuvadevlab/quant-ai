/**
 * @file src/features/settings/components/SettingsAiEngine.tsx
 * @description Multi-provider AI engine selection card.
 */

import { Cpu } from "lucide-react";
import type { ModelProviderKey, ProviderOption } from "../api/getSettingsData";

export interface SettingsAiEngineProps {
  readonly selectedProvider: ModelProviderKey;
  readonly onSelectProvider: (key: ModelProviderKey) => void;
  readonly providers: readonly ProviderOption[];
}

export function SettingsAiEngine({
  selectedProvider,
  onSelectProvider,
  providers,
}: SettingsAiEngineProps) {
  return (
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
        {providers.map((provider) => (
          <label
            key={provider.id}
            className={`provider-radio-card ${selectedProvider === provider.id ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="modelProvider"
              value={provider.id}
              checked={selectedProvider === provider.id}
              onChange={() => onSelectProvider(provider.id)}
            />
            <div className="provider-info">
              <div className="provider-name-row">
                <strong>{provider.name}</strong>
                <span className={`provider-tag ${provider.tagClass ?? ""}`}>{provider.tag}</span>
              </div>
              <p className="provider-desc">{provider.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
