import { apiFetch } from "../lib/api/client";
import { num } from "../lib/jsonNumbers";
import type { Asset, OrderRow, PortfolioRow } from "./types";
import { API_PATHS } from "./paths";

/** Dispatched on `window` after a successful API trade so lists can re-sync. */
export const TRADING_UPDATED_EVENT = "trading-updated";

/**
 * JSON shapes mirror backend `application.dto` records (Jackson camelCase).
 * Enums: `OrderSide` → "BUY" | "SELL"; `OrderStatus` → PENDING | EXECUTED | FAILED.
 */

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

function mapStockToAsset(s: StockResponse): Asset {
  return {
    symbol: s.symbol,
    name: s.name,
    price: num(s.price),
    changePct: num(s.changePct),
  };
}

function mapPortfolioItem(p: PortfolioItemResponse): PortfolioRow {
  const row: PortfolioRow = {
    symbol: p.symbol,
    qty: Math.trunc(num(p.quantity)) || 0,
    avgPrice: num(p.averagePrice),
    currentPrice: num(p.currentPrice),
  };
  if (p.marketValue != null && Number.isFinite(num(p.marketValue))) {
    row.marketValue = num(p.marketValue);
  }
  if (p.unrealizedPnl != null && Number.isFinite(num(p.unrealizedPnl))) {
    row.unrealizedPnl = num(p.unrealizedPnl);
  }
  return row;
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
  const q = Math.trunc(num(o.quantity));
  return {
    id: String(o.id),
    date: formatOrderDate(o.createdAt),
    asset: o.symbol,
    side: o.side,
    status: STATUS_MAP[o.status] ?? "pending",
    quantity: Number.isFinite(q) && q > 0 ? q : undefined,
    amount:
      o.totalAmount != null && Number.isFinite(num(o.totalAmount))
        ? num(o.totalAmount)
        : 0,
  };
}

function mapTradeResponse(raw: TradeResponseBody): TradeResponseBody {
  const oid = num(raw.orderId);
  const qty = Math.trunc(num(raw.quantity));
  return {
    orderId: Number.isFinite(oid) ? oid : 0,
    symbol: raw.symbol,
    side: raw.side,
    quantity: Number.isFinite(qty) && qty > 0 ? qty : 0,
    status: raw.status,
    unitPrice:
      raw.unitPrice == null || !Number.isFinite(num(raw.unitPrice))
        ? null
        : num(raw.unitPrice),
    totalAmount:
      raw.totalAmount == null || !Number.isFinite(num(raw.totalAmount))
        ? null
        : num(raw.totalAmount),
    failureReason: raw.failureReason ?? null,
    createdAt: raw.createdAt,
  };
}

/** GET /api/market/stocks — `MarketController` */
export function fetchAssets(): Promise<Asset[]> {
  return apiFetch<StockResponse[]>(API_PATHS.marketStocks).then((rows) =>
    rows.map(mapStockToAsset),
  );
}

/** GET /api/portfolio — `PortfolioController` */
export function fetchPortfolio(): Promise<PortfolioRow[]> {
  return apiFetch<PortfolioItemResponse[]>(API_PATHS.portfolio).then((rows) =>
    rows.map(mapPortfolioItem),
  );
}

/** GET /api/orders — `OrderController` */
export function fetchOrders(): Promise<OrderRow[]> {
  return apiFetch<OrderHistoryItemResponse[]>(API_PATHS.orders).then((rows) =>
    rows.map(mapOrder),
  );
}

/** GET /api/wallet — `WalletController`, `WalletResponse` */
export function fetchWallet(): Promise<WalletResponse> {
  return apiFetch<WalletResponse>(API_PATHS.wallet).then((w) => ({
    walletId: num(w.walletId),
    balance: num(w.balance),
  }));
}

/** POST /api/trades — `TradeController`, `TradeRequest` / `TradeResponse` */
export function placeTrade(body: TradeRequestBody): Promise<TradeResponseBody> {
  return apiFetch<TradeResponseBody>(API_PATHS.trades, {
    method: "POST",
    body: JSON.stringify(body),
  }).then(mapTradeResponse);
}
