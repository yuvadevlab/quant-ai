/**
 * @file src/features/overview/components/OverviewHeader.tsx
 * @description Header hero section for the Executive Market Overview Desk.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { OVERVIEW_COPY } from "@/lib/ui-copy/overview.copy";
import { AppRoute } from "@/constants/routes.constants";

export function OverviewHeader() {
  const copy = OVERVIEW_COPY.HEADER;

  return (
    <section className="overview-hero">
      <div className="hero-text-col">
        <div className="hero-badge">
          <Zap size={14} className="hero-zap" />
          <span>{copy.BADGE}</span>
        </div>
        <h1 className="hero-title">{copy.TITLE}</h1>
        <p className="hero-subtitle">{copy.SUBTITLE}</p>
      </div>
      <div className="hero-actions-col">
        <Link to={AppRoute.CHAT} className="btn-hero-copilot">
          <Sparkles size={16} />
          <span>{copy.ASK_COPILOT}</span>
        </Link>
        <Link to={AppRoute.PREDICTIONS} className="btn-hero-predictions">
          <span>{copy.VIEW_PREDICTIONS}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
