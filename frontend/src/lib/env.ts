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
