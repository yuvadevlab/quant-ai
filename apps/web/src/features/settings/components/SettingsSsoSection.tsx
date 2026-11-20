/**
 * @file src/features/settings/components/SettingsSsoSection.tsx
 * @description DevLab Portal SSO status & identity information panel using DevLab UI primitives.
 * @author yuva.devlab@gmail.com
 */

import { LogIn, LogOut, User } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quant-ai/ui";
import { DEVLAB_PORTAL_ROUTES } from "@/lib/portal-routes";
import { SETTINGS_COPY } from "@/lib/ui-copy/settings.copy";
import { useAuth } from "@/providers/auth";

export function SettingsSsoSection() {
  const { user, isAuthenticated, logout } = useAuth();
  const copy = SETTINGS_COPY.SECTIONS.SSO;

  const email = user?.email || "yuva.devlab@gmail.com";
  const role = user?.roles?.includes("admin")
    ? "Principal Quantitative Trader (Super Admin)"
    : "DevLab Quantitative Trader";

  function handleLogin(): void {
    window.location.href = DEVLAB_PORTAL_ROUTES.LOGIN({
      redirectUrl: window.location.href,
    });
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
          <span className="sso-label">{copy.LABEL_ROLE}</span>
          <span>{role}</span>
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
