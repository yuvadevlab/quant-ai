/**
 * @file src/features/overview/components/OverviewPage.tsx
 * @description Master Executive Market Desk page wrapper.
 * Composes layout shell, live market ticks, breadth matrix, active signal spotlights, and launchpad using @quant-ai/ui.
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Sparkles, Filter, LineChart, Bot } from "lucide-react";
import { MarketDataStatus } from "@quant-ai/shared-types";
import { QuantShell } from "@/components/layout";
import { AppRoute } from "@/constants/routes.constants";
import { IndexCategoryFilter } from "@/constants/market.constants";
import {
  OverviewHero,
  OverviewIndicesGrid,
  OverviewBreadthSectors,
  OverviewSpotlight,
  WorkstationLaunchpad,
} from "@quant-ai/ui";
import { OVERVIEW_COPY } from "@/lib/ui-copy";
import { useRealtimeTicks } from "@/hooks/use-realtime-ticks";
import type { OverviewDeskData } from "../api/getOverviewData";

export interface OverviewPageProps {
  readonly initialData: OverviewDeskData;
}

export function OverviewPage({ initialData }: OverviewPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>(IndexCategoryFilter.ALL);
  const { ticks: liveTicks } = useRealtimeTicks();

  const hydratedTicks = initialData.ticks.map((tick) => {
    const live = liveTicks[tick.name];
    if (
      !live ||
      live.dataStatus === undefined ||
      live.dataStatus === MarketDataStatus.SIMULATED ||
      live.dataStatus === MarketDataStatus.UNAVAILABLE
    ) {
      return tick;
    }

    const formattedPrice = live.price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sign = live.change >= 0 ? "+" : "";
    const pctSign = live.percentChange >= 0 ? "+" : "";
    const formattedChange = `${sign}${live.change.toFixed(2)} (${pctSign}${live.percentChange.toFixed(2)}%)`;

    return {
      ...tick,
      price: formattedPrice,
      change: formattedChange,
      positive: live.change >= 0,
      dataStatus: live.dataStatus,
      ...(live.observedAt ? { observedAt: live.observedAt } : {}),
    };
  });

  return (
    <QuantShell>
      <div className="overview-container">
        <OverviewHero
          badgeText={OVERVIEW_COPY.HEADER.BADGE}
          title={OVERVIEW_COPY.HEADER.TITLE}
          subtitle={OVERVIEW_COPY.HEADER.SUBTITLE}
          copilotActionSlot={
            <Link to={AppRoute.CHAT} className="btn-hero-copilot">
              <Sparkles size={16} />
              <span>{OVERVIEW_COPY.HEADER.ASK_COPILOT}</span>
            </Link>
          }
          predictionsActionSlot={
            <Link to={AppRoute.PREDICTIONS} className="btn-hero-predictions">
              <span>{OVERVIEW_COPY.HEADER.VIEW_PREDICTIONS}</span>
              <ArrowRight size={16} />
            </Link>
          }
        />

        <OverviewIndicesGrid
          ticks={hydratedTicks}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <OverviewBreadthSectors
          breadth={initialData.breadth}
          sectors={initialData.sectors}
          screenerLinkSlot={
            <Link to={AppRoute.SCREENER} className="panel-link">
              {OVERVIEW_COPY.SECTOR_MATRIX.SCREEN_SECTORS} <ChevronRight size={14} />
            </Link>
          }
        />

        <OverviewSpotlight
          signals={initialData.spotlightSignals}
          viewAllLinkSlot={
            <Link to={AppRoute.PREDICTIONS} className="view-all-signals-link">
              <span>{OVERVIEW_COPY.SPOTLIGHT.VIEW_ALL_LEDGER}</span>
              <ChevronRight size={16} />
            </Link>
          }
          renderInspectLink={(signal) => (
            <Link
              to="/predictions/$id"
              params={{ id: signal.id }}
              className="btn-inspect-trajectory"
            >
              <span>{OVERVIEW_COPY.SPOTLIGHT.INSPECT_TRAJECTORY}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        />

        <WorkstationLaunchpad
          screenerSlot={
            <Link to={AppRoute.SCREENER} className="launchpad-card">
              <div className="launchpad-icon-wrap icon-cyan">
                <Filter size={20} />
              </div>
              <div className="launchpad-content">
                <h3 className="launchpad-title">{OVERVIEW_COPY.LAUNCHPAD.SCREENER_TITLE}</h3>
                <p className="launchpad-desc">{OVERVIEW_COPY.LAUNCHPAD.SCREENER_DESC}</p>
              </div>
              <span className="launchpad-action">
                {OVERVIEW_COPY.LAUNCHPAD.SCREENER_ACTION} <ArrowRight size={14} />
              </span>
            </Link>
          }
          predictionsSlot={
            <Link to={AppRoute.PREDICTIONS} className="launchpad-card">
              <div className="launchpad-icon-wrap icon-emerald">
                <LineChart size={20} />
              </div>
              <div className="launchpad-content">
                <h3 className="launchpad-title">{OVERVIEW_COPY.LAUNCHPAD.PREDICTIONS_TITLE}</h3>
                <p className="launchpad-desc">{OVERVIEW_COPY.LAUNCHPAD.PREDICTIONS_DESC}</p>
              </div>
              <span className="launchpad-action">
                {OVERVIEW_COPY.LAUNCHPAD.PREDICTIONS_ACTION} <ArrowRight size={14} />
              </span>
            </Link>
          }
          copilotSlot={
            <Link to={AppRoute.CHAT} className="launchpad-card">
              <div className="launchpad-icon-wrap icon-blue">
                <Bot size={20} />
              </div>
              <div className="launchpad-content">
                <h3 className="launchpad-title">{OVERVIEW_COPY.LAUNCHPAD.COPILOT_TITLE}</h3>
                <p className="launchpad-desc">{OVERVIEW_COPY.LAUNCHPAD.COPILOT_DESC}</p>
              </div>
              <span className="launchpad-action">
                {OVERVIEW_COPY.LAUNCHPAD.COPILOT_ACTION} <ArrowRight size={14} />
              </span>
            </Link>
          }
        />
      </div>
    </QuantShell>
  );
}
