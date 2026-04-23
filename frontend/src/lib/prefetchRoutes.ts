/**
 * Warms the Vite chunk cache before navigation. Safe to call repeatedly.
 */
export function prefetchRoute(pathname: string) {
  switch (pathname) {
    case "/":
      return import("../pages/Dashboard");
    case "/market":
      return import("../pages/Market");
    case "/trade":
      return import("../pages/Trading");
    case "/portfolio":
      return import("../pages/Portfolio");
    case "/orders":
      return import("../pages/OrderHistory");
    case "/profile":
      return import("../pages/Profile");
    default:
      return Promise.resolve();
  }
}
