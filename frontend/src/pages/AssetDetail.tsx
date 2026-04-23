import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CandlestickChart } from "../components/charts/CandlestickChart";
import { AppShell } from "../components/layout/AppShell";
import { DataSourceBadge } from "../components/ui/DataSourceBadge";
import { GlassCard } from "../components/ui/GlassCard";
import { useAssets } from "../hooks/useAssets";
import { isApiConfigured } from "../lib/env";

export function AssetDetail() {
  const { symbol: raw } = useParams();
  const symbol = (raw ?? "").toUpperCase();
  const { assets, source, loading, error, refetch, streamConnected } =
    useAssets();

  const asset = useMemo(
    () => assets.find((a) => a.symbol === symbol),
    [assets, symbol],
  );

  if (!raw?.trim()) {
    return <Navigate to="/market" replace />;
  }

  if (!loading && !asset) {
    return <Navigate to="/market" replace />;
  }

  return (
    <AppShell wide>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-sky-400/80 mb-1">
              Asset
            </p>
            {asset ? (
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {asset.symbol}
                <span className="text-slate-500 text-lg font-normal">
                  {" "}
                  — {asset.name}
                </span>
              </h1>
            ) : (
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {symbol}
              </h1>
            )}
            <p className="text-sm text-slate-500 mt-1">
              <Link to="/market" className="text-sky-400 hover:text-sky-300">
                ← All markets
              </Link>
            </p>
          </div>
          {asset && (
            <DataSourceBadge
              source={source}
              loading={loading}
              streamConnected={streamConnected}
            />
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="shrink-0 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {asset && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <GlassCard className="lg:col-span-1">
              <p className="text-xs text-slate-500 mb-1">Last price</p>
              <p className="text-3xl font-semibold text-white tabular-nums">
                ${asset.price.toFixed(2)}
              </p>
              <p
                className={`text-sm font-medium mt-2 ${
                  asset.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {asset.changePct >= 0 ? "+" : ""}
                {asset.changePct.toFixed(2)}% today
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  to={
                    isApiConfigured()
                      ? `/trade?symbol=${encodeURIComponent(asset.symbol)}`
                      : "/trade"
                  }
                  className="text-center rounded-xl bg-sky-600 py-2.5 text-sm font-medium text-white hover:bg-sky-500"
                >
                  Trade {asset.symbol}
                </Link>
                <Link
                  to="/portfolio"
                  className="text-center rounded-xl border border-white/10 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                >
                  View portfolio
                </Link>
              </div>
            </GlassCard>
            <GlassCard className="lg:col-span-2 min-h-[300px]">
              <h2 className="text-sm font-semibold text-white mb-2">
                Chart · 1H
              </h2>
              <CandlestickChart key={asset.symbol} height={320} />
            </GlassCard>
          </div>
        )}

        {loading && !asset && (
          <p className="text-sm text-slate-500">Loading asset…</p>
        )}
      </div>
    </AppShell>
  );
}
