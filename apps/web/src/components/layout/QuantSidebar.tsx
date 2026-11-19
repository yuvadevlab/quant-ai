/**
 * @file src/components/layout/QuantSidebar.tsx
 * @description Collapsible terminal sidebar navigation for QuantAI workstation. */

import { Link, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  Settings2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppRoute } from "../../constants";
import { COMMON_COPY } from "../../lib/ui-copy";
import { getBenchmarkTicks, getMarketBreadth } from "../../services/market-feed.service";

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
  const ticks = getBenchmarkTicks();
  const breadth = getMarketBreadth();
  const vixPrice = ticks.find((t) => t.isVix)?.price ?? "13.48";

  return (
    <aside className="quant-sidebar" aria-label="Workstation Navigation" role="navigation">
      <div className="sidebar-brand-box">
        <Link to={AppRoute.OVERVIEW} className="sidebar-brand" aria-label="QuantAI Home">
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
        <button
          type="button"
          className="sidebar-collapse-btn"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation">
        <div className="nav-group-label">{!isCollapsed && "ANALYTICS & DESKS"}</div>

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
              <span className="nav-pill-badge">4 Live</span>
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

        <div className="nav-group-label">{!isCollapsed && "INTELLIGENCE"}</div>

        <Link
          to={AppRoute.CHAT}
          className={`nav-item ${location.startsWith(AppRoute.CHAT) ? "active" : ""}`}
          title={COMMON_COPY.NAV.CHAT}
        >
          <Sparkles size={18} className="nav-icon copilot-icon" aria-hidden="true" />
          {!isCollapsed && (
            <>
              <span className="nav-label">{COMMON_COPY.NAV.CHAT}</span>
              <span className="nav-pill-badge copilot-badge">v2.4</span>
            </>
          )}
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
              <span className="live-dot" aria-hidden="true" />
              <span className="live-exchange">{COMMON_COPY.STATUS.LIVE_STREAM}</span>
            </div>
            <div className="status-caption">Session: 09:15 - 15:30 IST</div>
            <div className="status-meta">
              <span>VIX {vixPrice}</span>
              <span className="meta-fii">{breadth.fiiNet} FII</span>
            </div>
          </div>
        ) : (
          <div className="footer-collapsed-dot" title="NSE Live Connected">
            <span className="live-dot" aria-hidden="true" />
          </div>
        )}
      </div>
    </aside>
  );
}
