/**
 * @file src/features/settings/components/SettingsAiEngine.tsx
 * @description Dynamic database-backed AI model catalog card using DevLab UI primitives.
 * Highlights active reasoning engines and displays historical/deprecated models for audit trail.
 * @author yuva.devlab@gmail.com
 */

import { Cpu, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@quant-ai/ui";
import { SETTINGS_COPY } from "@/lib/ui-copy/settings.copy";
import type { ProviderOption } from "../api/getSettingsData";

export interface SettingsAiEngineProps {
  readonly selectedProvider: string;
  readonly onSelectProvider: (id: string) => void;
  readonly providers: readonly ProviderOption[];
}

export function SettingsAiEngine({
  selectedProvider,
  onSelectProvider,
  providers,
}: SettingsAiEngineProps) {
  const copy = SETTINGS_COPY.SECTIONS.ENGINE;

  return (
    <Card className="desk-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <Cpu size={18} className="panel-icon" />
          <div>
            <CardTitle className="panel-title">{copy.TITLE}</CardTitle>
            <CardDescription className="panel-subtext">{copy.SUBTITLE}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="settings-options-list">
        {providers.map((model) => {
          const isSelected = selectedProvider === model.id;
          const isDeprecated = Boolean(model.isDeprecated);

          return (
            <label
              key={model.id}
              className={`provider-radio-card ${isSelected ? "selected" : ""} ${isDeprecated ? "opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="modelProvider"
                value={model.id}
                checked={isSelected}
                disabled={isDeprecated}
                onChange={() => onSelectProvider(model.id)}
              />
              <div className="provider-info">
                <div className="provider-name-row">
                  <div className="flex items-center gap-2">
                    {isDeprecated && <History size={14} className="text-muted" />}
                    <strong>{model.name}</strong>
                  </div>
                  <span className={`provider-tag ${model.tagClass ?? ""}`}>{model.tag}</span>
                </div>
                <p className="provider-desc">{model.desc}</p>
                {model.contextWindow && (
                  <span className="text-xs text-muted">
                    {(model.contextWindow / 1024).toFixed(0)}k context window · DB Model ID:{" "}
                    {model.id}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </CardContent>
    </Card>
  );
}
