/**
 * @file src/features/monitor/api/getMonitorData.ts
 * @description Data provider for the real-time Predictive Trajectory Monitor.
 */

import { queryOptions } from "@tanstack/react-query";
import { signals, type Signal } from "@/components/quantai/data";

export interface MonitorData {
  readonly signal: Signal;
  readonly isActive: boolean;
}

/**
 * Retrieves the predictive signal and trajectory telemetry for a given ID.
 *
 * @param signalId - Signal ID (e.g. 'PRED-8942')
 * @returns MonitorData payload
 */
export async function getMonitorData(signalId: string): Promise<MonitorData> {
  const fallbackSignal = signals[0]!;
  const signal = signals.find((entry) => entry.id === signalId) ?? fallbackSignal;

  return {
    signal,
    isActive: signal.status === "Active",
  };
}

/**
 * Canonical TanStack Query options for the signal monitor.
 *
 * @param signalId - Signal ID
 */
export const monitorQueryOptions = (signalId: string) =>
  queryOptions({
    queryKey: ["monitor-signal", signalId],
    queryFn: () => getMonitorData(signalId),
    staleTime: 1000 * 15,
  });
