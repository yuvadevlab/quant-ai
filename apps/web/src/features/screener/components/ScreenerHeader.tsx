/**
 * @file src/features/screener/components/ScreenerHeader.tsx
 * @description Header banner for the Quantitative Screener.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import { SCREENER_COPY } from "@/lib/ui-copy/screener.copy";
import { AppRoute } from "@/constants/routes.constants";

export function ScreenerHeader() {
  const copy = SCREENER_COPY.HEADER;

  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{copy.BREADCRUMB_MARKET_DESK}</span>
          <ChevronRight size={14} />
          <span className="current">{copy.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{copy.TITLE}</h1>
        <p className="desk-subtitle">{copy.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <Link to={AppRoute.CHAT} className="btn-secondary">
          <Sparkles size={16} />
          <span>{copy.ASK_COPILOT}</span>
        </Link>
      </div>
    </div>
  );
}
