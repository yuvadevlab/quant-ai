/**
 * @file src/services/signals.service.ts
 * @description Quantitative predictive signals service.
 * Provides query methods for the signal ledger, real-time monitors, and trajectories.
 * @author yuva.devlab@gmail.com
 */

import { SignalStatus } from "../constants";
import { MOCK_SIGNALS } from "./signals.mock";
import type { PredictiveSignal } from "./signals.types";

/**
 * Filter criteria for the signal ledger.
 */
export interface SignalFilterCriteria {
  readonly status?: SignalStatus;
  readonly query?: string;
}

/**
 * Retrieves all predictive signals matching optional filter criteria.
 *
 * @param criteria - Optional status and query filters
 * @returns Array of matching predictive signals
 */
export function getPredictiveSignals(criteria?: SignalFilterCriteria): readonly PredictiveSignal[] {
  let list = MOCK_SIGNALS;

  if (criteria?.status) {
    list = list.filter((s) => s.status === criteria.status);
  }

  if (criteria?.query) {
    const q = criteria.query.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.companyName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q),
    );
  }

  return list;
}

/**
 * Retrieves a single predictive signal by ID.
 *
 * @param id - Unique signal identifier (e.g. 'PRED-8942')
 * @returns Matching signal or undefined
 */
export function getPredictiveSignalById(id: string): PredictiveSignal | undefined {
  return MOCK_SIGNALS.find((s) => s.id === id);
}

/**
 * Retrieves active high-conviction signals for the Overview desk.
 *
 * @param limit - Maximum number of signals to return (default 3)
 */
export function getActiveSignals(limit = 3): readonly PredictiveSignal[] {
  return MOCK_SIGNALS.filter((s) => s.status === SignalStatus.ACTIVE).slice(0, limit);
}
