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
};

export type OrderRow = {
  id: string;
  date: string;
  asset: string;
  side: "BUY" | "SELL";
  status: "executed" | "pending" | "failed";
  amount: number;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  time: string;
};

export const ASSETS: Asset[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.42, changePct: 1.24 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.91, changePct: -0.82 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 892.15, changePct: 3.41 },
  { symbol: "MSFT", name: "Microsoft", price: 415.22, changePct: 0.55 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 168.3, changePct: -0.12 },
  { symbol: "AMZN", name: "Amazon", price: 182.44, changePct: 1.02 },
  { symbol: "META", name: "Meta Platforms", price: 501.18, changePct: 2.18 },
  { symbol: "COIN", name: "Coinbase", price: 256.7, changePct: -1.95 },
];

export const PORTFOLIO: PortfolioRow[] = [
  { symbol: "AAPL", qty: 12, avgPrice: 172.5, currentPrice: 189.42 },
  { symbol: "NVDA", qty: 4, avgPrice: 720.0, currentPrice: 892.15 },
  { symbol: "MSFT", qty: 6, avgPrice: 390.1, currentPrice: 415.22 },
  { symbol: "TSLA", qty: 3, avgPrice: 265.0, currentPrice: 248.91 },
];

export const ORDERS: OrderRow[] = [
  {
    id: "1",
    date: "2026-04-20 09:41",
    asset: "NVDA",
    side: "BUY",
    status: "executed",
    amount: 892.15,
  },
  {
    id: "2",
    date: "2026-04-19 15:22",
    asset: "AAPL",
    side: "SELL",
    status: "pending",
    amount: 189.42,
  },
  {
    id: "3",
    date: "2026-04-18 11:05",
    asset: "TSLA",
    side: "BUY",
    status: "failed",
    amount: 248.91,
  },
  {
    id: "4",
    date: "2026-04-17 10:12",
    asset: "MSFT",
    side: "BUY",
    status: "executed",
    amount: 415.22,
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
    title: "Tech earnings beat expectations; NVDA guidance strong",
    source: "Bloomberg",
    time: "38m ago",
  },
  {
    id: "n3",
    title: "Oil steadies ahead of inventory data",
    source: "WSJ",
    time: "1h ago",
  },
];

export function portfolioTotalValue(rows: PortfolioRow[]): number {
  return rows.reduce((s, r) => s + r.qty * r.currentPrice, 0);
}

export function portfolioSparkline(): { t: number; v: number }[] {
  const base = 42000;
  return Array.from({ length: 32 }, (_, i) => ({
    t: i,
    v: base + Math.sin(i / 4) * 800 + i * 120 + Math.random() * 200,
  }));
}

/** Stable timestamps for portfolio area chart (avoids impure Date in render). */
const PORTFOLIO_CHART_START = 1_700_000_000;

export function portfolioChartSeries(): { time: number; value: number }[] {
  const pts = portfolioSparkline();
  return pts.map((p, i) => ({
    time: PORTFOLIO_CHART_START + i * 86400,
    value: p.v,
  }));
}
