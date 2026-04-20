import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CandlestickChart } from "../components/charts/CandlestickChart";
import { AppShell } from "../components/layout/AppShell";
import { TradeConfirmModal } from "../components/trading/TradeConfirmModal";
import { DataSourceBadge } from "../components/ui/DataSourceBadge";
import { useAssets } from "../hooks/useAssets";
import { useToast } from "../hooks/useToast";
import { ASSETS } from "../data/mockData";

const BALANCE = 125_000;

export function Trading() {
  const showToast = useToast();
  const {
    assets,
    source: assetSource,
    loading: assetsLoading,
    error: assetsError,
    refetch: refetchAssets,
  } = useAssets();
  const [selectedSymbol, setSelectedSymbol] = useState(ASSETS[0].symbol);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [qty, setQty] = useState("2");
  const [priceBlink, setPriceBlink] = useState<"up" | "down" | null>(null);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(
    {},
  );
  const [modalOpen, setModalOpen] = useState(false);
  const blinkClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const priceMap = useMemo(
    () => Object.fromEntries(assets.map((a) => [a.symbol, a.price])),
    [assets],
  );

  const selected = useMemo(() => {
    const found = assets.find((a) => a.symbol === selectedSymbol);
    if (found) return found;
    return assets[0] ?? ASSETS[0];
  }, [assets, selectedSymbol]);

  const livePrice =
    priceOverrides[selected.symbol] ??
    priceMap[selected.symbol] ??
    selected.price;

  useEffect(() => {
    const id = window.setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.4;
      setPriceOverrides((prev) => {
        const cur =
          prev[selectedSymbol] ??
          priceMap[selectedSymbol] ??
          assets.find((a) => a.symbol === selectedSymbol)?.price ??
          ASSETS[0].price;
        const next = Math.max(1, cur + delta);
        return { ...prev, [selectedSymbol]: next };
      });
      if (blinkClearRef.current) clearTimeout(blinkClearRef.current);
      setPriceBlink(delta >= 0 ? "up" : "down");
      blinkClearRef.current = window.setTimeout(() => {
        setPriceBlink(null);
        blinkClearRef.current = null;
      }, 500);
    }, 2500);
    return () => {
      clearInterval(id);
      if (blinkClearRef.current) clearTimeout(blinkClearRef.current);
    };
  }, [selectedSymbol, priceMap, assets]);

  const qtyNum = Number(qty) || 0;
  const total = qtyNum * livePrice;

  const insufficient = side === "buy" && total > BALANCE;

  const openConfirm = () => {
    if (insufficient) {
      showToast(
        "Insufficient funds for this order. Reduce quantity or add funds.",
        "error",
      );
      return;
    }
    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      showToast("Enter a valid quantity.", "error");
      return;
    }
    setModalOpen(true);
  };

  const closeModal = useCallback(() => setModalOpen(false), []);

  const confirmTrade = useCallback(() => {
    setModalOpen(false);
    showToast(
      side === "buy"
        ? `Buy order for ${qtyNum} ${selected.symbol} submitted.`
        : `Sell order for ${qtyNum} ${selected.symbol} submitted.`,
      "success",
    );
  }, [qtyNum, selected.symbol, showToast, side]);

  return (
    <AppShell wide>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-violet-400/90 mb-1">
            Modern trading app · High-end SaaS design
          </p>
          <h1 className="text-xl lg:text-2xl font-semibold text-white tracking-tight">
            Trade
          </h1>
        </div>

        {assetsError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>
              Asset list API unreachable — using demo symbols. {assetsError}
            </span>
            <button
              type="button"
              onClick={() => void refetchAssets()}
              className="shrink-0 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/15 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4 lg:gap-5 min-h-[min(70vh,720px)]">
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-2 min-h-[200px] lg:min-h-0">
            <div className="flex items-center justify-between gap-2 px-1">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">
                Assets
              </p>
              <DataSourceBadge source={assetSource} loading={assetsLoading} />
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden flex-1 flex flex-col max-h-[320px] lg:max-h-none">
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {assets.map((a) => (
                  <button
                    key={a.symbol}
                    type="button"
                    onClick={() => setSelectedSymbol(a.symbol)}
                    className={`w-full text-left rounded-xl px-3 py-2.5 transition-all duration-200 ${
                      selected.symbol === a.symbol
                        ? "bg-white/[0.1] shadow-[inset_0_0_0_1px_rgba(56,189,248,0.25)]"
                        : "hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-white">
                        {a.symbol}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          a.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {a.changePct >= 0 ? "+" : ""}
                        {a.changePct.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {a.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-6 flex flex-col min-h-[280px]">
            <div className="glass-panel rounded-2xl p-4 flex-1 flex flex-col">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {selected.symbol}
                  </h2>
                  <p className="text-sm text-slate-500">{selected.name}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-semibold tabular-nums transition-colors duration-200 ${
                      priceBlink === "up"
                        ? "text-blink-up text-emerald-400"
                        : priceBlink === "down"
                          ? "text-blink-down text-red-400"
                          : "text-white"
                    }`}
                  >
                    ${livePrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">Last · simulated</p>
                </div>
              </div>
              <div className="flex-1 min-h-[240px]">
                <CandlestickChart key={selected.symbol} height={300} />
              </div>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-3">
            <div className="glass-panel rounded-2xl p-5 neu-inset lg:shadow-none sticky top-4">
              <div className="flex rounded-xl bg-navy-950/80 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => setSide("buy")}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
                    side === "buy"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSide("sell")}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
                    side === "sell"
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sell
                </button>
              </div>

              <label className="block text-xs text-slate-500 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-3 py-2.5 text-white text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-shadow duration-200"
              />

              <label className="block text-xs text-slate-500 mb-1.5">
                Price (auto)
              </label>
              <input
                readOnly
                value={`$${livePrice.toFixed(2)}`}
                className="w-full rounded-xl border border-white/10 bg-navy-950/60 px-3 py-2.5 text-slate-300 text-sm mb-4"
              />

              <div className="rounded-xl border border-white/[0.06] bg-navy-900/50 p-3 mb-4 space-y-1 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Est. total</span>
                  <span className="text-white tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Buying power</span>
                  <span className="text-slate-300">
                    ${BALANCE.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={openConfirm}
                className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-transform duration-200 active:scale-[0.98] ${
                  side === "buy"
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30"
                    : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/30"
                }`}
              >
                {side === "buy" ? "Review buy" : "Review sell"}
              </button>
              <p className="text-[10px] text-slate-600 text-center mt-3 leading-relaxed">
                Clean financial UX: confirm before execution. Simulated venue.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <TradeConfirmModal
        open={modalOpen}
        title={side === "buy" ? "Confirm buy order" : "Confirm sell order"}
        variant={side}
        confirmLabel={side === "buy" ? "Confirm buy" : "Confirm sell"}
        onCancel={closeModal}
        onConfirm={confirmTrade}
      >
        <p>
          <span className="text-slate-500">Asset</span>{" "}
          <span className="text-white font-medium">{selected.symbol}</span>
        </p>
        <p>
          <span className="text-slate-500">Quantity</span>{" "}
          <span className="text-white font-medium">{qtyNum}</span>
        </p>
        <p>
          <span className="text-slate-500">Price</span>{" "}
          <span className="text-white font-medium">
            ${livePrice.toFixed(2)}
          </span>
        </p>
        <p>
          <span className="text-slate-500">Total</span>{" "}
          <span className="text-sky-300 font-semibold">
            ${total.toFixed(2)}
          </span>
        </p>
      </TradeConfirmModal>
    </AppShell>
  );
}
