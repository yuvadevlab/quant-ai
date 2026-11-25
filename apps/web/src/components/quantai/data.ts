/**
 * @file apps/web/src/components/quantai/data.ts
 * @description Type definitions, UI enums, and dynamic schema contracts for QuantAI workstation.
 * Data is fetched dynamically from NestJS backend APIs. Zero hardcoded assets stored here.
 * @author yuva.devlab@gmail.com
 */

import { SignalStatus as CoreSignalStatus } from "@quant-ai/shared-types";

export const UiSignalStatus = {
  ACTIVE: "Active",
  TARGET_HIT: "Target hit",
  STOP_HIT: "Stop loss hit",
  EXPIRED: "Expired",
} as const;

export type UiSignalStatus = (typeof UiSignalStatus)[keyof typeof UiSignalStatus];
export type SignalStatus = UiSignalStatus | CoreSignalStatus;

export const UiSignalDirection = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export type UiSignalDirection = (typeof UiSignalDirection)[keyof typeof UiSignalDirection];

export const UiSignalHorizon = {
  INTRADAY: "Intraday",
  SWING: "Swing",
  OPTIONS: "Options",
  SCALP: "Scalp",
  INVESTMENT: "Investment",
} as const;

export type UiSignalHorizon = (typeof UiSignalHorizon)[keyof typeof UiSignalHorizon];
export type SignalHorizon = UiSignalHorizon;

export interface Signal {
  id: string;
  symbol: string;
  companyName: string;
  instrument: string;
  direction: UiSignalDirection | "BUY" | "SELL";
  horizon: UiSignalHorizon | "Intraday" | "Swing" | "Options" | "Scalp";
  entry: string;
  entryPrice: number;
  currentPrice?: number;
  target1: string;
  target2?: string;
  stop: string;
  last: string;
  change: string;
  mfe: string;
  mae: string;
  status: SignalStatus;
  time: string;
  confidence: string;
  riskReward: string;
  rationale?: string;
  catalysts: string[];
  agents?: {
    technical: { score: number; verdict: string };
    quant: { score: number; verdict: string };
    optionsFlow: { score: number; verdict: string };
    riskGuardian: { score: number; verdict: string };
  };
  dataSource?: string;
  dataStatus?: string;
  observedAt?: string;
  outcomePrice?: number;
  outcomeAt?: string;
  metricEligible?: boolean;
  dataProvenance?: string;
  trajectoryPoints?: {
    time: string;
    actualPrice?: number;
    upperCone: number;
    expectedPath: number;
    lowerCone: number;
  }[];
}

export const EmaStatus = {
  ABOVE_20_50: "Above 20/50",
  EMA_BULLISH_CROSS: "EMA Bullish Cross",
  BELOW_50_EMA: "Below 50 EMA",
  EMA_REJECTION: "EMA Rejection",
} as const;

export type EmaStatus = (typeof EmaStatus)[keyof typeof EmaStatus] | string;

export const OiAction = {
  LONG_BUILDUP: "Long Buildup",
  SHORT_COVERING: "Short Covering",
  SHORT_BUILDUP: "Short Buildup",
  UNWINDING: "Unwinding",
} as const;

export type OiAction = (typeof OiAction)[keyof typeof OiAction] | string;

export const SignalCandidate = {
  STRONG_BUY: "Strong BUY",
  BUY: "BUY",
  NEUTRAL: "Neutral",
  SELL: "SELL",
} as const;

export type SignalCandidate = (typeof SignalCandidate)[keyof typeof SignalCandidate] | string;

export interface ScreenerItem {
  symbol: string;
  name: string;
  sector: string;
  price: string;
  change: string;
  positive: boolean;
  rsi: number;
  emaStatus: EmaStatus;
  oiAction: OiAction;
  volumeSurge: string;
  pattern: string;
  signalCandidate: SignalCandidate;
}

/**
 * Dynamic empty data structures — live data flows from backend endpoints.
 */
export const signals: readonly Signal[] = [];
export const screenerItems: readonly ScreenerItem[] = [];
export const marketTicks: readonly unknown[] = [];
export const watchlist: readonly unknown[] = [];

export const paperPortfolio = {
  totalEquity: 0,
  initialCapital: 0,
  realizedPnl: 0,
  unrealizedPnl: 0,
  availableMargin: 0,
  marginUsed: 0,
  winRate: "0.0%",
  positions: [],
  recentExecutions: [],
};
