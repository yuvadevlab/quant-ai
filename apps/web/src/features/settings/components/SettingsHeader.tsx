/**
 * @file src/features/settings/components/SettingsHeader.tsx
 * @description Header banner and save button for platform configuration.
 * @author yuva.devlab@gmail.com
 */

import { Check, ChevronRight } from "lucide-react";
import { Button } from "@quant-ai/ui";
import { SETTINGS_COPY } from "@/lib/ui-copy/settings.copy";

export interface SettingsHeaderProps {
  readonly saved: boolean;
  readonly onSave: () => void;
}

export function SettingsHeader({ saved, onSave }: SettingsHeaderProps) {
  const headerCopy = SETTINGS_COPY.HEADER;

  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{headerCopy.BREADCRUMB_WORKSTATION}</span>
          <ChevronRight size={14} />
          <span className="current">{headerCopy.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{headerCopy.TITLE}</h1>
        <p className="desk-subtitle">{headerCopy.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <Button type="button" className="btn-primary" onClick={onSave}>
          {saved ? (
            <>
              <Check size={16} />
              <span>{headerCopy.SAVED_BTN}</span>
            </>
          ) : (
            <span>{headerCopy.SAVE_BTN}</span>
          )}
        </Button>
      </div>
    </div>
  );
}
