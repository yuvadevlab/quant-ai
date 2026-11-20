/**
 * @file src/features/settings/components/SettingsRiskLimits.tsx
 * @description Hardcoded deterministic risk limits panel using DevLab UI primitives.
 * @author yuva.devlab@gmail.com
 */

import { ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@quant-ai/ui";
import { SETTINGS_COPY } from "@/lib/ui-copy/settings.copy";

export interface SettingsRiskLimitsProps {
  readonly maxRisk: string;
  readonly onMaxRiskChange: (val: string) => void;
  readonly dailyMaxDrawdown: string;
  readonly onDailyMaxDrawdownChange: (val: string) => void;
  readonly autoTrailingSL: boolean;
  readonly onAutoTrailingSLChange: (val: boolean) => void;
}

export function SettingsRiskLimits({
  maxRisk,
  onMaxRiskChange,
  dailyMaxDrawdown,
  onDailyMaxDrawdownChange,
  autoTrailingSL,
  onAutoTrailingSLChange,
}: SettingsRiskLimitsProps) {
  const copy = SETTINGS_COPY.SECTIONS.RISK;

  return (
    <Card className="desk-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <ShieldCheck size={18} className="panel-icon" />
          <div>
            <CardTitle className="panel-title">{copy.TITLE}</CardTitle>
            <CardDescription className="panel-subtext">{copy.SUBTITLE}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="settings-fields-list">
        <div className="settings-field-row">
          <div>
            <strong>{copy.MAX_RISK_LABEL}</strong>
            <p>{copy.MAX_RISK_SUBTITLE}</p>
          </div>
          <select
            className="sector-select"
            value={maxRisk}
            onChange={(e) => onMaxRiskChange(e.target.value)}
          >
            <option value="0.5%">{copy.MAX_RISK_OPTIONS.CONSERVATIVE}</option>
            <option value="1.0%">{copy.MAX_RISK_OPTIONS.STANDARD}</option>
            <option value="1.5%">{copy.MAX_RISK_OPTIONS.AGGRESSIVE}</option>
            <option value="2.0%">{copy.MAX_RISK_OPTIONS.CEILING}</option>
          </select>
        </div>

        <div className="settings-field-row">
          <div>
            <strong>{copy.DRAWDOWN_LABEL}</strong>
            <p>{copy.DRAWDOWN_SUBTITLE}</p>
          </div>
          <select
            className="sector-select"
            value={dailyMaxDrawdown}
            onChange={(e) => onDailyMaxDrawdownChange(e.target.value)}
          >
            <option value="2.0%">{copy.DRAWDOWN_OPTIONS.LOSS_2}</option>
            <option value="3.0%">{copy.DRAWDOWN_OPTIONS.LOSS_3}</option>
            <option value="5.0%">{copy.DRAWDOWN_OPTIONS.LOSS_5}</option>
          </select>
        </div>

        <div className="settings-field-row">
          <div>
            <strong>{copy.TRAILING_LABEL}</strong>
            <p>{copy.TRAILING_SUBTITLE}</p>
          </div>
          <label className="switch-wrapper">
            <input
              type="checkbox"
              checked={autoTrailingSL}
              onChange={(e) => onAutoTrailingSLChange(e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
