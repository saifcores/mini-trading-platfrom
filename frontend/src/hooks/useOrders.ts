import { useCallback, useEffect, useState } from "react";
import { fetchOrders } from "../api/trading";
import type { OrderRow } from "../data/mockData";
import { ORDERS } from "../data/mockData";
import { ApiError } from "../lib/api/client";
import { isApiConfigured } from "../lib/env";

type Source = "mock" | "api";

function formatOrdersError(e: unknown): string {
  if (e instanceof ApiError) return `${e.status} — ${e.message}`;
  if (e instanceof Error) return e.message;
  return "Could not load orders";
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderRow[]>(ORDERS);
  const [source, setSource] = useState<Source>("mock");
  const [loading, setLoading] = useState(isApiConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;
    fetchOrders()
      .then((data) => {
        if (cancelled) return;
        setError(null);
        setOrders(data);
        setSource("api");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(formatOrdersError(e));
        setOrders(ORDERS);
        setSource("mock");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refetch = useCallback(() => {
    if (!isApiConfigured()) {
      setOrders(ORDERS);
      setSource("mock");
      setError(null);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    return fetchOrders()
      .then((data) => {
        setOrders(data);
        setSource("api");
      })
      .catch((e) => {
        setError(formatOrdersError(e));
        setOrders(ORDERS);
        setSource("mock");
      })
      .finally(() => setLoading(false));
  }, []);

  return { orders, source, loading, error, refetch };
}
