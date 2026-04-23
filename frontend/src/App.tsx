import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { PageLoader } from "./components/ui/PageLoader";

const Dashboard = lazy(async () => {
  const m = await import("./pages/Dashboard");
  return { default: m.Dashboard };
});
const Trading = lazy(async () => {
  const m = await import("./pages/Trading");
  return { default: m.Trading };
});
const Portfolio = lazy(async () => {
  const m = await import("./pages/Portfolio");
  return { default: m.Portfolio };
});
const OrderHistory = lazy(async () => {
  const m = await import("./pages/OrderHistory");
  return { default: m.OrderHistory };
});
const Profile = lazy(async () => {
  const m = await import("./pages/Profile");
  return { default: m.Profile };
});
const Market = lazy(async () => {
  const m = await import("./pages/Market");
  return { default: m.Market };
});
const AssetDetail = lazy(async () => {
  const m = await import("./pages/AssetDetail");
  return { default: m.AssetDetail };
});
const NotFound = lazy(async () => {
  const m = await import("./pages/NotFound");
  return { default: m.NotFound };
});

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/market" element={<Market />} />
            <Route path="/symbol/:symbol" element={<AssetDetail />} />
            <Route path="/trade" element={<Trading />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
