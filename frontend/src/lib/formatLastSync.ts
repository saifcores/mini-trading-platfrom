/** Human-readable “last update” for market data (prices or HTTP fetch). */
export function formatLastSyncText(
  lastSyncAt: number | null,
  hasApi: boolean,
  source: "mock" | "api",
): string {
  if (!hasApi) {
    return "Demo data · connect API for live markets";
  }
  if (source === "mock" && lastSyncAt == null) {
    return "Falling back to demo symbols";
  }
  if (lastSyncAt == null) {
    return "Loading…";
  }
  const sec = (Date.now() - lastSyncAt) / 1000;
  if (sec < 2) {
    return "Updated just now";
  }
  if (sec < 60) {
    return `Updated ${Math.floor(sec)}s ago`;
  }
  if (sec < 3600) {
    return `Updated ${Math.floor(sec / 60)}m ago`;
  }
  return `Updated ${new Date(lastSyncAt).toLocaleString()}`;
}
