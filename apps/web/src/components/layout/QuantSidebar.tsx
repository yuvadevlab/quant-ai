/**
 * @file src/components/layout/QuantSidebar.tsx
 * @description Collapsible terminal sidebar navigation for QuantAI workstation.
 * @author yuva.devlab@gmail.com
 */

import { Link, useRouterState } from "@tanstack/react-router";
import { MarketDataStatus } from "@quant-ai/shared-types";
import {
  Briefcase,
  LayoutGrid,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  Settings2,
  Sparkles,
  Sun,
  TrendingUp,
} from "lucide-react";
import { Button } from "@quant-ai/ui";
import { AppRoute } from "../../constants";
import { COMMON_COPY } from "../../lib/ui-copy";
import { useQuantTheme } from "../../hooks/use-quant-theme";
import { useAuth } from "../../providers/auth";
import { useWorkstationSession } from "../../hooks/use-workstation-session";
import {
  useBenchmarkTicks,
  useMarketBreadth,
  DEFAULT_BREADTH,
} from "../../services/market-feed.service";

/**
 * Props for the workstation sidebar navigation.
 */
export interface QuantSidebarProps {
  /** Whether the sidebar is collapsed to an icon-only rail */
  readonly isCollapsed: boolean;
  /** Callback to toggle the sidebar collapsed state */
  readonly onToggleCollapse: () => void;
}

/**
 * QuantAI primary workstation navigation sidebar.
 */
export function QuantSidebar({ isCollapsed, onToggleCollapse }: QuantSidebarProps) {
  const location = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { isAuthenticated } = useAuth();
  const { sessionInfo, telemetry, isConnected } = useWorkstationSession();
  const { isDark, toggleTheme } = useQuantTheme(isAuthenticated);
  const { data: ticks = [] } = useBenchmarkTicks();
  const { data: breadth = DEFAULT_BREADTH } = useMarketBreadth();
  const vixTick = ticks.find((t) => t.isVix || t.name.includes("VIX"));
  const hasVixQuote =
    vixTick?.dataStatus === MarketDataStatus.VERIFIED ||
    vixTick?.dataStatus === MarketDataStatus.PROVIDER_UNVERIFIED ||
    vixTick?.dataStatus === MarketDataStatus.MARKET_CLOSED;
  const vixPrice = hasVixQuote && vixTick ? vixTick.price : "—";
  const copy = COMMON_COPY.SIDEBAR;

  return (
    <aside className="quant-sidebar" aria-label={copy.NAV_ARIA} role="navigation">
      <div className="sidebar-brand-box">
        <Link to={AppRoute.OVERVIEW} className="sidebar-brand" aria-label={copy.HOME_ARIA}>
          <div className="brand-logo-icon">
            <TrendingUp size={20} strokeWidth={2.5} aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="brand-text-block">
              <div className="brand-title">
                {COMMON_COPY.APP.PREFIX}
                <span className="brand-highlight">{COMMON_COPY.APP.SUFFIX}</span>
              </div>
              <div className="brand-subtitle">{COMMON_COPY.APP.MARKET_BADGE}</div>
            </div>
          )}
        </Link>
      </div>

      <nav className="sidebar-nav" aria-label={copy.MAIN_NAV_ARIA}>
        <div className="nav-group-label">{!isCollapsed && copy.GROUP_ANALYTICS}</div>

        <Link
          to={AppRoute.OVERVIEW}
          activeOptions={{ exact: true }}
          className={`nav-item ${location === AppRoute.OVERVIEW ? "active" : ""}`}
          title={COMMON_COPY.NAV.OVERVIEW}
        >
          <LayoutGrid size={18} className="nav-icon" aria-hidden="true" />
          {!isCollapsed && <span className="nav-label">{COMMON_COPY.NAV.OVERVIEW}</span>}
        </Link>

        <Link
          to={AppRoute.PREDICTIONS}
          className={`nav-item ${location.startsWith(AppRoute.PREDICTIONS) ? "active" : ""}`}
          title={COMMON_COPY.NAV.PREDICTIONS}
        >
          <TrendingUp size={18} className="nav-icon" aria-hidden="true" />
          {!isCollapsed && (
            <>
              <span className="nav-label">{COMMON_COPY.NAV.PREDICTIONS}</span>
              {telemetry.activeCount > 0 && (
                <span className="nav-pill-badge">
                  {telemetry.activeCount} {copy.LIVE_BADGE_SUFFIX}
                </span>
              )}
            </>
          )}
        </Link>

        <Link
          to={AppRoute.SCREENER}
          className={`nav-item ${location.startsWith(AppRoute.SCREENER) ? "active" : ""}`}
          title={COMMON_COPY.NAV.SCREENER}
        >
          <ScanLine size={18} className="nav-icon" aria-hidden="true" />
          {!isCollapsed && <span className="nav-label">{COMMON_COPY.NAV.SCREENER}</span>}
        </Link>

        <Link
          to={AppRoute.PORTFOLIO}
          className={`nav-item ${location.startsWith(AppRoute.PORTFOLIO) ? "active" : ""}`}
          title={COMMON_COPY.NAV.PORTFOLIO}
        >
          <Briefcase size={18} className="nav-icon" aria-hidden="true" />
          {!isCollapsed && <span className="nav-label">{COMMON_COPY.NAV.PORTFOLIO}</span>}
        </Link>

        <div className="nav-group-label">{!isCollapsed && copy.GROUP_INTELLIGENCE}</div>

        <Link
          to={AppRoute.CHAT}
          className={`nav-item ${location.startsWith(AppRoute.CHAT) ? "active" : ""}`}
          title={COMMON_COPY.NAV.CHAT}
        >
          <Sparkles size={18} className="nav-icon" aria-hidden="true" />
          {!isCollapsed && <span className="nav-label">{COMMON_COPY.NAV.CHAT}</span>}
        </Link>

        <Link
          to={AppRoute.SETTINGS}
          className={`nav-item ${location.startsWith(AppRoute.SETTINGS) ? "active" : ""}`}
          title={COMMON_COPY.NAV.SETTINGS}
        >
          <Settings2 size={18} className="nav-icon" aria-hidden="true" />
          {!isCollapsed && <span className="nav-label">{COMMON_COPY.NAV.SETTINGS}</span>}
        </Link>
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed ? (
          <div className="footer-status-card">
            <div className="status-live-header">
              <span
                className={`live-dot ${hasVixQuote ? "is-connected" : ""}`}
                aria-hidden="true"
              />
              <span className="live-exchange">
                {hasVixQuote ? copy.MARKET_CLOSE_AVAILABLE : copy.MARKET_DATA_UNAVAILABLE}
              </span>
            </div>
            <div className="status-caption">{sessionInfo.statusText}</div>
            <div className="status-meta">
              <span>
                {copy.VIX_PREFIX} {vixPrice}
              </span>
              <span className="meta-fii">
                {breadth.fiiNet ?? "—"} {copy.FII_SUFFIX}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="footer-collapsed-dot"
            title={isConnected ? copy.FEED_CONNECTED : copy.FEED_DISCONNECTED}
          >
            <span className={`live-dot ${isConnected ? "is-connected" : ""}`} aria-hidden="true" />
          </div>
        )}
        <div className="sidebar-footer-actions">
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            type="button"
            className="sidebar-collapse-btn"
            aria-label={copy.THEME_TOGGLE_ARIA}
            onClick={toggleTheme}
            title={isDark ? copy.THEME_LIGHT : copy.THEME_DARK}
          >
            {isDark ? (
              isCollapsed ? (
                <Sun size={16} />
              ) : (
                <>
                  <Sun size={15} />
                  <span>{copy.THEME_LIGHT}</span>
                </>
              )
            ) : isCollapsed ? (
              <Moon size={16} />
            ) : (
              <>
                <Moon size={15} />
                <span>{copy.THEME_DARK}</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            type="button"
            className="sidebar-collapse-btn"
            aria-label={isCollapsed ? copy.EXPAND : copy.COLLAPSE}
            onClick={onToggleCollapse}
            title={isCollapsed ? copy.EXPAND : copy.COLLAPSE}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <>
                <PanelLeftClose size={15} />
                <span>{copy.COLLAPSE}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
