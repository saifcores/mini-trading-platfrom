import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState, type ReactNode } from "react";
import {
  type ToastVariant,
  ToastContext,
  type ShowToast,
} from "./toast-context";

const variantStyles: Record<ToastVariant, string> = {
  success:
    "border-emerald-500/35 bg-emerald-500/10 text-emerald-100 shadow-emerald-900/20",
  error: "border-red-500/35 bg-red-500/10 text-red-100 shadow-red-900/20",
  info: "border-sky-500/35 bg-sky-500/10 text-sky-100 shadow-sky-900/20",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<
    { id: number; message: string; variant: ToastVariant }[]
  >([]);

  const showToast: ShowToast = useCallback((message, variant = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 5200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className="fixed bottom-24 lg:bottom-8 right-4 z-[150] flex flex-col gap-2 max-w-sm w-[min(100%,calc(100vw-2rem))] pointer-events-none"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm backdrop-blur-xl shadow-lg ${variantStyles[t.variant]}`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
