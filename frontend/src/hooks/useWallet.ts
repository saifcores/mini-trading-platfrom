import { useCallback, useEffect, useState } from "react";
import { fetchWallet } from "../api/trading";
import { ApiError, getAuthToken } from "../lib/api/client";
import { isApiConfigured } from "../lib/env";

/** Demo cash balance when API is off or unauthenticated */
export const DEMO_WALLET_BALANCE = 125_000;

type Source = "mock" | "api";

function formatWalletError(e: unknown): string {
  if (e instanceof ApiError) return `${e.status} — ${e.message}`;
  if (e instanceof Error) return e.message;
  return "Could not load wallet";
}

export function useWallet() {
  const [balance, setBalance] = useState(DEMO_WALLET_BALANCE);
  const [source, setSource] = useState<Source>("mock");
  const [loading, setLoading] = useState(
    () => isApiConfigured() && !!getAuthToken(),
  );
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!isApiConfigured() || !getAuthToken()) {
      setBalance(DEMO_WALLET_BALANCE);
      setSource("mock");
      setError(null);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    return fetchWallet()
      .then((w) => {
        setBalance(w.balance);
        setSource("api");
      })
      .catch((e) => {
        setError(formatWalletError(e));
        setBalance(DEMO_WALLET_BALANCE);
        setSource("mock");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const onFocus = () => void refetch();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  return { balance, source, loading, error, refetch };
}
