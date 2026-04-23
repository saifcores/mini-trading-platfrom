import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  useMarketPricesStream,
  type PriceTick,
} from "../hooks/useMarketPricesStream";
import { isApiConfigured } from "../lib/env";

export type PriceStreamValue = {
  connected: boolean;
  ticks: Record<string, PriceTick> | null;
  lastTickAt: number | null;
};

const PriceStreamContext = createContext<PriceStreamValue | null>(null);

/** Single STOMP connection for the app (avoids duplicate sockets per page). */
export function PriceStreamProvider({ children }: { children: ReactNode }) {
  const streamEnabled = isApiConfigured();
  const { connected, ticks, lastTickAt } = useMarketPricesStream(streamEnabled);
  const value = useMemo(
    () => ({ connected, ticks, lastTickAt }),
    [connected, ticks, lastTickAt],
  );
  return (
    <PriceStreamContext.Provider value={value}>
      {children}
    </PriceStreamContext.Provider>
  );
}

export function usePriceStream(): PriceStreamValue {
  const ctx = useContext(PriceStreamContext);
  if (!ctx) {
    throw new Error("usePriceStream must be used within PriceStreamProvider");
  }
  return ctx;
}
