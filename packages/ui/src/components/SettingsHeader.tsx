/**
 * @file packages/ui/src/components/SettingsHeader.tsx
 * @description Header banner and save button for platform configuration.
 * @author yuva.devlab@gmail.com
 */

import { Check, ChevronRight } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

/**
 * Props for the SettingsHeader presentation component.
 */
export interface SettingsHeaderProps {
  /** Whether settings have been saved */
  readonly saved: boolean;
  /** Save action callback */
  readonly onSave: () => void;
  /** Main desk title */
  readonly title?: string;
  /** Subtitle narrative */
  readonly subtitle?: string;
  /** Breadcrumb label */
  readonly breadcrumbLabel?: string;
  /** Save button label */
  readonly saveLabel?: string;
  /** Saved confirmation label */
  readonly savedLabel?: string;
}

/**
 * Institutional header banner for the Settings workstation desk.
 *
 * @param props - SettingsHeaderProps containing save state and callbacks.
 * @returns Rendered JSX SettingsHeader element.
 */
export function SettingsHeader({
  saved,
  onSave,
  title = "PLATFORM SETTINGS & RISK GOVERNANCE",
  subtitle = "Configure automated execution limits, market feed parameters, and multi-agent AI provider endpoints.",
  breadcrumbLabel = "WORKSTATION",
  saveLabel = "SAVE PREFERENCES",
  savedLabel = "SAVED TO PROFILE",
}: SettingsHeaderProps) {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{breadcrumbLabel}</span>
          <ChevronRight size={14} />
          <span className="current">{title.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{title}</h1>
        <p className="desk-subtitle">{subtitle}</p>
      </div>
      <div className="desk-actions">
        <Button type="button" className="btn-primary" onClick={onSave}>
          {saved ? (
            <>
              <Check size={16} />
              <span>{savedLabel}</span>
            </>
          ) : (
            <span>{saveLabel}</span>
          )}
        </Button>
      </div>
    </div>
  );
}
