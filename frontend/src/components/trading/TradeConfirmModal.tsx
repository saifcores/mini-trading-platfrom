import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useId } from "react";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  variant: "buy" | "sell";
  riskNote?: string;
};

export function TradeConfirmModal({
  open,
  title,
  children,
  onConfirm,
  onCancel,
  confirmLabel,
  variant,
  riskNote = "Trading involves risk of loss. Only invest what you can afford.",
}: Props) {
  const titleId = useId();
  const descId = useId();

  const confirmClass =
    variant === "buy"
      ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40"
      : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/40";

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="backdrop"
            type="button"
            aria-label="Close dialog"
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="fixed left-1/2 top-1/2 z-[101] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 glass-panel rounded-2xl p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 id={titleId} className="text-lg font-semibold text-white mb-1">
              {title}
            </h2>
            <p id={descId} className="text-xs text-slate-500 mb-4">
              {riskNote}
            </p>
            <div className="rounded-xl neu-inset bg-navy-900/80 p-4 mb-4 text-sm text-slate-300 space-y-2">
              {children}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors duration-200 ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
