/**
 * @file packages/ui/src/components/SettingsAiEngine.tsx
 * @description Dynamic database-backed AI model catalog card using DevLab UI primitives.
 * @author yuva.devlab@gmail.com
 */

import { Cpu, History } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  RadioGroup,
  RadioGroupItem,
  Label,
  Badge,
} from "@yuva-devlab/ui";
import type { SettingsProviderItem } from "../types";

/**
 * Props for the SettingsAiEngine presentation component.
 */
export interface SettingsAiEngineProps {
  /** Currently selected AI model provider identifier */
  readonly selectedProvider: string;
  /** Callback when user changes active provider */
  readonly onSelectProvider: (id: string) => void;
  /** List of configured AI providers in catalog */
  readonly providers: readonly SettingsProviderItem[];
  /** Section title */
  readonly title?: string;
  /** Section subtitle */
  readonly subtitle?: string;
}

/**
 * Institutional AI reasoning engine selection panel with active status, context windows, and deprecation flags.
 *
 * @param props - SettingsAiEngineProps containing providers list and selected model ID.
 * @returns Rendered JSX SettingsAiEngine element.
 */
export function SettingsAiEngine({
  selectedProvider,
  onSelectProvider,
  providers,
  title = "AI REASONING ENGINES & CONSENSUS PROVIDERS",
  subtitle = "Dynamic multi-agent deliberation engine models fetched directly from database catalog.",
}: SettingsAiEngineProps) {
  return (
    <Card className="desk-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <Cpu size={18} className="panel-icon" />
          <div>
            <CardTitle className="panel-title">{title}</CardTitle>
            <CardDescription className="panel-subtext">{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="settings-options-list">
        <RadioGroup value={selectedProvider} onValueChange={onSelectProvider}>
          {providers.map((model) => {
            const isSelected = selectedProvider === model.id;
            const isDeprecated = Boolean(model.isDeprecated);

            return (
              <Label
                key={model.id}
                htmlFor={model.id}
                className={`provider-radio-card cursor-pointer ${isSelected ? "selected" : ""} ${isDeprecated ? "opacity-60" : ""}`}
              >
                <RadioGroupItem
                  value={model.id}
                  id={model.id}
                  disabled={isDeprecated}
                  className="mr-3"
                />
                <div className="provider-info flex-1">
                  <div className="provider-name-row">
                    <div className="flex items-center gap-2">
                      {isDeprecated && <History size={14} className="text-muted" />}
                      <strong>{model.name}</strong>
                    </div>
                    <Badge className={`provider-tag ${model.tagClass ?? ""}`}>{model.tag}</Badge>
                  </div>
                  <p className="provider-desc">{model.desc}</p>
                  {model.contextWindow && (
                    <span className="text-xs text-muted">
                      {(model.contextWindow / 1024).toFixed(0)}k context window · DB Model ID:{" "}
                      {model.id}
                    </span>
                  )}
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
