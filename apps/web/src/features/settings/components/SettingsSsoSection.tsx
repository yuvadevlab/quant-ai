/**
 * @file src/features/settings/components/SettingsSsoSection.tsx
 * @description DevLab Portal SSO status & identity information panel using DevLab UI primitives.
 * @author yuva.devlab@gmail.com
 */

import { useState } from "react";
import { LogIn, LogOut, Moon, Sun, User } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quant-ai/ui";
import { StorageKey } from "@quant-ai/shared-types";
import { DEVLAB_PORTAL_ROUTES } from "@/lib/portal-routes";
import { SETTINGS_COPY } from "@/lib/ui-copy/settings.copy";
import { useAuth } from "@/providers/auth";
import { apiFetch } from "@/lib/api-fetcher";

export function SettingsSsoSection() {
  const { user, isAuthenticated, logout } = useAuth();
  const copy = SETTINGS_COPY.SECTIONS.SSO;

  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(StorageKey.THEME) || "quantai-dark";
    }
    return "quantai-dark";
  });

  const email = user?.email || "yuva.devlab@gmail.com";
  const userId = user?.id || "sso-guest-session";
  const role = user?.roles?.includes("admin")
    ? "Principal Quantitative Trader (Super Admin)"
    : "DevLab Quantitative Trader";

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
    <Card className="desk-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <User size={18} className="panel-icon" />
          <div>
            <CardTitle className="panel-title">{copy.TITLE}</CardTitle>
            <CardDescription className="panel-subtext">{copy.SUBTITLE}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="sso-status-card">
        <div className="sso-row">
          <span className="sso-label">{copy.LABEL_STATUS}</span>
          <span className={isAuthenticated ? "text-gain font-semibold" : "font-semibold"}>
            {isAuthenticated ? copy.STATUS_TEXT : copy.UNAUTH_STATUS_TEXT}
          </span>
        </div>
        <div className="sso-row">
          <span className="sso-label">{copy.LABEL_ACCOUNT}</span>
          <span className="mono">{email}</span>
        </div>
        <div className="sso-row">
          <span className="sso-label">{copy.LABEL_USER_ID}</span>
          <span className="mono">{userId}</span>
        </div>
        <div className="sso-row">
          <span className="sso-label">{copy.LABEL_ROLE}</span>
          <span>{role}</span>
        </div>
        <div className="sso-row">
          <span className="sso-label">{copy.LABEL_THEME}</span>
          <Button variant="outline" size="sm" onClick={toggleTheme} className="theme-toggle-btn">
            {currentTheme === "quantai-dark" ? (
              <>
                <Moon size={14} className="mr-2" />
                <span>{copy.THEME_DARK}</span>
              </>
            ) : (
              <>
                <Sun size={14} className="mr-2" />
                <span>{copy.THEME_LIGHT}</span>
              </>
            )}
          </Button>
        </div>
        <div className="sso-action-row mt-4">
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut size={14} className="mr-2" />
              {copy.BTN_LOGOUT}
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={handleLogin}>
              <LogIn size={14} className="mr-2" />
              {copy.BTN_LOGIN}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
