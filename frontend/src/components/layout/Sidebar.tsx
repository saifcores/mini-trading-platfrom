import { useEffect, useState } from "react";
import { getAuthEmail } from "../../api/auth";
import { isApiConfigured } from "../../lib/env";
import { PrefetchNavLink } from "./PrefetchNavLink";

const links = [
  { to: "/", label: "Dashboard", icon: "◆" },
  { to: "/market", label: "Markets", icon: "▤" },
  { to: "/trade", label: "Trade", icon: "◇" },
  { to: "/portfolio", label: "Portfolio", icon: "▣" },
  { to: "/orders", label: "Orders", icon: "☰" },
  { to: "/profile", label: "Profile", icon: "◎" },
] as const;

export function Sidebar() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(() =>
    isApiConfigured() ? getAuthEmail() : null,
  );

  useEffect(() => {
    if (!isApiConfigured()) return;
    const sync = () => setSessionEmail(getAuthEmail());
    sync();
    window.addEventListener("auth-changed", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/[0.06] glass-panel rounded-none border-t-0 border-b-0 border-l-0">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-sky-500/20">
            AT
          </div>
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">
              Apex Trade
            </p>
            <p className="text-[11px] text-slate-500">
              {sessionEmail ? sessionEmail : "Premium · Live"}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <PrefetchNavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`
            }
          >
            <span className="text-base opacity-80">{l.icon}</span>
            {l.label}
          </PrefetchNavLink>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-white/[0.06]">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
          Status
        </p>
        <p className="text-xs text-slate-500 leading-snug">
          {isApiConfigured()
            ? "API mode — see status bar in main"
            : "Mock mode — no network"}
        </p>
      </div>
    </aside>
  );
}
