/**
 * @file packages/ui/src/components/RecommendationCardGrid.tsx
 * @description Responsive spacious grid container rendering institutional RecommendationCards.
 */

import type { ReactNode } from "react";
import { RecommendationCard } from "./RecommendationCard";
import type { TableSignalItem } from "../types";

export interface RecommendationCardGridProps {
  readonly signals: readonly TableSignalItem[];
  readonly onInspect?: (signalId: string) => void;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyMessage?: string;
  readonly actionSlot?: ReactNode;
  readonly className?: string;
}

export function RecommendationCardGrid({
  signals,
  onInspect,
  emptyTitle = "No Active Predictions",
  emptyDescription = "Search for a stock symbol or run an algorithmic scan to discover trade setups.",
  emptyMessage,
  actionSlot,
  className = "",
}: RecommendationCardGridProps) {
  if (signals.length === 0) {
    const title = emptyMessage || emptyTitle;
    return (
      <div className="table-empty-state table-empty-cell">
        <p className="table-empty-title">{title}</p>
        <span className="table-empty-desc">{emptyDescription}</span>
        {actionSlot && <div className="mt-4">{actionSlot}</div>}
      </div>
    );
  }

  return (
    <div className={`recommendations-grid ${className}`}>
      {signals.map((signal) => (
        <RecommendationCard key={signal.id} signal={signal} onInspect={onInspect} />
      ))}
    </div>
  );
}
