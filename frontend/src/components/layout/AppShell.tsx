import type { ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

type Props = {
  children: ReactNode;
  /** Wider max width for dense trading UI */
  wide?: boolean;
};

export function AppShell({ children, wide = false }: Props) {
  return (
    <div className="flex min-h-svh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-200 focus:rounded-lg focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        Skip to main content
      </a>
      <Sidebar />
      <div
        className={`flex-1 min-w-0 flex flex-col pb-20 lg:pb-6 ${
          wide ? "" : "max-w-[1600px] mx-auto w-full"
        }`}
      >
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/6 glass-panel rounded-none">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center text-white text-xs font-bold">
              AT
            </div>
            <span className="font-semibold text-white text-sm">Apex Trade</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Live</span>
        </header>
        <main
          id="main-content"
          className={`flex-1 px-4 lg:px-8 py-4 lg:py-6 ${wide ? "w-full" : ""}`}
        >
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
