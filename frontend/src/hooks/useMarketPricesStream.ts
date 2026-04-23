import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { getWsUrl } from "../lib/env";

export type PriceTick = { price: number; changePct: number };

function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return Number.NaN;
}

/**
 * Subscribes to Spring STOMP topic `/topic/prices` (see backend `MarketPriceTicker`).
 * Each message is a JSON object keyed by symbol with `{ symbol, price, changePct }`.
 */
export function useMarketPricesStream(enabled: boolean) {
  const [connected, setConnected] = useState(false);
  const [ticks, setTicks] = useState<Record<string, PriceTick> | null>(null);
  const [lastTickAt, setLastTickAt] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setConnected(false);
      setTicks(null);
      setLastTickAt(null);
      return;
    }
    const url = getWsUrl();
    if (!url) {
      setConnected(false);
      setLastTickAt(null);
      return;
    }

    const client = new Client({
      brokerURL: url,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/prices", (message) => {
          try {
            const raw = JSON.parse(message.body) as Record<string, unknown>;
            const next: Record<string, PriceTick> = {};
            for (const [k, v] of Object.entries(raw)) {
              if (!v || typeof v !== "object") continue;
              const o = v as Record<string, unknown>;
              const price = num(o.price);
              const changePct = num(o.changePct);
              if (!Number.isFinite(price)) continue;
              const sym = typeof o.symbol === "string" ? o.symbol : k;
              next[sym] = {
                price,
                changePct: Number.isFinite(changePct) ? changePct : 0,
              };
            }
            if (Object.keys(next).length > 0) {
              setTicks(next);
              setLastTickAt(Date.now());
            }
          } catch {
            /* ignore malformed payloads */
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    return () => {
      void client.deactivate();
      setConnected(false);
    };
  }, [enabled]);

  return { connected, ticks, lastTickAt };
}
