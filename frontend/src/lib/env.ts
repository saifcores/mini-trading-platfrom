/**
 * API base URL without trailing slash.
 * - `null` — demo mode (no network).
 * - `""` — same-origin relative paths (use with Vite `server.proxy` + `VITE_API_RELATIVE=1`).
 * - `https://host` — absolute backend URL.
 */
export function getApiBaseUrl(): string | null {
  if (import.meta.env.VITE_API_RELATIVE === "1") {
    return "";
  }
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) return null;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}
