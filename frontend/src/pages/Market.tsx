import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DataSourceBadge } from "../components/ui/DataSourceBadge";
import { GlassCard } from "../components/ui/GlassCard";
import { useAssets } from "../hooks/useAssets";
import { isApiConfigured } from "../lib/env";

type SortKey = "absChange" | "name" | "symbol";

export function Market() {
  const { assets, source, loading, error, refetch, streamConnected } =
    useAssets();
  const [sort, setSort] = useState<SortKey>("absChange");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const filtered = !q.trim()
      ? assets
      : assets.filter(
          (a) =>
            a.symbol.toLowerCase().includes(q.toLowerCase().trim()) ||
            a.name.toLowerCase().includes(q.toLowerCase().trim()),
        );
    const list = [...filtered];
    list.sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sort === "symbol") {
        return a.symbol.localeCompare(b.symbol);
      }
      return (
        Math.abs(b.changePct) - Math.abs(a.changePct) ||
        a.symbol.localeCompare(b.symbol)
      );
    });
    return list;
  }, [assets, q, sort]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-cyan-400/80 mb-1">
              Browse
            </p>
            <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
              Markets
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search symbols, then open a detail page or go straight to trade.
            </p>
          </div>
          <DataSourceBadge
            source={source}
            loading={loading}
            streamConnected={streamConnected}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>Could not load list — {error}</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="shrink-0 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/15"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Filter by symbol or name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:max-w-md rounded-xl border border-white/10 bg-navy-900/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider">
              Sort
            </span>
            {(
              [
                ["absChange", "Movers"] as const,
                ["symbol", "Symbol"] as const,
                ["name", "Name"] as const,
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSort(k)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  sort === k
                    ? "bg-white/10 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="py-3 pl-4 font-medium">Symbol</th>
                  <th className="py-3 font-medium">Name</th>
                  <th className="py-3 font-medium text-right">Price</th>
                  <th className="py-3 pr-4 font-medium text-right">Chg</th>
                  <th className="py-3 pr-4 font-medium text-right w-[180px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr
                    key={a.symbol}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 pl-4">
                      <Link
                        to={`/symbol/${a.symbol}`}
                        className="font-semibold text-sky-400 hover:text-sky-300"
                      >
                        {a.symbol}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-400 max-w-[220px] truncate">
                      {a.name}
                    </td>
                    <td className="py-3 text-right tabular-nums text-slate-200">
                      ${a.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 text-right font-medium tabular-nums ${
                        a.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {a.changePct >= 0 ? "+" : ""}
                      {a.changePct.toFixed(2)}%
                    </td>
                    <td className="py-3 pr-4 text-right space-x-2">
                      <Link
                        to={`/symbol/${a.symbol}`}
                        className="text-xs text-slate-500 hover:text-white"
                      >
                        Detail
                      </Link>
                      <Link
                        to={
                          isApiConfigured()
                            ? `/trade?symbol=${encodeURIComponent(a.symbol)}`
                            : `/trade`
                        }
                        className="text-xs font-medium text-sky-400 hover:text-sky-300"
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
