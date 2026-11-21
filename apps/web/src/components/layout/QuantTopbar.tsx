/**
 * @file src/components/layout/QuantTopbar.tsx
 * @description Workstation topbar featuring market regime telemetry, calibrated win-rate KPI, and model indicator.
 * @author yuva.devlab@gmail.com
 */

import { Badge } from "@quant-ai/ui";
import { COMMON_COPY } from "../../lib/ui-copy";
import { useWorkstationSession } from "../../hooks/use-workstation-session";
import { useMarketBreadth, DEFAULT_BREADTH } from "../../services/market-feed.service";

/**
 * Workstation header bar component providing global market context and active model telemetry.
 */
export function QuantTopbar() {
  const { data: breadth = DEFAULT_BREADTH } = useMarketBreadth();
  const copy = COMMON_COPY.TOPBAR;
  const { user, activeModel, telemetry } = useWorkstationSession();

  return (
    <header className="quant-topbar" role="banner">
      <div className="topbar-left">
        <Badge className="market-regime-badge" role="status">
          <span className="regime-tag">{breadth.regimeType.toUpperCase()}</span>
          <span className="regime-text">{breadth.regime}</span>
          <span className="regime-sep" aria-hidden="true">
            ·
          </span>
          <span className="regime-vix">{breadth.volatilityEnv}</span>
        </Badge>
      </div>

      <div className="topbar-right">
        <Badge className="quick-kpi-chip" title={copy.WIN_RATE_TITLE}>
          <span className="kpi-label">{copy.WIN_RATE_LABEL}</span>
          <span className="kpi-value">{telemetry.winRatePercent}</span>
          <span className="kpi-sub">
            {telemetry.totalSignals} {copy.SIGNALS_SUFFIX}
          </span>
        </Badge>

        <Badge className="model-status-chip" title={copy.MODEL_TITLE}>
          <span className="model-indicator" aria-hidden="true" />
          <span className="model-text">{activeModel.name}</span>
        </Badge>

        <Badge className="user-profile-badge" title={copy.USER_TITLE}>
          <span className="profile-initial">{user.initial}</span>
          <span className="profile-name">{user.name}</span>
        </Badge>
      </div>
    </header>
  );
}
