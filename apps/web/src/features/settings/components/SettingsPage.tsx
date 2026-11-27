/**
 * @file src/features/settings/components/SettingsPage.tsx
 * @description Master Platform Configuration & Risk Governance page wrapper.
 * Composes workstation shell, header actions, AI engine provider card, risk limits, and SSO identity using @quant-ai/ui.
 */

import { useState } from "react";
import { QuantShell } from "@/components/layout";
import { DEVLAB_PORTAL_ROUTES } from "@/lib/portal-routes";
import { useQuantTheme } from "@/hooks/use-quant-theme";
import { useAuth } from "@/providers/auth";
import {
  SettingsHeader,
  SettingsAiEngine,
  SettingsRiskLimits,
  SettingsSsoSection,
} from "@quant-ai/ui";
import type { SettingsData } from "../api/getSettingsData";

export interface SettingsPageProps {
  readonly initialData: SettingsData;
}

export function SettingsPage({ initialData }: SettingsPageProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<string>(initialData.selectedProvider);
  const [maxRisk, setMaxRisk] = useState(initialData.maxRisk);
  const [dailyMaxDrawdown, setDailyMaxDrawdown] = useState(initialData.dailyMaxDrawdown);
  const [autoTrailingSL, setAutoTrailingSL] = useState(initialData.autoTrailingSL);
  const [saved, setSaved] = useState(false);

  const { theme: currentTheme, toggleTheme } = useQuantTheme(isAuthenticated);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogin(): void {
    window.location.href = DEVLAB_PORTAL_ROUTES.LOGIN({
      redirectUrl: window.location.href,
    });
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

          <SettingsSsoSection
            user={user}
            isAuthenticated={isAuthenticated}
            currentTheme={currentTheme}
            onToggleTheme={toggleTheme}
            onLogin={handleLogin}
            onLogout={logout}
          />
        </div>
      </div>
    </QuantShell>
  );
}
