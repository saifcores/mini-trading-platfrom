import { useCallback, useEffect, useState } from "react";
import { fetchPortfolio, TRADING_UPDATED_EVENT } from "../api/trading";
import type { PortfolioRow } from "../data/mockData";
import { PORTFOLIO } from "../data/mockData";
import { ApiError, getAuthToken } from "../lib/api/client";
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
  const [loading, setLoading] = useState(
    () => isApiConfigured() && !!getAuthToken(),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiConfigured() || !getAuthToken()) {
      setLoading(false);
      return;
    }
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
    if (!isApiConfigured() || !getAuthToken()) {
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

  useEffect(() => {
    if (typeof globalThis.window === "undefined") return;
    const onSessionOrTrade = () => void refetch();
    globalThis.window.addEventListener("auth-changed", onSessionOrTrade);
    globalThis.window.addEventListener(TRADING_UPDATED_EVENT, onSessionOrTrade);
    return () => {
      globalThis.window.removeEventListener("auth-changed", onSessionOrTrade);
      globalThis.window.removeEventListener(
        TRADING_UPDATED_EVENT,
        onSessionOrTrade,
      );
    };
  }, [refetch]);

  return { rows, source, loading, error, refetch };
}
