/**
 * @file packages/ui/src/components/SettingsSsoSection.tsx
 * @description DevLab Portal SSO status & identity information panel using DevLab UI primitives.
 */

import { LogIn, LogOut, Moon, Sun, User } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yuva-devlab/ui";

/**
 * User identity summary for SSO settings presentation.
 */
export interface SettingsUserSummary {
  readonly email?: string;
  readonly id?: string;
  readonly roles?: readonly string[];
}

/**
 * Props for the SettingsSsoSection presentation component.
 */
export interface SettingsSsoSectionProps {
  /** Authenticated user profile information or null */
  readonly user: SettingsUserSummary | null;
  /** Whether the user is currently authenticated */
  readonly isAuthenticated: boolean;
  /** Active theme name (e.g. 'quantai-dark', 'quantai-light') */
  readonly currentTheme: string;
  /** Callback to toggle between dark and light themes */
  readonly onToggleTheme: () => void;
  /** Callback when user clicks Login with DevLab Portal */
  readonly onLogin: () => void;
  /** Callback when user clicks Logout */
  readonly onLogout: () => void;
  /** Panel title */
  readonly title?: string;
  /** Panel subtitle */
  readonly subtitle?: string;
}

/**
 * Institutional single sign-on profile status, user roles, and appearance theme switcher.
 *
 * @param props - SettingsSsoSectionProps containing user session and action callbacks.
 * @returns Rendered JSX SettingsSsoSection element.
 */
export function SettingsSsoSection({
  user,
  isAuthenticated,
  currentTheme,
  onToggleTheme,
  onLogin,
  onLogout,
  title = "DEVLAB SSO IDENTITY & SESSION",
  subtitle = "Single Sign-On authentication managed centrally across the Yuva DevLab ecosystem.",
}: SettingsSsoSectionProps) {
  const email = user?.email || "yuva.devlab@gmail.com";
  const userId = user?.id || "sso-guest-session";
  const role = user?.roles?.includes("admin")
    ? "Principal Quantitative Trader (Super Admin)"
    : "DevLab Quantitative Trader";

  return (
    <Card className="desk-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <User size={18} className="panel-icon" />
          <div>
            <CardTitle className="panel-title">{title}</CardTitle>
            <CardDescription className="panel-subtext">{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="sso-status-card">
        <div className="sso-row">
          <span className="sso-label">Ecosystem SSO Status:</span>
          <span className={isAuthenticated ? "text-gain font-semibold" : "font-semibold"}>
            {isAuthenticated ? "AUTHENTICATED VIA DEVLAB SSO" : "ANONYMOUS SESSION (GUEST TRADER)"}
          </span>
        </div>
        <div className="sso-row">
          <span className="sso-label">Account Email:</span>
          <span className="mono">{email}</span>
        </div>
        <div className="sso-row">
          <span className="sso-label">Unique Identity ID:</span>
          <span className="mono">{userId}</span>
        </div>
        <div className="sso-row">
          <span className="sso-label">Ecosystem Role:</span>
          <span>{role}</span>
        </div>
        <div className="sso-row">
          <span className="sso-label">Workstation Theme:</span>
          <Button variant="outline" size="sm" onClick={onToggleTheme} className="theme-toggle-btn">
            {currentTheme.includes("dark") ? (
              <>
                <Moon size={14} className="mr-2" />
                <span>QuantAI Dark (High Contrast)</span>
              </>
            ) : (
              <>
                <Sun size={14} className="mr-2" />
                <span>QuantAI Light (Institutional)</span>
              </>
            )}
          </Button>
        </div>
        <div className="sso-action-row mt-4">
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut size={14} className="mr-2" />
              <span>Log Out of Ecosystem</span>
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={onLogin}>
              <LogIn size={14} className="mr-2" />
              <span>Log in with DevLab Portal</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
