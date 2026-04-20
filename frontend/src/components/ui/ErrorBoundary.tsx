import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message || "Something went wrong." };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", err, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-svh flex items-center justify-center p-6 bg-navy-950">
          <div className="glass-panel rounded-2xl p-8 max-w-md text-center space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-red-400/90">
              Runtime error
            </p>
            <h1 className="text-lg font-semibold text-white">We hit a snag</h1>
            <p className="text-sm text-slate-400 leading-relaxed wrap-break-word">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-white/8 border border-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/12 transition-colors duration-200"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
