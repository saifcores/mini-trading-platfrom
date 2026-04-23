import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CandlestickChart } from "../components/charts/CandlestickChart";
import { MiniSparkline } from "../components/charts/MiniSparkline";
import { AppShell } from "../components/layout/AppShell";
import { AnimatedBalance } from "../components/ui/AnimatedBalance";
import { DataSourceBadge } from "../components/ui/DataSourceBadge";
import { GlassCard } from "../components/ui/GlassCard";
import { NEWS, portfolioTotalValue } from "../data/mockData";
import { useAssets } from "../hooks/useAssets";
import { usePortfolioRows } from "../hooks/usePortfolioRows";
import { useWallet } from "../hooks/useWallet";
import { formatLastSyncText } from "../lib/formatLastSync";
import { isApiConfigured } from "../lib/env";

function randSeries(seed: number, n = 12) {
  let x = seed;
  return Array.from({ length: n }, () => {
    x += (Math.random() - 0.45) * 3;
    return x;
  });
}

export function Dashboard() {
  const {
    assets,
    source: assetSource,
    loading: assetsLoading,
    error: assetsError,
    refetch: refetchAssets,
    streamConnected,
    lastSyncAt,
  } = useAssets();
  const { balance: cashBalance, source: walletSource } = useWallet();
  const {
    rows: portfolioRows,
    source: portfolioSource,
    loading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = usePortfolioRows();

  const netWorth = useMemo(
    () => cashBalance + portfolioTotalValue(portfolioRows),
    [cashBalance, portfolioRows],
  );

  const sparklinesBySymbol = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const row of portfolioRows) {
      map[row.symbol] = randSeries(row.currentPrice);
    }
    return map;
  }, [portfolioRows]);

  const netWorthLive = walletSource === "api" && portfolioSource === "api";

  const movers = useMemo(
    () =>
      [...assets]
        .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
        .slice(0, 5),
    [assets],
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
              Overview
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            {formatLastSyncText(lastSyncAt, isApiConfigured(), assetSource)}
          </p>
        </div>

        {(assetsError || portfolioError) && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>
              {assetsError && (
                <>
                  Market list: {assetsError}
                  <br />
                </>
              )}
              {portfolioError && <>Portfolio: {portfolioError}</>}
            </span>
            <div className="flex flex-wrap gap-2 shrink-0">
              {assetsError && (
                <button
                  type="button"
                  onClick={() => void refetchAssets()}
                  className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/15 transition-colors"
                >
                  Retry markets
                </button>
              )}
              {portfolioError && (
                <button
                  type="button"
                  onClick={() => void refetchPortfolio()}
                  className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/15 transition-colors"
                >
                  Retry portfolio
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4 lg:gap-5">
          <motion.div
            className="col-span-12 lg:col-span-5 xl:col-span-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="relative overflow-hidden min-h-[180px]">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-sky-500/25 to-violet-600/20 blur-3xl pointer-events-none" />
              <p className="text-sm text-slate-400 mb-2">
                Net worth{" "}
                <span className="text-slate-600">(cash + positions)</span>
              </p>
              <p className="text-3xl lg:text-4xl font-semibold text-white mb-2">
                <AnimatedBalance value={netWorth} />
              </p>
              <p className="text-sm text-slate-500 font-medium">
                {netWorthLive
                  ? "Live wallet & portfolio"
                  : "Demo cash + demo or cached portfolio"}
              </p>
              <div className="mt-6 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Goal progress · Tier Gold
              </p>
            </GlassCard>
          </motion.div>

          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <GlassCard className="h-full min-h-[280px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Live chart</h2>
                <span className="text-[11px] uppercase tracking-wider text-slate-500">
                  Candlestick · 1H
                </span>
              </div>
              <CandlestickChart height={260} />
            </GlassCard>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <GlassCard>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-sm font-semibold text-white">
                  Portfolio overview
                </h2>
                <DataSourceBadge
                  source={portfolioSource}
                  loading={portfolioLoading}
                />
              </div>
              <div className="space-y-3">
                {portfolioRows.map((row) => {
                  const pnl = row.qty * (row.currentPrice - row.avgPrice);
                  const pos = pnl >= 0;
                  return (
                    <div
                      key={row.symbol}
                      className="flex items-center justify-between gap-3 py-2 border-b border-white/[0.05] last:border-0"
                    >
                      <div>
                        <Link
                          to={`/symbol/${row.symbol}`}
                          className="font-semibold text-sky-400 hover:text-sky-300"
                        >
                          {row.symbol}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {row.qty} sh · avg ${row.avgPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <MiniSparkline
                          values={sparklinesBySymbol[row.symbol] ?? []}
                          positive={pos}
                        />
                        <p
                          className={`text-xs font-medium mt-1 ${pos ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {pos ? "+" : ""}
                          {pnl.toFixed(0)} $
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <GlassCard>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-sm font-semibold text-white">Top movers</h2>
                <DataSourceBadge
                  source={assetSource}
                  loading={assetsLoading}
                  streamConnected={streamConnected}
                />
              </div>
              <div className="space-y-2">
                {movers.map((a) => (
                  <Link
                    key={a.symbol}
                    to={`/symbol/${a.symbol}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-200"
                  >
                    <div>
                      <p className="font-medium text-white">{a.symbol}</p>
                      <p className="text-[11px] text-slate-500">{a.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-200">
                        ${a.price.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          a.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {a.changePct >= 0 ? "+" : ""}
                        {a.changePct.toFixed(2)}%
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="col-span-12">
            <GlassCard>
              <h2 className="text-sm font-semibold text-white mb-4">
                Market news
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {NEWS.map((n) => (
                  <article
                    key={n.id}
                    className="rounded-xl border border-white/[0.06] bg-navy-900/40 p-4 hover:border-sky-500/25 transition-colors duration-200"
                  >
                    <p className="text-sm text-slate-200 leading-snug mb-3">
                      {n.title}
                    </p>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{n.source}</span>
                      <span>{n.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
