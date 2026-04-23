import { PrefetchNavLink } from "./PrefetchNavLink";

const items = [
  { to: "/", label: "Home", icon: "◆" },
  { to: "/market", label: "Mkt", icon: "▤" },
  { to: "/trade", label: "Trade", icon: "◇" },
  { to: "/portfolio", label: "Port.", icon: "▣" },
  { to: "/orders", label: "Ord.", icon: "☰" },
  { to: "/profile", label: "You", icon: "◎" },
] as const;

export function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass-panel border-t border-white/[0.08] rounded-none px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Primary"
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {items.map((item) => (
          <PrefetchNavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 min-w-[3.25rem] py-1 rounded-lg transition-colors duration-200 ${
                isActive ? "text-sky-400" : "text-slate-500"
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </PrefetchNavLink>
        ))}
      </div>
    </nav>
  );
}
