import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAssets } from "../api/trading";
import { usePriceStream } from "../contexts/PriceStreamContext";
import type { Asset } from "../data/mockData";
import { ASSETS } from "../data/mockData";
import { ApiError } from "../lib/api/client";
import { isApiConfigured } from "../lib/env";

type Source = "mock" | "api";

function formatAssetsError(e: unknown): string {
  if (e instanceof ApiError) return `${e.status} — ${e.message}`;
  if (e instanceof Error) return e.message;
  return "Could not load assets";
}

export function useAssets() {
  const streamEnabled = isApiConfigured();
  const { connected: streamConnected, ticks, lastTickAt } = usePriceStream();
  const [listFetchedAt, setListFetchedAt] = useState<number | null>(null);

  const [assets, setAssets] = useState<Asset[]>(ASSETS);
  const [source, setSource] = useState<Source>("mock");
  const [loading, setLoading] = useState(isApiConfigured);
  const [error, setError] = useState<string | null>(null);

  const lastSyncAt = useMemo(() => {
    const a = listFetchedAt ?? 0;
    const b = lastTickAt ?? 0;
    const m = Math.max(a, b);
    return m > 0 ? m : null;
  }, [listFetchedAt, lastTickAt]);

  useEffect(() => {
    if (!streamEnabled || !ticks) return;
    setAssets((prev) =>
      prev.map((a) => {
        const t = ticks[a.symbol];
        if (!t) return a;
        return { ...a, price: t.price, changePct: t.changePct };
      }),
    );
    setSource("api");
  }, [ticks, streamEnabled]);

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;
    fetchAssets()
      .then((data) => {
        if (cancelled) return;
        setError(null);
        setAssets(data);
        setSource("api");
        setListFetchedAt(Date.now());
      })
      .catch((e) => {
        if (cancelled) return;
        setError(formatAssetsError(e));
        setAssets(ASSETS);
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
      setAssets(ASSETS);
      setSource("mock");
      setError(null);
      setLoading(false);
      setListFetchedAt(null);
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    return fetchAssets()
      .then((data) => {
        setAssets(data);
        setSource("api");
        setListFetchedAt(Date.now());
      })
      .catch((e) => {
        setError(formatAssetsError(e));
        setAssets(ASSETS);
        setSource("mock");
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    assets,
    source,
    loading,
    error,
    refetch,
    streamConnected,
    lastSyncAt,
  };
}
