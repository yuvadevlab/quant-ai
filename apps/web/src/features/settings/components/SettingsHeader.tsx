/**
 * @file src/features/settings/components/SettingsHeader.tsx
 * @description Header banner and save button for platform configuration.
 */

import { Check, ChevronRight } from "lucide-react";
import { SETTINGS_COPY } from "@/lib/ui-copy/settings.copy";

export interface SettingsHeaderProps {
  readonly saved: boolean;
  readonly onSave: () => void;
}

export function SettingsHeader({ saved, onSave }: SettingsHeaderProps) {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>WORKSTATION</span>
          <ChevronRight size={14} />
          <span className="current">{SETTINGS_COPY.HEADER.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{SETTINGS_COPY.HEADER.TITLE}</h1>
        <p className="desk-subtitle">{SETTINGS_COPY.HEADER.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <button type="button" className="btn-primary" onClick={onSave}>
          {saved ? (
            <>
              <Check size={16} />
              <span>Preferences Saved</span>
            </>
          ) : (
            <span>Save Configuration</span>
          )}
        </button>
      </div>
    </div>
  );
}
