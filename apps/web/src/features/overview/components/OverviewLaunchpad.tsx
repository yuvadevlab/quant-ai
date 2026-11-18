/**
 * @file src/features/overview/components/OverviewLaunchpad.tsx
 * @description Quick action workstation launchpad cards.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Filter, LineChart } from "lucide-react";
import { AppRoute } from "@/constants/routes.constants";

export function WorkstationLaunchpad() {
  return (
    <section className="launchpad-section" aria-label="Workstation Desks Quick Launch">
      <div className="section-label">WORKSTATION MODULES</div>
      <h2 className="section-title">Institutional Trading Desks</h2>

      <div className="launchpad-grid">
        <Link to={AppRoute.SCREENER} className="launchpad-card">
          <div className="launchpad-icon-wrap icon-cyan">
            <Filter size={20} />
          </div>
          <div className="launchpad-content">
            <h3 className="launchpad-title">Quantitative Screener</h3>
            <p className="launchpad-desc">
              Scan 2,000+ NSE & BSE stocks for volume surges, RSI extremes, and momentum.
            </p>
          </div>
          <span className="launchpad-action">
            Open Desk <ArrowRight size={14} />
          </span>
        </Link>

        <Link to={AppRoute.PREDICTIONS} className="launchpad-card">
          <div className="launchpad-icon-wrap icon-emerald">
            <LineChart size={20} />
          </div>
          <div className="launchpad-content">
            <h3 className="launchpad-title">Prediction Lab & Ledger</h3>
            <p className="launchpad-desc">
              Audit automated signal generation, win-rates, excursions, and outcome logs.
            </p>
          </div>
          <span className="launchpad-action">
            Audit Ledger <ArrowRight size={14} />
          </span>
        </Link>

        <Link to={AppRoute.CHAT} className="launchpad-card">
          <div className="launchpad-icon-wrap icon-blue">
            <Bot size={20} />
          </div>
          <div className="launchpad-content">
            <h3 className="launchpad-title">AI Financial Copilot</h3>
            <p className="launchpad-desc">
              Chat with multi-agent consensus models regarding regimes, setups, and Greeks.
            </p>
          </div>
          <span className="launchpad-action">
            Launch Chat <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
