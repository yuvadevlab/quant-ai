/**
 * @file packages/ui/src/components/RecommendationCard.tsx
 * @description Spacious, breathable recommendation card with plain-English conviction and mini trajectory preview.
 * @author yuva.devlab@gmail.com
 */

import { ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@yuva-devlab/ui";
import type { TableSignalItem } from "../types";
import { generateDynamicAiResearchRationale } from "./ai-research-generator";

export interface RecommendationCardProps {
  readonly signal: TableSignalItem;
  readonly onInspect?: (signalId: string) => void;
  readonly className?: string;
}

export function RecommendationCard({ signal, onInspect, className = "" }: RecommendationCardProps) {
  const isBuy = signal.direction.toLowerCase() === "buy";
  const entryNum = parseFloat(signal.entry.replace(/[^0-9.-]/g, "")) || 100;
  const targetNum = parseFloat(signal.target1.replace(/[^0-9.-]/g, "")) || entryNum * 1.04;
  const stopNum = parseFloat(signal.stop.replace(/[^0-9.-]/g, "")) || entryNum * 0.98;
  const currentNum = parseFloat(signal.last.replace(/[^0-9.-]/g, "")) || entryNum;

  const upsidePct = ((targetNum - entryNum) / entryNum) * 100;
  const riskPct = Math.abs(((entryNum - stopNum) / entryNum) * 100);
  const parsedConfidence = signal.confidence
    ? parseInt(signal.confidence.replace(/[^0-9]/g, ""), 10)
    : 85;
  const quantScore = signal.score
    ? Math.round(signal.score * 10)
    : !isNaN(parsedConfidence)
      ? parsedConfidence
      : 85;
  const sectorLabel = signal.sector || signal.companyName || signal.instrument || "Equities";
  const rrrLabel = signal.riskReward || "1:2.5";
  const rationaleText = generateDynamicAiResearchRationale(signal);

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
      {/* 1. Header with Symbol, Sector, Direction, and Quant Score */}
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
          <span className="rec-card-sector">{sectorLabel}</span>
        </div>

        <div className="rec-card-score-badge">
          <span className="rec-score-num">{quantScore}</span>
          <span className="rec-score-label">Quant Score</span>
        </div>
      </div>

      {/* 2. Primary Metrics Row: Price vs Target & Risk */}
      <div className="rec-card-metrics">
        <div className="rec-metric-box">
          <span className="rec-metric-lbl">Current Price</span>
          <strong className="rec-metric-val">
            ₹{currentNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </strong>
        </div>

        <div className="rec-metric-box">
          <span className="rec-metric-lbl">Expected Target</span>
          <strong className="rec-metric-val val-target">
            ₹{targetNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            <span className="rec-metric-sub">+{upsidePct.toFixed(1)}%</span>
          </strong>
        </div>

        <div className="rec-metric-box">
          <span className="rec-metric-lbl">Stop Loss</span>
          <strong className="rec-metric-val val-stop">
            ₹{stopNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            <span className="rec-metric-sub">-{riskPct.toFixed(1)}%</span>
          </strong>
        </div>
      </div>

      {/* 3. Mini Trajectory Spline Visual */}
      <div className="rec-card-trajectory-preview">
        <svg viewBox="0 0 320 48" className="rec-trajectory-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`coneGrad-${signal.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {/* Volatility cone polygon */}
          <polygon points="120,24 310,6 310,42" fill={`url(#coneGrad-${signal.id})`} />
          {/* Historical price curve */}
          <path
            d="M 10 34 Q 40 28, 70 32 T 120 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Expected trajectory curve */}
          <path
            d="M 120 24 Q 210 18, 310 12"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.4"
            strokeDasharray="4 2"
            strokeLinecap="round"
          />
          {/* Current tick anchor point */}
          <circle cx="120" cy="24" r="3.5" fill="#38bdf8" />
          {/* Target anchor point */}
          <circle cx="310" cy="12" r="3.5" fill="#22c55e" />
        </svg>
      </div>

      {/* 4. Plain-English Conviction Rationale */}
      <div className="rec-card-rationale">
        <div className="rec-ai-badge">
          <Sparkles className="rec-sparkle-icon" />
          <span>AI Quant Research</span>
        </div>
        <p className="rec-rationale-text">{rationaleText}</p>
      </div>

      {/* 5. Footer with Horizon, RRR, and Status */}
      <div className="rec-card-footer">
        <div className="rec-footer-meta">
          <span className="rec-horizon-tag">
            <Clock className="rec-meta-icon" />
            {signal.horizon} Horizon
          </span>
          <span className="rec-rrr-tag">
            <ShieldCheck className="rec-meta-icon" />
            RRR {rrrLabel}
          </span>
        </div>
        <span className="rec-inspect-link">Inspect ➔</span>
      </div>
    </div>
  );
}
