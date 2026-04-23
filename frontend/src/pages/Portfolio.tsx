import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PortfolioLineChart } from "../components/charts/PortfolioLineChart";
import { AppShell } from "../components/layout/AppShell";
import { DataSourceBadge } from "../components/ui/DataSourceBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { GlassCard } from "../components/ui/GlassCard";
import { portfolioChartSeries, portfolioTotalValue } from "../data/mockData";
import { usePortfolioRows } from "../hooks/usePortfolioRows";

const PORTFOLIO_CHART_DATA = portfolioChartSeries();

export function Portfolio() {
  const { rows, source, loading, error, refetch } = usePortfolioRows();
  const total = portfolioTotalValue(rows);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-sky-400/80 mb-1">
              Clean financial UX
            </p>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Portfolio
            </h1>
          </div>
          <DataSourceBadge source={source} loading={loading} />
        </div>

        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>API unreachable — showing demo holdings. {error}</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="shrink-0 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/15 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && rows.length === 0 ? (
          <EmptyState
            title="No open positions"
            description="When you buy shares with the API (or in demo), your holdings will show here with live prices."
            action={{ to: "/trade", label: "Start trading" }}
            icon="▣"
          />
        ) : null}

        {!loading && rows.length === 0 ? null : (
          <div className="grid grid-cols-12 gap-4 lg:gap-5">
            <motion.div
              className="col-span-12 lg:col-span-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <p className="text-sm text-slate-400 mb-1">Net value</p>
                <p className="text-3xl font-semibold text-white tabular-nums">
                  ${total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-emerald-400 mt-2 font-medium">
                  +18.2% all time
                </p>
              </GlassCard>
            </motion.div>

            <div className="col-span-12 lg:col-span-8">
              <GlassCard className="min-h-[220px]">
                <h2 className="text-sm font-semibold text-white mb-2">
                  Performance
                </h2>
                <p className="text-xs text-slate-500 mb-3">
                  Portfolio evolution (simulated curve)
                </p>
                <PortfolioLineChart data={PORTFOLIO_CHART_DATA} height={200} />
              </GlassCard>
            </div>

            <div className="col-span-12">
              <GlassCard hover={false}>
                <h2 className="text-sm font-semibold text-white mb-4">
                  Holdings
                </h2>
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-white/[0.06]">
                        <th className="pb-3 pl-2 font-medium">Symbol</th>
                        <th className="pb-3 font-medium">Qty</th>
                        <th className="pb-3 font-medium">Avg price</th>
                        <th className="pb-3 font-medium">Current</th>
                        <th className="pb-3 pr-2 font-medium text-right">
                          PnL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => {
                        const pnl =
                          row.unrealizedPnl ??
                          row.qty * (row.currentPrice - row.avgPrice);
                        const pnlPct =
                          ((row.currentPrice - row.avgPrice) / row.avgPrice) *
                          100;
                        const pos = pnl >= 0;
                        return (
                          <tr
                            key={row.symbol}
                            className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200"
                          >
                            <td className="py-3 pl-2">
                              <Link
                                to={`/symbol/${row.symbol}`}
                                className="font-semibold text-sky-400 hover:text-sky-300"
                              >
                                {row.symbol}
                              </Link>
                            </td>
                            <td className="py-3 text-slate-300 tabular-nums">
                              {row.qty}
                            </td>
                            <td className="py-3 text-slate-400 tabular-nums">
                              ${row.avgPrice.toFixed(2)}
                            </td>
                            <td className="py-3 text-slate-200 tabular-nums">
                              ${row.currentPrice.toFixed(2)}
                            </td>
                            <td className="py-3 pr-2 text-right">
                              <span
                                className={`font-semibold tabular-nums ${pos ? "text-emerald-400" : "text-red-400"}`}
                              >
                                {pos ? "+" : ""}
                                {pnl.toFixed(0)} $
                              </span>
                              <span className="block text-[11px] text-slate-500">
                                {pos ? "+" : ""}
                                {pnlPct.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
