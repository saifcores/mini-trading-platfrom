import { useCallback, useEffect, useState } from "react";
import { fetchPortfolio } from "../api/trading";
import type { PortfolioRow } from "../data/mockData";
import { PORTFOLIO } from "../data/mockData";
import { ApiError } from "../lib/api/client";
import { isApiConfigured } from "../lib/env";

type Source = "mock" | "api";

function formatPortfolioError(e: unknown): string {
  if (e instanceof ApiError) return `${e.status} — ${e.message}`;
  if (e instanceof Error) return e.message;
  return "Could not load portfolio";
}

export function usePortfolioRows() {
  const [rows, setRows] = useState<PortfolioRow[]>(PORTFOLIO);
  const [source, setSource] = useState<Source>("mock");
  const [loading, setLoading] = useState(isApiConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;
    fetchPortfolio()
      .then((data) => {
        if (cancelled) return;
        setError(null);
        setRows(data);
        setSource("api");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(formatPortfolioError(e));
        setRows(PORTFOLIO);
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
      setRows(PORTFOLIO);
      setSource("mock");
      setError(null);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    return fetchPortfolio()
      .then((data) => {
        setRows(data);
        setSource("api");
      })
      .catch((e) => {
        setError(formatPortfolioError(e));
        setRows(PORTFOLIO);
        setSource("mock");
      })
      .finally(() => setLoading(false));
  }, []);

  return { rows, source, loading, error, refetch };
}
