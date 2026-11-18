/**
 * @file src/features/settings/components/SettingsSsoSection.tsx
 * @description DevLab Portal SSO status & identity information panel.
 */

import { User } from "lucide-react";

export interface SettingsSsoSectionProps {
  readonly userEmail: string;
  readonly role: string;
}

export function SettingsSsoSection({ userEmail, role }: SettingsSsoSectionProps) {
  return (
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
          <span className="mono">{userEmail}</span>
        </div>
        <div className="sso-row">
          <span className="sso-label">ROLE & ACCESS</span>
          <span>{role}</span>
        </div>
      </div>
    </div>
  );
}
