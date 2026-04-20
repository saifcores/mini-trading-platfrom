import { apiFetch } from "../lib/api/client";
import type { Asset, OrderRow, PortfolioRow } from "./types";

/** Spring Boot JSON shapes (camelCase via Jackson) */

type StockResponse = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  lastUpdated?: string;
};

type PortfolioItemResponse = {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue?: number;
  unrealizedPnl?: number;
};

type OrderHistoryItemResponse = {
  id: number;
  createdAt: string;
  symbol: string;
  side: "BUY" | "SELL";
  status: "EXECUTED" | "PENDING" | "FAILED";
  quantity: number;
  totalAmount: number | null;
};

export type WalletResponse = {
  walletId: number;
  balance: number;
};

export type TradeRequestBody = {
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
};

export type TradeResponseBody = {
  orderId: number;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  status: "PENDING" | "EXECUTED" | "FAILED";
  unitPrice: number | null;
  totalAmount: number | null;
  failureReason: string | null;
  createdAt: string;
};

/** Normalize Jackson numbers (sometimes serialized as strings). */
function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return Number.NaN;
}

function mapStockToAsset(s: StockResponse): Asset {
  return {
    symbol: s.symbol,
    name: s.name,
    price: num(s.price),
    changePct: num(s.changePct),
  };
}

function mapPortfolioItem(p: PortfolioItemResponse): PortfolioRow {
  return {
    symbol: p.symbol,
    qty: p.quantity,
    avgPrice: num(p.averagePrice),
    currentPrice: num(p.currentPrice),
  };
}

const STATUS_MAP: Record<
  OrderHistoryItemResponse["status"],
  OrderRow["status"]
> = {
  EXECUTED: "executed",
  PENDING: "pending",
  FAILED: "failed",
};

function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapOrder(o: OrderHistoryItemResponse): OrderRow {
  return {
    id: String(o.id),
    date: formatOrderDate(o.createdAt),
    asset: o.symbol,
    side: o.side,
    status: STATUS_MAP[o.status] ?? "pending",
    amount:
      o.totalAmount != null && Number.isFinite(num(o.totalAmount))
        ? num(o.totalAmount)
        : 0,
  };
}

/** GET /api/market/stocks (public) */
export function fetchAssets(): Promise<Asset[]> {
  return apiFetch<StockResponse[]>("/api/market/stocks").then((rows) =>
    rows.map(mapStockToAsset),
  );
}

/** GET /api/portfolio (Bearer) */
export function fetchPortfolio(): Promise<PortfolioRow[]> {
  return apiFetch<PortfolioItemResponse[]>("/api/portfolio").then((rows) =>
    rows.map(mapPortfolioItem),
  );
}

/** GET /api/orders (Bearer) */
export function fetchOrders(): Promise<OrderRow[]> {
  return apiFetch<OrderHistoryItemResponse[]>("/api/orders").then((rows) =>
    rows.map(mapOrder),
  );
}

/** GET /api/wallet (Bearer) */
export function fetchWallet(): Promise<WalletResponse> {
  return apiFetch<WalletResponse>("/api/wallet");
}

/** POST /api/trades (Bearer) */
export function placeTrade(body: TradeRequestBody): Promise<TradeResponseBody> {
  return apiFetch<TradeResponseBody>("/api/trades", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
