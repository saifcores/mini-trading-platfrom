import { createContext } from "react";

export type ToastVariant = "success" | "error" | "info";

export type ShowToast = (message: string, variant?: ToastVariant) => void;

export const ToastContext = createContext<ShowToast | null>(null);
