/**
 * @file src/features/settings/components/SettingsRiskLimits.tsx
 * @description Hardcoded deterministic risk limits panel.
 */

import { ShieldCheck } from "lucide-react";

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
  return (
    <div className="desk-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <ShieldCheck size={18} className="panel-icon" />
          <div>
            <h2 className="panel-title">Deterministic Risk Limits</h2>
            <p className="panel-subtext">
              Hardcoded limits enforced by Risk Guardian. LLM cannot override these rules.
            </p>
          </div>
        </div>
      </div>

      <div className="settings-fields-list">
        <div className="settings-field-row">
          <div>
            <strong>Max Risk Per Signal</strong>
            <p>Maximum allowable capital risk per single trade recommendation.</p>
          </div>
          <select
            className="sector-select"
            value={maxRisk}
            onChange={(e) => onMaxRiskChange(e.target.value)}
          >
            <option value="0.5%">0.5% (Conservative)</option>
            <option value="1.0%">1.0% (Standard Quantitative)</option>
            <option value="1.5%">1.5% (Aggressive)</option>
            <option value="2.0%">2.0% (Max Ceiling)</option>
          </select>
        </div>

        <div className="settings-field-row">
          <div>
            <strong>Daily Max Drawdown Circuit Breaker</strong>
            <p>Auto-pause all signal generation if daily losses hit this threshold.</p>
          </div>
          <select
            className="sector-select"
            value={dailyMaxDrawdown}
            onChange={(e) => onDailyMaxDrawdownChange(e.target.value)}
          >
            <option value="2.0%">2.0% Daily Loss</option>
            <option value="3.0%">3.0% Daily Loss (Default)</option>
            <option value="5.0%">5.0% Daily Loss</option>
          </select>
        </div>

        <div className="settings-field-row">
          <div>
            <strong>Automated Trailing Stop Loss</strong>
            <p>Automatically advance stop loss to entry level once Target 1 is achieved.</p>
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
      </div>
    </div>
  );
}
