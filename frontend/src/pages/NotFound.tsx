import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { GlassCard } from "../components/ui/GlassCard";

export function NotFound() {
  return (
    <AppShell>
      <div className="flex min-h-[50vh] items-center justify-center">
        <GlassCard className="max-w-md w-full text-center" hover={false}>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">
            404
          </p>
          <h1 className="text-xl font-semibold text-white mb-2">
            Page not found
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            This route does not exist. Head back to your workspace.
          </p>
          <Link
            to="/"
            className="inline-flex rounded-xl gradient-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-opacity hover:opacity-95"
          >
            Back to dashboard
          </Link>
        </GlassCard>
      </div>
    </AppShell>
  );
}
