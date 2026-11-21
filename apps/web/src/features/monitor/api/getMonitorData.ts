/**
 * @file src/features/monitor/api/getMonitorData.ts
 * @description Data provider for the real-time Predictive Trajectory Monitor.
 */

import { queryOptions } from "@tanstack/react-query";
import type { Signal as BackendSignal } from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";
import { mapBackendSignalToUi } from "@/features/predictions/api/getPredictionsData";
import { UiSignalStatus, type Signal } from "@/components/quantai/data";

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
  let backendSignal = await apiFetch<BackendSignal>(`/api/predictions/${signalId}`);
  if (!backendSignal) {
    const all = await apiFetch<BackendSignal[]>("/api/predictions");
    backendSignal = all?.find((s) => s.id === signalId) ?? all?.[0] ?? null;
  }

  if (!backendSignal) {
    throw new Error(`Signal ${signalId} not found in prediction ledger`);
  }

  const signal = mapBackendSignalToUi(backendSignal);

  return {
    signal,
    isActive: signal.status === UiSignalStatus.ACTIVE || (signal.status as string) === "ACTIVE",
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
