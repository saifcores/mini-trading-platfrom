import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "./GlassCard";

type Props = {
  title: string;
  description: string;
  action?: { to: string; label: string };
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, icon }: Props) {
  return (
    <GlassCard className="text-center py-12 px-6">
      {icon && (
        <div className="text-3xl text-slate-600 mb-4" aria-hidden>
          {icon}
        </div>
      )}
      <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </GlassCard>
  );
}
