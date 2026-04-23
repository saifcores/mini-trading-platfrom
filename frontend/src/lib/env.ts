/**
 * API base URL without trailing slash.
 * - `null` — demo mode (no network).
 * - `""` — same-origin paths `/api/...` (Vite dev proxy to Spring Boot, or static hosting behind a reverse proxy).
 * - `https://host` — absolute backend URL (production or direct-to-8080).
 */
export function getApiBaseUrl(): string | null {
  if (import.meta.env.VITE_API_RELATIVE === "1") {
    return "";
  }
  const explicit = import.meta.env.VITE_API_URL?.trim();
  if (explicit) {
    return explicit.endsWith("/") ? explicit.slice(0, -1) : explicit;
  }
  const proxyTarget = import.meta.env.VITE_DEV_PROXY_TARGET?.trim();
  // `npm run dev`: Vite proxies /api and /ws to this target — use relative URLs on the dev origin
  if (import.meta.env.DEV && proxyTarget) {
    return "";
  }
  return null;
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}

/**
 * STOMP WebSocket endpoint URL (Spring Boot registers `/ws`).
 * Same rules as API base: relative origin in dev behind Vite proxy, or derived from `VITE_API_URL`.
 */
export function getWsUrl(): string | null {
  if (getApiBaseUrl() === null) return null;
  if (typeof globalThis.window === "undefined") return null;
  const base = getApiBaseUrl()!;
  if (base === "") {
    const proto =
      globalThis.window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${globalThis.window.location.host}/ws`;
  }
  try {
    const u = new URL(base);
    const wsProto = u.protocol === "https:" ? "wss:" : "ws:";
    return `${wsProto}//${u.host}/ws`;
  } catch {
    return null;
  }
}
