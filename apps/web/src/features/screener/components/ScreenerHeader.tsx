/**
 * @file src/features/screener/components/ScreenerHeader.tsx
 * @description Header banner for the Quantitative Screener.
 */

import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import { SCREENER_COPY } from "@/lib/ui-copy/screener.copy";
import { AppRoute } from "@/constants/routes.constants";

export function ScreenerHeader() {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>MARKET DESK</span>
          <ChevronRight size={14} />
          <span className="current">{SCREENER_COPY.HEADER.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{SCREENER_COPY.HEADER.TITLE}</h1>
        <p className="desk-subtitle">{SCREENER_COPY.HEADER.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <Link to={AppRoute.CHAT} className="btn-secondary">
          <Sparkles size={16} />
          <span>Ask Copilot to Screen</span>
        </Link>
      </div>
    </div>
  );
}
