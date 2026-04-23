/**
 * Offline / demo dataset for UI testing (no API). Hooks fall back to these when
 * the backend is off or the user is not authenticated for protected routes.
 */
export type Asset = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
};

export type PortfolioRow = {
  symbol: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  /** `PortfolioItemResponse` from API when present */
  marketValue?: number;
  unrealizedPnl?: number;
};

export type OrderRow = {
  id: string;
  date: string;
  asset: string;
  side: "BUY" | "SELL";
  status: "executed" | "pending" | "failed";
  amount: number;
  /** `OrderHistoryItemResponse.quantity` */
  quantity?: number;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  time: string;
};

/** Cash when API is off or unauthenticated. Keep in sync with `useWallet` initial state. */
export const DEMO_WALLET_BALANCE = 198_500;

/**
 * Suggested credentials for manual full-stack tests against a local backend
 * (create this user first via Register, or your own seed data).
 */
export const FAKE_DEMO_USER = {
  email: "qa.trader@local.test",
  password: "DemoPass123!",
} as const;

export const ASSETS: Asset[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 198.45, changePct: 1.12 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 425.1, changePct: 0.64 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 1125.5, changePct: 2.88 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 198.2, changePct: 0.95 },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc. Cl A",
    price: 198.05,
    changePct: -0.22,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 635.0,
    changePct: 1.45,
  },
  { symbol: "TSLA", name: "Tesla Inc.", price: 188.2, changePct: -1.8 },
  { symbol: "AVGO", name: "Broadcom Inc.", price: 185.0, changePct: 0.35 },
  { symbol: "JPM", name: "JPMorgan Chase", price: 202.3, changePct: 0.5 },
  { symbol: "V", name: "Visa Inc.", price: 285.4, changePct: -0.15 },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 158.9, changePct: 0.2 },
  { symbol: "XOM", name: "Exxon Mobil", price: 110.2, changePct: -0.9 },
  { symbol: "COIN", name: "Coinbase Global", price: 312.0, changePct: -2.1 },
  { symbol: "PLTR", name: "Palantir Tech.", price: 24.5, changePct: 3.1 },
  { symbol: "AMD", name: "Advanced Micro Dev.", price: 155.0, changePct: 1.4 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 990.0, changePct: 0.7 },
];

/**
 * Holdings used when `/api/portfolio` is not available. Includes optional
 * `marketValue` / `unrealizedPnl` to mirror API payloads in the PnL table.
 */
export const PORTFOLIO: PortfolioRow[] = [
  {
    symbol: "AAPL",
    qty: 18,
    avgPrice: 175.2,
    currentPrice: 198.45,
    marketValue: 3572.1,
    unrealizedPnl: 417.3,
  },
  {
    symbol: "MSFT",
    qty: 10,
    avgPrice: 380.0,
    currentPrice: 425.1,
    marketValue: 4251.0,
    unrealizedPnl: 451.0,
  },
  {
    symbol: "NVDA",
    qty: 6,
    avgPrice: 800.0,
    currentPrice: 1125.5,
  },
  {
    symbol: "AMZN",
    qty: 25,
    avgPrice: 150.0,
    currentPrice: 198.2,
    marketValue: 4955.0,
    unrealizedPnl: 1205.0,
  },
  {
    symbol: "TSLA",
    qty: 4,
    avgPrice: 255.0,
    currentPrice: 188.2,
  },
  {
    symbol: "GOOGL",
    qty: 8,
    avgPrice: 160.0,
    currentPrice: 198.05,
  },
  {
    symbol: "META",
    qty: 5,
    avgPrice: 450.0,
    currentPrice: 635.0,
  },
  {
    symbol: "V",
    qty: 12,
    avgPrice: 270.0,
    currentPrice: 285.4,
  },
];

/** Order log for offline Order History: mix of sides, sizes, and outcomes. */
export const ORDERS: OrderRow[] = [
  {
    id: "ord-1001",
    date: "2026-04-23 14:12",
    asset: "NVDA",
    side: "BUY",
    status: "executed",
    quantity: 2,
    amount: 2248.2,
  },
  {
    id: "ord-1002",
    date: "2026-04-23 10:45",
    asset: "AAPL",
    side: "SELL",
    status: "executed",
    quantity: 3,
    amount: 594.0,
  },
  {
    id: "ord-1003",
    date: "2026-04-22 16:20",
    asset: "META",
    side: "BUY",
    status: "pending",
    quantity: 1,
    amount: 635.0,
  },
  {
    id: "ord-1004",
    date: "2026-04-22 11:33",
    asset: "TSLA",
    side: "BUY",
    status: "failed",
    quantity: 10,
    amount: 1882.0,
  },
  {
    id: "ord-1005",
    date: "2026-04-22 09:15",
    asset: "AMZN",
    side: "BUY",
    status: "executed",
    quantity: 5,
    amount: 991.0,
  },
  {
    id: "ord-1006",
    date: "2026-04-21 15:50",
    asset: "PLTR",
    side: "BUY",
    status: "executed",
    quantity: 25,
    amount: 612.5,
  },
  {
    id: "ord-1007",
    date: "2026-04-21 12:10",
    asset: "MSFT",
    side: "BUY",
    status: "executed",
    quantity: 1,
    amount: 425.1,
  },
  {
    id: "ord-1008",
    date: "2026-04-20 11:00",
    asset: "JPM",
    side: "SELL",
    status: "executed",
    quantity: 8,
    amount: 1618.4,
  },
  {
    id: "ord-1009",
    date: "2026-04-20 10:20",
    asset: "GOOGL",
    side: "BUY",
    status: "executed",
    quantity: 2,
    amount: 396.1,
  },
  {
    id: "ord-1010",
    date: "2026-04-19 14:00",
    asset: "NFLX",
    side: "BUY",
    status: "pending",
    quantity: 1,
    amount: 990.0,
  },
  {
    id: "ord-1011",
    date: "2026-04-19 11:12",
    asset: "V",
    side: "BUY",
    status: "executed",
    quantity: 4,
    amount: 1141.6,
  },
  {
    id: "ord-1012",
    date: "2026-04-18 16:10",
    asset: "XOM",
    side: "SELL",
    status: "executed",
    quantity: 6,
    amount: 661.2,
  },
  {
    id: "ord-1013",
    date: "2026-04-18 10:00",
    asset: "AMD",
    side: "BUY",
    status: "executed",
    quantity: 4,
    amount: 620.0,
  },
  {
    id: "ord-1014",
    date: "2026-04-17 15:00",
    asset: "COIN",
    side: "SELL",
    status: "executed",
    quantity: 2,
    amount: 624.0,
  },
  {
    id: "ord-1015",
    date: "2026-04-17 10:00",
    asset: "JNJ",
    side: "BUY",
    status: "executed",
    quantity: 3,
    amount: 476.7,
  },
  {
    id: "ord-1016",
    date: "2026-04-16 14:30",
    asset: "AVGO",
    side: "BUY",
    status: "failed",
    quantity: 1,
    amount: 185.0,
  },
  {
    id: "ord-1017",
    date: "2026-04-16 12:00",
    asset: "AAPL",
    side: "BUY",
    status: "executed",
    quantity: 1,
    amount: 198.45,
  },
  {
    id: "ord-1018",
    date: "2026-04-15 11:00",
    asset: "TSLA",
    side: "SELL",
    status: "executed",
    quantity: 1,
    amount: 188.2,
  },
  {
    id: "ord-1019",
    date: "2026-04-15 09:00",
    asset: "AMZN",
    side: "BUY",
    status: "executed",
    quantity: 2,
    amount: 396.4,
  },
  {
    id: "ord-1020",
    date: "2026-04-14 16:00",
    asset: "MSFT",
    side: "SELL",
    status: "executed",
    quantity: 2,
    amount: 850.2,
  },
];

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Fed signals patience on cuts as inflation cools",
    source: "Reuters",
    time: "12m ago",
  },
  {
    id: "n2",
    title: "Tech earnings beat expectations; NVDA data-center demand strong",
    source: "Bloomberg",
    time: "28m ago",
  },
  {
    id: "n3",
    title: "Oil steadies ahead of U.S. inventory data",
    source: "WSJ",
    time: "1h ago",
  },
  {
    id: "n4",
    title: "Treasury yields edge lower as traders weigh labor report",
    source: "CNBC",
    time: "2h ago",
  },
  {
    id: "n5",
    title: "Semiconductor index hits 2026 high on AI capex outlook",
    source: "Financial Times",
    time: "3h ago",
  },
  {
    id: "n6",
    title: "Consumer discretionary leads sector rotation; retail sales firm",
    source: "Barron's",
    time: "4h ago",
  },
  {
    id: "n7",
    title: "Dollar drifts in thin holiday-adjacent trading",
    source: "MarketWatch",
    time: "5h ago",
  },
  {
    id: "n8",
    title: "Crypto exchange volumes up week-on-week, Coinbase in focus",
    source: "The Block",
    time: "6h ago",
  },
];

export function portfolioTotalValue(rows: PortfolioRow[]): number {
  return rows.reduce(
    (s, r) => s + (r.marketValue ?? r.qty * r.currentPrice),
    0,
  );
}

function portfolioSparkline(): { t: number; v: number }[] {
  const base = 48_200;
  return Array.from({ length: 40 }, (_, i) => {
    const wave = Math.sin(i / 3) * 1200;
    const trend = i * 78;
    const micro = (i * 17 + i * i) % 550;
    return { t: i, v: base + wave + trend + micro };
  });
}

const PORTFOLIO_CHART_START = 1_700_000_000;

export function portfolioChartSeries(): { time: number; value: number }[] {
  const pts = portfolioSparkline();
  return pts.map((p, i) => ({
    time: PORTFOLIO_CHART_START + i * 86_400,
    value: p.v,
  }));
}
