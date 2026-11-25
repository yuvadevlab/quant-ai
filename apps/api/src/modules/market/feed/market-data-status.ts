/**
 * @fileoverview Market quote freshness classification for Indian exchange sessions.
 */

import { MarketDataStatus } from "@quant-ai/shared-types";

const INDIA_TIME_ZONE = "Asia/Kolkata";
const LIVE_QUOTE_MAX_AGE_MS = 15 * 60 * 1000;
const SESSION_CLOSE_MINUTES = 15 * 60 + 30;
const CLOSE_QUOTE_WINDOW_START_MINUTES = 15 * 60;
const CLOSE_QUOTE_WINDOW_END_MINUTES = 16 * 60;

interface IndiaTimeParts {
  readonly date: string;
  readonly weekday: string;
  readonly minutes: number;
}

function getIndiaTimeParts(date: Date): IndiaTimeParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    weekday: values.weekday ?? "",
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

/**
 * Classifies provider quote age, accepting an observed same-day NSE close as a close snapshot.
 *
 * @param observedAt - Provider observation timestamp.
 * @param now - Current time, injectable for deterministic tests.
 * @returns The quote's market-data status.
 */
export function classifyMarketDataStatus(
  observedAt: Date,
  now: Date = new Date(),
): MarketDataStatus {
  if (!Number.isFinite(observedAt.getTime())) return MarketDataStatus.UNAVAILABLE;

  const quoteAgeMs = now.getTime() - observedAt.getTime();
  const observedIndia = getIndiaTimeParts(observedAt);
  const nowIndia = getIndiaTimeParts(now);
  const isWeekday = nowIndia.weekday !== "Sat" && nowIndia.weekday !== "Sun";
  const isSameDayClose =
    quoteAgeMs >= 0 &&
    isWeekday &&
    observedIndia.date === nowIndia.date &&
    observedIndia.minutes >= CLOSE_QUOTE_WINDOW_START_MINUTES &&
    observedIndia.minutes <= CLOSE_QUOTE_WINDOW_END_MINUTES &&
    nowIndia.minutes >= SESSION_CLOSE_MINUTES;

  if (isSameDayClose) return MarketDataStatus.MARKET_CLOSED;
  if (quoteAgeMs >= 0 && quoteAgeMs <= LIVE_QUOTE_MAX_AGE_MS) {
    return MarketDataStatus.PROVIDER_UNVERIFIED;
  }
  return MarketDataStatus.STALE;
}

/**
 * Indicates whether a quote status is suitable for price-based analysis.
 *
 * @param status - Market data status to evaluate.
 * @returns True for provider-backed quotes, including a same-day market-close snapshot.
 */
export function isUsableMarketDataStatus(status: MarketDataStatus): boolean {
  return (
    status === MarketDataStatus.VERIFIED ||
    status === MarketDataStatus.PROVIDER_UNVERIFIED ||
    status === MarketDataStatus.MARKET_CLOSED
  );
}
