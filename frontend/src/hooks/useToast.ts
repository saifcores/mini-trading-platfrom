import { useContext } from "react";
import { ToastContext, type ShowToast } from "../components/ui/toast-context";

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
