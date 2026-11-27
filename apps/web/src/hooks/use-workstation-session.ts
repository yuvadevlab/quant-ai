/**
 * @file src/hooks/use-workstation-session.ts
 * @description Centralized dynamic hook providing authenticated user profile, active AI model,
 * real-time telemetry metrics, and IST market session timing state.
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Signal as BackendSignal } from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";
import { mapBackendSignalToUi } from "@/features/predictions/api/getPredictionsData";
import { useAuth } from "../providers/auth";
import { useRealtimeTicks } from "./use-realtime-ticks";
import { calculateSignalsTelemetry, type WorkstationTelemetry } from "./telemetry.util";

export { calculateSignalsTelemetry, type WorkstationTelemetry };

export interface UserSessionProfile {
  readonly email: string;
  readonly name: string;
  readonly initial: string;
  readonly role: string;
}

export interface ActiveAiModelInfo {
  readonly id: string;
  readonly name: string;
  readonly tier: string;
}

export interface MarketSessionInfo {
  readonly isOpen: boolean;
  readonly statusText: string;
  readonly sessionHours: string;
}

export interface WorkstationSessionState {
  readonly user: UserSessionProfile;
  readonly activeModel: ActiveAiModelInfo;
  readonly sessionInfo: MarketSessionInfo;
  readonly telemetry: WorkstationTelemetry;
  readonly isConnected: boolean;
}

/**
 * Calculates current NSE/BSE trading session state in Indian Standard Time (IST).
 *
 * @param date - Reference date (defaults to wall-clock time)
 * @returns MarketSessionInfo describing live session openness and hours
 */
export function getMarketSessionInfo(date: Date = new Date()): MarketSessionInfo {
  // Convert current instant to IST (UTC + 05:30)
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utcTime + istOffsetMs);

  const day = istDate.getDay(); // 0 = Sun, 6 = Sat
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const preOpenStart = 9 * 60; // 09:00
  const marketOpen = 9 * 60 + 15; // 09:15
  const marketClose = 15 * 60 + 30; // 15:30

  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      statusText: "Weekend Closed",
      sessionHours: "NSE/BSE 09:15 - 15:30 IST",
    };
  }

  if (timeInMinutes >= marketOpen && timeInMinutes < marketClose) {
    return {
      isOpen: true,
      statusText: "Live Trading Session",
      sessionHours: "09:15 - 15:30 IST",
    };
  }

  if (timeInMinutes >= preOpenStart && timeInMinutes < marketOpen) {
    return {
      isOpen: false,
      statusText: "Pre-Open Session",
      sessionHours: "09:00 - 09:15 IST",
    };
  }

  if (timeInMinutes < preOpenStart) {
    return {
      isOpen: false,
      statusText: "Market Closed (Opens 09:15 IST)",
      sessionHours: "Session: 09:15 - 15:30 IST",
    };
  }

  return {
    isOpen: false,
    statusText: "Market Closed (Post-Market)",
    sessionHours: "Session: 09:15 - 15:30 IST",
  };
}

/**
 * Universal workstation hook supplying dynamically computed user session, active model,
 * real-time NSE market session hours, and signal ledger hit rates.
 */
export function useWorkstationSession(): WorkstationSessionState {
  const { isConnected } = useRealtimeTicks();
  const { user: authUser } = useAuth();

  const user = useMemo<UserSessionProfile>(() => {
    if (authUser) {
      const fallback = authUser.email.split("@")[0] ?? "Trader";
      const name = authUser.name || fallback;
      const initial = name.charAt(0).toUpperCase() || "Y";
      return {
        email: authUser.email,
        name,
        initial,
        role: authUser.roles?.includes("admin")
          ? "Principal Quantitative Trader (Super Admin)"
          : "DevLab Quantitative Trader",
      };
    }
    return {
      email: "yuva.devlab@gmail.com",
      name: "Yuva DevLab",
      initial: "Y",
      role: "Principal Quantitative Trader (DevLab SSO)",
    };
  }, [authUser]);

  const { data: defaultModel } = useQuery<{
    id: string;
    name: string;
    modelIdentifier: string;
    description?: string;
  }>({
    queryKey: ["active-llm-model"],
    queryFn: async () => {
      const res = await fetch("/api/models/default");
      if (!res.ok) throw new Error("Failed to fetch active model");
      return res.json();
    },
    staleTime: 60000,
    retry: false,
  });

  const { data: rawPredictions = [] } = useQuery<BackendSignal[]>({
    queryKey: ["predictions-telemetry-feed"],
    queryFn: async () => {
      const data = await apiFetch<BackendSignal[]>("/api/predictions");
      return data ?? [];
    },
    staleTime: 1000 * 30,
  });

  const uiSignals = useMemo(() => rawPredictions.map(mapBackendSignalToUi), [rawPredictions]);

  const activeModel = useMemo<ActiveAiModelInfo>(
    () => ({
      id: defaultModel?.modelIdentifier || "nvidia/nemotron-3.5-super-vl:free",
      name: defaultModel?.name || "NVIDIA Nemotron 3.5 Super VL",
      tier: "Active Multi-Agent Engine",
    }),
    [defaultModel],
  );

  const sessionInfo = useMemo(() => getMarketSessionInfo(), []);
  const telemetry = useMemo(() => calculateSignalsTelemetry(uiSignals), [uiSignals]);

  return {
    user,
    activeModel,
    sessionInfo,
    telemetry,
    isConnected,
  };
}
