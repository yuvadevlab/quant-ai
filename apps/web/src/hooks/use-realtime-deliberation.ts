/**
 * @file apps/web/src/hooks/use-realtime-deliberation.ts
 * @description React 19 hook subscribing to real-time multi-agent deliberation streams and live signal updates.
 */

import { useEffect, useState, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import {
  RealtimeClientEvent,
  RealtimeRoom,
  RealtimeServerEvent,
  WsNamespace,
  AgentStance,
} from "@quant-ai/shared-types";
import { WEB_ENV } from "../constants/env.constants";

export interface LiveAgentSpeech {
  readonly predictionId: string;
  readonly agentName: string;
  readonly stance: AgentStance | string;
  readonly reasoning: string;
  readonly confidence: number;
  readonly timestamp: string;
}

export interface LiveSignalUpdate {
  readonly id: string;
  readonly ticker: string;
  readonly currentPrice: number;
  readonly pnlPercent: number;
  readonly status: string;
}

interface UseRealtimeDeliberationReturn {
  readonly agentSpeeches: Readonly<Record<string, LiveAgentSpeech>>;
  readonly latestSignalUpdate: LiveSignalUpdate | null;
  readonly isConnected: boolean;
}

/**
 * Subscribes to the QuantAI WebSocket gateway and streams real-time agent debate verdicts.
 *
 * @param predictionId Active prediction to filter updates for.
 * @returns Real-time agent speeches, latest signal telemetry, and connection state.
 */
export function useRealtimeDeliberation(predictionId?: string): UseRealtimeDeliberationReturn {
  const [agentSpeeches, setAgentSpeeches] = useState<Record<string, LiveAgentSpeech>>({});
  const [latestSignalUpdate, setLatestSignalUpdate] = useState<LiveSignalUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const wsUrl = `${WEB_ENV.VITE_WS_URL}${WsNamespace.REALTIME}`;
    const socket = io(wsUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit(RealtimeClientEvent.SUBSCRIBE, {
        room: RealtimeRoom.DELIBERATION,
      });
      socket.emit(RealtimeClientEvent.SUBSCRIBE, {
        room: RealtimeRoom.SIGNALS,
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on(RealtimeServerEvent.AGENT_SPEECH, (payload: LiveAgentSpeech) => {
      if (!predictionId || payload.predictionId === predictionId) {
        setAgentSpeeches((prev) => ({
          ...prev,
          [payload.agentName]: payload,
        }));
      }
    });

    socket.on(RealtimeServerEvent.SIGNAL_UPDATE, (payload: LiveSignalUpdate) => {
      if (!predictionId || payload.id === predictionId) {
        setLatestSignalUpdate(payload);
      }
    });

    return () => {
      socket.emit(RealtimeClientEvent.UNSUBSCRIBE, {
        room: RealtimeRoom.DELIBERATION,
      });
      socket.emit(RealtimeClientEvent.UNSUBSCRIBE, {
        room: RealtimeRoom.SIGNALS,
      });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [predictionId]);

  return { agentSpeeches, latestSignalUpdate, isConnected };
}
