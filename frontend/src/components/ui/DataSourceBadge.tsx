type Props = {
  source: "mock" | "api";
  loading?: boolean;
  /** WebSocket `/topic/prices` connected (Spring STOMP) */
  streamConnected?: boolean;
};

export function DataSourceBadge({ source, loading, streamConnected }: Props) {
  if (loading) {
    return (
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
        Loading…
      </span>
    );
  }
  if (source === "api") {
    return (
      <span
        className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400"
        title={
          streamConnected
            ? "REST + WebSocket price stream"
            : "REST (connecting price stream…)"
        }
      >
        Live API
        {streamConnected ? " · WS" : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
      Demo data
    </span>
  );
}
