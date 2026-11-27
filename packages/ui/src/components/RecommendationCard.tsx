/**
 * @file packages/ui/src/components/RecommendationCard.tsx
 * @description Spacious, breathable recommendation card with plain-English conviction and mini trajectory preview.
 */

import { ArrowUpRight, ArrowDownRight, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@yuva-devlab/ui";
import type { TableSignalItem } from "../types";
import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";

export interface RecommendationCardProps {
  readonly signal: TableSignalItem;
  readonly onInspect?: (signalId: string) => void;
  readonly className?: string;
}

/**
 * Renders a prediction using only recorded signal values and provenance.
 */
export function RecommendationCard({ signal, onInspect, className = "" }: RecommendationCardProps) {
  const isBuy = signal.direction.toLowerCase() === "buy";
  const confidence =
    signal.confidence ?? (signal.score === undefined ? undefined : `${signal.score}`);
  const rationale =
    signal.rationale?.trim() || UI_COPY_CONSTANTS.RECOMMENDATION_CARD.RATIONALE_UNAVAILABLE;
  const provenance =
    signal.dataProvenance ?? UI_COPY_CONSTANTS.RECOMMENDATION_CARD.PROVENANCE_UNAVAILABLE;

  const handleCardClick = () => {
    onInspect?.(signal.id);
  };

  return (
    <div
      className={cn("recommendation-card", className)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick()}
    >
      <div className="rec-card-header">
        <div className="rec-card-identity">
          <div className="rec-card-symbol-row">
            <span className="rec-card-symbol">{signal.symbol}</span>
            <span className={cn("rec-direction-pill", isBuy ? "pill-buy" : "pill-sell")}>
              {isBuy ? (
                <ArrowUpRight className="rec-pill-icon" />
              ) : (
                <ArrowDownRight className="rec-pill-icon" />
              )}
              {signal.direction}
            </span>
          </div>
          <span className="rec-card-sector">
            {signal.sector ?? signal.companyName ?? signal.instrument}
          </span>
        </div>
        {confidence && (
          <div className="rec-card-score-badge">
            <span className="rec-score-num">{confidence}</span>
            <span className="rec-score-label">
              {UI_COPY_CONSTANTS.RECOMMENDATION_CARD.MODEL_CONFIDENCE}
            </span>
          </div>
        )}
      </div>

      <div className="rec-card-metrics">
        <div className="rec-metric-box">
          <span className="rec-metric-lbl">
            {UI_COPY_CONSTANTS.RECOMMENDATION_CARD.CURRENT_PRICE}
          </span>
          <strong className="rec-metric-val">{signal.last}</strong>
        </div>
        <div className="rec-metric-box">
          <span className="rec-metric-lbl">{UI_COPY_CONSTANTS.RECOMMENDATION_CARD.TARGET}</span>
          <strong className="rec-metric-val val-target">{signal.target1}</strong>
        </div>
        <div className="rec-metric-box">
          <span className="rec-metric-lbl">{UI_COPY_CONSTANTS.RECOMMENDATION_CARD.STOP_LOSS}</span>
          <strong className="rec-metric-val val-stop">{signal.stop}</strong>
        </div>
      </div>

      <div className="rec-card-rationale">
        <div className="rec-ai-badge">
          <span>{UI_COPY_CONSTANTS.RECOMMENDATION_CARD.RATIONALE_TITLE}</span>
        </div>
        <p className="rec-rationale-text">{rationale}</p>
        <p className="rec-rationale-text">{provenance}</p>
      </div>

      <div className="rec-card-footer">
        <div className="rec-footer-meta">
          <span className="rec-horizon-tag">
            <Clock className="rec-meta-icon" />
            {signal.horizon} {UI_COPY_CONSTANTS.RECOMMENDATION_CARD.HORIZON_SUFFIX}
          </span>
          {signal.riskReward && (
            <span className="rec-rrr-tag">
              <ShieldCheck className="rec-meta-icon" />
              {UI_COPY_CONSTANTS.RECOMMENDATION_CARD.RISK_REWARD_PREFIX} {signal.riskReward}
            </span>
          )}
        </div>
        <span className="rec-inspect-link">{UI_COPY_CONSTANTS.RECOMMENDATION_CARD.INSPECT} ➔</span>
      </div>
    </div>
  );
}
