import { useEffect, useState } from "react";
import { usePriceStream } from "../../contexts/PriceStreamContext";
import { getAuthToken } from "../../lib/api/client";
import { isApiConfigured } from "../../lib/env";

/**
 * App-wide data plane: API mode, price WebSocket, and session (read-only).
 */
export function ConnectionStatus() {
  const hasApi = isApiConfigured();
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  useEffect(() => {
    const sync = () => setToken(getAuthToken());
    sync();
    if (typeof globalThis.window === "undefined") return;
    globalThis.window.addEventListener("auth-changed", sync);
    globalThis.window.addEventListener("focus", sync);
    return () => {
      globalThis.window.removeEventListener("auth-changed", sync);
      globalThis.window.removeEventListener("focus", sync);
    };
  }, []);
  const { connected, lastTickAt } = usePriceStream();

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 border-b border-white/[0.06] px-1 pb-2 mb-1"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            hasApi ? "bg-sky-400" : "bg-amber-500/80"
          }`}
        />
        {hasApi ? (
          <span>
            Data: <span className="text-slate-300">API</span>
          </span>
        ) : (
          <span>
            Data: <span className="text-amber-200/90">Mock</span>
          </span>
        )}
      </span>
      {hasApi && (
        <span className="inline-flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected
                ? "bg-emerald-400"
                : lastTickAt
                  ? "bg-amber-400"
                  : "bg-slate-600"
            }`}
          />
          {connected ? (
            <span>
              Prices: <span className="text-emerald-400/90">stream live</span>
            </span>
          ) : (
            <span>
              Prices: <span className="text-slate-400">stream idle</span>
            </span>
          )}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            hasApi && token ? "bg-emerald-400" : "bg-slate-600"
          }`}
        />
        {hasApi ? (
          token ? (
            <span>
              Session: <span className="text-slate-300">signed in</span>
            </span>
          ) : (
            <span>
              Session:{" "}
              <span className="text-slate-400">use Profile to log in</span>
            </span>
          )
        ) : (
          <span>Session: n/a in mock mode</span>
        )}
      </span>
    </div>
  );
}
