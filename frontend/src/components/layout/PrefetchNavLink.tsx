import { NavLink, type NavLinkProps } from "react-router-dom";
import { prefetchRoute } from "../../lib/prefetchRoutes";

function toPathname(to: NavLinkProps["to"]): string | null {
  if (typeof to === "string") return to;
  if (
    to &&
    typeof to === "object" &&
    "pathname" in to &&
    typeof to.pathname === "string"
  ) {
    return to.pathname;
  }
  return null;
}

export function PrefetchNavLink({
  onMouseEnter,
  onFocus,
  to,
  ...rest
}: NavLinkProps) {
  const runPrefetch = () => {
    const p = toPathname(to);
    if (p) void prefetchRoute(p);
  };

  return (
    <NavLink
      {...rest}
      to={to}
      onMouseEnter={(e) => {
        runPrefetch();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        runPrefetch();
        onFocus?.(e);
      }}
    />
  );
}
