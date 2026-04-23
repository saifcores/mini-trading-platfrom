import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DataSourceBadge } from "../components/ui/DataSourceBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { GlassCard } from "../components/ui/GlassCard";
import { useOrders } from "../hooks/useOrders";

function StatusBadge({
  status,
}: {
  status: "executed" | "pending" | "failed";
}) {
  const map = {
    executed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pending: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    failed: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  const label = {
    executed: "Executed",
    pending: "Pending",
    failed: "Failed",
  }[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {label}
    </span>
  );
}

export function OrderHistory() {
  const { orders, source, loading, error, refetch } = useOrders();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-violet-400/80 mb-1">
              Order history
            </p>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Orders
            </h1>
          </div>
          <DataSourceBadge source={source} loading={loading} />
        </div>

        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>API unreachable — showing demo orders. {error}</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="shrink-0 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/15 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Place a buy or sell from the trade desk. When you use the live API, executed orders will appear in this list."
            action={{ to: "/trade", label: "Go to trade" }}
            icon="☰"
          />
        ) : (
          <GlassCard hover={false}>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full min-w-[780px] text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/[0.06]">
                    <th className="pb-3 pl-2 font-medium">Date</th>
                    <th className="pb-3 font-medium">Asset</th>
                    <th className="pb-3 font-medium">Qty</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 pr-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200"
                    >
                      <td className="py-3 pl-2 text-slate-400 whitespace-nowrap">
                        {o.date}
                      </td>
                      <td className="py-3">
                        <Link
                          to={`/symbol/${o.asset}`}
                          className="font-semibold text-sky-400 hover:text-sky-300"
                        >
                          {o.asset}
                        </Link>
                      </td>
                      <td className="py-3 text-slate-300 tabular-nums">
                        {o.quantity ?? "—"}
                      </td>
                      <td className="py-3">
                        <span
                          className={
                            o.side === "BUY"
                              ? "text-emerald-400 font-medium"
                              : "text-red-400 font-medium"
                          }
                        >
                          {o.side}
                        </span>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-3 pr-2 text-right tabular-nums text-slate-200">
                        ${o.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </AppShell>
  );
}
