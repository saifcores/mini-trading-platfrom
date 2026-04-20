import { apiFetch } from "../lib/api/client";
import type { Asset, OrderRow, PortfolioRow } from "./types";

/**
 * Expected REST shape (adjust when your backend is ready):
 * - GET {base}/v1/assets
 * - GET {base}/v1/portfolio
 * - GET {base}/v1/orders
 */
export function fetchAssets(): Promise<Asset[]> {
  return apiFetch<Asset[]>("/v1/assets");
}

export function fetchPortfolio(): Promise<PortfolioRow[]> {
  return apiFetch<PortfolioRow[]>("/v1/portfolio");
}

export function fetchOrders(): Promise<OrderRow[]> {
  return apiFetch<OrderRow[]>("/v1/orders");
}
