/**
 * @file src/features/settings/components/SettingsPage.tsx
 * @description Master Platform Configuration & Risk Governance page wrapper.
 * Composes workstation shell, header actions, AI engine provider card, risk limits, and SSO identity using @quant-ai/ui.
 * @author yuva.devlab@gmail.com
 */

import { useState } from "react";
import { QuantShell } from "@/components/layout";
import { StorageKey } from "@quant-ai/shared-types";
import { DEVLAB_PORTAL_ROUTES } from "@/lib/portal-routes";
import { apiFetch } from "@/lib/api-fetcher";
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

  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(StorageKey.THEME) || "quantai-light";
    }
    return "quantai-light";
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogin(): void {
    window.location.href = DEVLAB_PORTAL_ROUTES.LOGIN({
      redirectUrl: window.location.href,
    });
  }

  function toggleTheme(): void {
    const nextTheme = currentTheme === "quantai-dark" ? "quantai-light" : "quantai-dark";
    setCurrentTheme(nextTheme);

    if (typeof window !== "undefined") {
      localStorage.setItem(StorageKey.THEME, nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme.includes("dark"));

      if (isAuthenticated) {
        void apiFetch("/api/users/preferences", {
          method: "PATCH",
          body: JSON.stringify({ theme: nextTheme }),
        });
      }
    }
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
