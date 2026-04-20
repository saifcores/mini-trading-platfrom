import { useCallback, useEffect, useState } from "react";
import { fetchAssets } from "../api/trading";
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
  const [assets, setAssets] = useState<Asset[]>(ASSETS);
  const [source, setSource] = useState<Source>("mock");
  const [loading, setLoading] = useState(isApiConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;
    fetchAssets()
      .then((data) => {
        if (cancelled) return;
        setError(null);
        setAssets(data);
        setSource("api");
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
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    return fetchAssets()
      .then((data) => {
        setAssets(data);
        setSource("api");
      })
      .catch((e) => {
        setError(formatAssetsError(e));
        setAssets(ASSETS);
        setSource("mock");
      })
      .finally(() => setLoading(false));
  }, []);

  return { assets, source, loading, error, refetch };
}
