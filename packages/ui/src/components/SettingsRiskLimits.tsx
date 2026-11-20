/**
 * @file packages/ui/src/components/SettingsRiskLimits.tsx
 * @description Hardcoded deterministic risk limits panel using DevLab UI primitives.
 * @author yuva.devlab@gmail.com
 */

import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
} from "@yuva-devlab/ui";

/**
 * Props for the SettingsRiskLimits presentation component.
 */
export interface SettingsRiskLimitsProps {
  /** Maximum risk per trade string (e.g. '1.0%') */
  readonly maxRisk: string;
  /** Callback when max risk changes */
  readonly onMaxRiskChange: (val: string) => void;
  /** Daily maximum drawdown string (e.g. '3.0%') */
  readonly dailyMaxDrawdown: string;
  /** Callback when daily drawdown changes */
  readonly onDailyMaxDrawdownChange: (val: string) => void;
  /** Whether automatic trailing stop loss is enabled */
  readonly autoTrailingSL: boolean;
  /** Callback when trailing stop loss switch changes */
  readonly onAutoTrailingSLChange: (val: boolean) => void;
  /** Section title */
  readonly title?: string;
  /** Section subtitle */
  readonly subtitle?: string;
}

/**
 * Institutional risk parameters panel configuring maximum trade risk, daily drawdown, and trailing stops.
 *
 * @param props - SettingsRiskLimitsProps containing risk values and change handlers.
 * @returns Rendered JSX SettingsRiskLimits element.
 */
export function SettingsRiskLimits({
  maxRisk,
  onMaxRiskChange,
  dailyMaxDrawdown,
  onDailyMaxDrawdownChange,
  autoTrailingSL,
  onAutoTrailingSLChange,
  title = "DETERMINISTIC RISK LIMITS",
  subtitle = "Hard risk parameters enforced automatically by Risk Guardian specialist before any trade generation.",
}: SettingsRiskLimitsProps) {
  return (
    <Card className="desk-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <ShieldCheck size={18} className="panel-icon" />
          <div>
            <CardTitle className="panel-title">{title}</CardTitle>
            <CardDescription className="panel-subtext">{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="settings-fields-list">
        <div className="settings-field-row">
          <div>
            <strong>Max Risk per Trade (% of Capital)</strong>
            <p>Upper bound of account balance risked on any single algorithmic recommendation.</p>
          </div>
          <Select value={maxRisk} onValueChange={onMaxRiskChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5%">0.5% (Conservative)</SelectItem>
              <SelectItem value="1.0%">1.0% (Standard Institutional)</SelectItem>
              <SelectItem value="1.5%">1.5% (Aggressive Alpha)</SelectItem>
              <SelectItem value="2.0%">2.0% (Hard Max Ceiling)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="settings-field-row">
          <div>
            <strong>Daily Maximum Portfolio Drawdown</strong>
            <p>Triggers automated execution pause if cumulative daily losses reach threshold.</p>
          </div>
          <Select value={dailyMaxDrawdown} onValueChange={onDailyMaxDrawdownChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2.0%">2.0% Max Loss</SelectItem>
              <SelectItem value="3.0%">3.0% Max Loss (Default)</SelectItem>
              <SelectItem value="5.0%">5.0% Max Loss</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="settings-field-row">
          <div>
            <strong>Automated Trailing Stop Loss (ATR-based)</strong>
            <p>Dynamically raise stop loss once Target 1 is achieved to lock in profits.</p>
          </div>
          <Switch
            checked={autoTrailingSL}
            onCheckedChange={onAutoTrailingSLChange}
            aria-label="Automated Trailing Stop Loss"
          />
        </div>
      </CardContent>
    </Card>
  );
}
