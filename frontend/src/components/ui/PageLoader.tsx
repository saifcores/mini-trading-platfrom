export function PageLoader() {
  return (
    <div
      className="min-h-[min(60vh,480px)] flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.08]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-violet-500/60 animate-spin" />
        </div>
        <p className="text-sm text-slate-500 tracking-wide">
          Loading workspace…
        </p>
      </div>
    </div>
  );
}
