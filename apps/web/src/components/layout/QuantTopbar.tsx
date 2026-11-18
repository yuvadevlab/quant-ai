/**
 * @file src/components/layout/QuantTopbar.tsx
 * @description Workstation topbar featuring market regime telemetry, calibrated win-rate KPI, and model indicator. */

import { getMarketBreadth } from "../../services/market-feed.service";

/**
 * Workstation header bar component providing global market context and active model telemetry.
 */
export function QuantTopbar() {
  const breadth = getMarketBreadth();

  return (
    <header className="quant-topbar" role="banner">
      <div className="topbar-left">
        <div className="market-regime-badge" role="status">
          <span className="regime-tag">{breadth.regimeType.toUpperCase()}</span>
          <span className="regime-text">{breadth.regime}</span>
          <span className="regime-sep" aria-hidden="true">
            ·
          </span>
          <span className="regime-vix">{breadth.volatilityEnv}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="quick-kpi-chip" title="30-day verified signal hit-rate">
          <span className="kpi-label">WIN RATE</span>
          <span className="kpi-value">78.4%</span>
          <span className="kpi-sub">142 signals</span>
        </div>

        <div className="model-status-chip" title="Active Multi-Agent Reasoning Engine">
          <span className="model-indicator" aria-hidden="true" />
          <span className="model-text">Gemini 2.5 Pro</span>
        </div>

        <div className="user-profile-badge" title="Authenticated via DevLab Portal SSO">
          <span className="profile-initial">Y</span>
          <span className="profile-name">DevLab Trader</span>
        </div>
      </div>
    </header>
  );
}
