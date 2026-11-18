/**
 * @file src/features/overview/components/OverviewHeader.tsx
 * @description Header hero section for the Executive Market Overview Desk.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { OVERVIEW_COPY } from "@/lib/ui-copy/overview.copy";
import { AppRoute } from "@/constants/routes.constants";

export function OverviewHeader() {
  return (
    <section className="overview-hero">
      <div className="hero-text-col">
        <div className="hero-badge">
          <Zap size={14} className="hero-zap" />
          <span>QUANTITATIVE MARKET INTELLIGENCE</span>
        </div>
        <h1 className="hero-title">{OVERVIEW_COPY.HEADER.TITLE}</h1>
        <p className="hero-subtitle">{OVERVIEW_COPY.HEADER.SUBTITLE}</p>
      </div>
      <div className="hero-actions-col">
        <Link to={AppRoute.CHAT} className="btn-hero-copilot">
          <Sparkles size={16} />
          <span>Ask AI Copilot</span>
        </Link>
        <Link to={AppRoute.PREDICTIONS} className="btn-hero-predictions">
          <span>View All Predictions</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
