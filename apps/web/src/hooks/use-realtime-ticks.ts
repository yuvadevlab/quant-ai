/**
 * @fileoverview React hook managing WebSocket subscription to real-time market tick streams.
 * @author yuva.devlab@gmail.com
 */

import { useEffect, useState, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import {
  RealtimeClientEvent,
  RealtimeRoom,
  RealtimeServerEvent,
  WsNamespace,
} from "@quant-ai/shared-types";
import { WEB_ENV } from "../constants/env.constants";

export interface LiveTick {
  readonly symbol: string;
  readonly price: number;
  readonly change: number;
  readonly percentChange: number;
  readonly timestamp: string;
}

interface UseRealtimeTicksReturn {
  readonly ticks: Readonly<Record<string, LiveTick>>;
  readonly isConnected: boolean;
}

/**
 * Subscribes to the QuantAI WebSocket gateway and maintains the latest price ticks.
 *
 * @returns Object with live ticks dictionary and gateway connection state
 */
export function useRealtimeTicks(): UseRealtimeTicksReturn {
  const [ticks, setTicks] = useState<Record<string, LiveTick>>({});
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
        room: RealtimeRoom.TICKERS,
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on(RealtimeServerEvent.TICK, (payload: LiveTick) => {
      if (payload?.symbol) {
        setTicks((prev) => ({
          ...prev,
          [payload.symbol]: payload,
        }));
      }
    });

    return () => {
      socket.emit(RealtimeClientEvent.UNSUBSCRIBE, {
        room: RealtimeRoom.TICKERS,
      });
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { ticks, isConnected };
}
