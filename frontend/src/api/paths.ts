/**
 * REST paths aligned with Spring controllers under `presentation.controller`.
 * Keep in sync with backend `@RequestMapping` + `@GetMapping` / `@PostMapping`.
 */
export const API_PATHS = {
  authRegister: "/api/auth/register",
  authLogin: "/api/auth/login",
  marketStocks: "/api/market/stocks",
  portfolio: "/api/portfolio",
  orders: "/api/orders",
  wallet: "/api/wallet",
  trades: "/api/trades",
} as const;
