/**
 * @file src/features/settings/components/SettingsPage.tsx
 * @description Master Platform Configuration & Risk Governance page wrapper.
 * Composes workstation shell, header actions, AI engine provider card, risk limits, and SSO identity.
 */

import { useState } from "react";
import { QuantShell } from "@/components/layout";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsAiEngine } from "./SettingsAiEngine";
import { SettingsRiskLimits } from "./SettingsRiskLimits";
import { SettingsSsoSection } from "./SettingsSsoSection";
import type { SettingsData } from "../api/getSettingsData";

export interface SettingsPageProps {
  readonly initialData: SettingsData;
}

export function SettingsPage({ initialData }: SettingsPageProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>(initialData.selectedProvider);
  const [maxRisk, setMaxRisk] = useState(initialData.maxRisk);
  const [dailyMaxDrawdown, setDailyMaxDrawdown] = useState(initialData.dailyMaxDrawdown);
  const [autoTrailingSL, setAutoTrailingSL] = useState(initialData.autoTrailingSL);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <QuantShell>
      <div className="desk-container">
        <SettingsHeader saved={saved} onSave={handleSave} />

        <div className="settings-cards-grid">
          <SettingsAiEngine
            selectedProvider={selectedProvider}
            onSelectProvider={setSelectedProvider}
            providers={initialData.providers}
          />

          <SettingsRiskLimits
            maxRisk={maxRisk}
            onMaxRiskChange={setMaxRisk}
            dailyMaxDrawdown={dailyMaxDrawdown}
            onDailyMaxDrawdownChange={setDailyMaxDrawdown}
            autoTrailingSL={autoTrailingSL}
            onAutoTrailingSLChange={setAutoTrailingSL}
          />

          <SettingsSsoSection />
        </div>
      </div>
    </QuantShell>
  );
}
