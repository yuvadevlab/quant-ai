/**
 * @file src/features/overview/components/OverviewLaunchpad.tsx
 * @description Quick action workstation launchpad cards.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Filter, LineChart } from "lucide-react";
import { AppRoute } from "@/constants/routes.constants";
import { OVERVIEW_COPY } from "@/lib/ui-copy/overview.copy";

export function WorkstationLaunchpad() {
  const copy = OVERVIEW_COPY.LAUNCHPAD;

  return (
    <section className="launchpad-section" aria-label={copy.ARIA_LABEL}>
      <div className="section-label">{copy.SECTION_LABEL}</div>
      <h2 className="section-title">{copy.SECTION_TITLE}</h2>

      <div className="launchpad-grid">
        <Link to={AppRoute.SCREENER} className="launchpad-card">
          <div className="launchpad-icon-wrap icon-cyan">
            <Filter size={20} />
          </div>
          <div className="launchpad-content">
            <h3 className="launchpad-title">{copy.SCREENER_TITLE}</h3>
            <p className="launchpad-desc">{copy.SCREENER_DESC}</p>
          </div>
          <span className="launchpad-action">
            {copy.SCREENER_ACTION} <ArrowRight size={14} />
          </span>
        </Link>

        <Link to={AppRoute.PREDICTIONS} className="launchpad-card">
          <div className="launchpad-icon-wrap icon-emerald">
            <LineChart size={20} />
          </div>
          <div className="launchpad-content">
            <h3 className="launchpad-title">{copy.PREDICTIONS_TITLE}</h3>
            <p className="launchpad-desc">{copy.PREDICTIONS_DESC}</p>
          </div>
          <span className="launchpad-action">
            {copy.PREDICTIONS_ACTION} <ArrowRight size={14} />
          </span>
        </Link>

        <Link to={AppRoute.CHAT} className="launchpad-card">
          <div className="launchpad-icon-wrap icon-blue">
            <Bot size={20} />
          </div>
          <div className="launchpad-content">
            <h3 className="launchpad-title">{copy.COPILOT_TITLE}</h3>
            <p className="launchpad-desc">{copy.COPILOT_DESC}</p>
          </div>
          <span className="launchpad-action">
            {copy.COPILOT_ACTION} <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
