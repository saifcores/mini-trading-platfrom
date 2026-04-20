import { useCallback, useMemo, useState } from "react";
import { getAuthEmail, login, logout, registerAndSignIn } from "../api/auth";
import { AppShell } from "../components/layout/AppShell";
import { GlassCard } from "../components/ui/GlassCard";
import { getAuthToken } from "../lib/api/client";
import { isApiConfigured } from "../lib/env";

export function Profile() {
  const [twoFa, setTwoFa] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(() =>
    getAuthToken() ? getAuthEmail() : null,
  );

  const apiOn = useMemo(() => isApiConfigured(), []);

  const refreshSessionLabel = useCallback(() => {
    setSessionEmail(getAuthToken() ? getAuthEmail() : null);
  }, []);

  const handleLogin = useCallback(async () => {
    setAuthError(null);
    setAuthBusy(true);
    try {
      const res = await login({
        email: authEmail.trim(),
        password: authPassword,
      });
      setSessionEmail(res.email);
      setAuthPassword("");
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setAuthBusy(false);
    }
  }, [authEmail, authPassword]);

  const handleRegister = useCallback(async () => {
    setAuthError(null);
    setAuthBusy(true);
    try {
      const res = await registerAndSignIn({
        email: authEmail.trim(),
        password: authPassword,
      });
      setSessionEmail(res.email);
      setAuthPassword("");
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setAuthBusy(false);
    }
  }, [authEmail, authPassword]);

  const handleLogout = useCallback(() => {
    logout();
    setSessionEmail(null);
    refreshSessionLabel();
  }, [refreshSessionLabel]);

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-sky-400/80 mb-1">
            Account
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Profile & settings
          </h1>
        </div>

        <GlassCard>
          <h2 className="text-sm font-semibold text-white mb-4">User</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl gradient-accent flex items-center justify-center text-lg font-bold text-white shadow-lg">
              JD
            </div>
            <div>
              <p className="font-semibold text-white">Jordan Doe</p>
              <p className="text-sm text-slate-500">
                {apiOn && sessionEmail ? sessionEmail : "jordan.doe@email.com"}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-slate-500">Display name</span>
              <input
                defaultValue="Jordan Doe"
                className="mt-1 w-full rounded-xl border border-white/10 bg-navy-900/80 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Timezone</span>
              <select className="mt-1 w-full rounded-xl border border-white/10 bg-navy-900/80 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40">
                <option>UTC−05:00 Eastern</option>
                <option>UTC+00:00 London</option>
                <option>UTC+01:00 Paris</option>
              </select>
            </label>
          </div>
        </GlassCard>

        {apiOn && (
          <GlassCard>
            <h2 className="text-sm font-semibold text-white mb-1">
              Backend API
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Sign in to the Spring Boot server for live portfolio, orders, and
              trades. Password must be at least 8 characters.
            </p>
            {sessionEmail && (
              <div className="flex items-center justify-between gap-3 mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
                <p className="text-sm text-emerald-100">
                  JWT stored for this browser.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-medium text-emerald-300 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <label className="block sm:col-span-2">
                <span className="text-xs text-slate-500">Email</span>
                <input
                  type="email"
                  autoComplete="username"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-navy-900/80 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs text-slate-500">Password</span>
                <input
                  type="password"
                  autoComplete={
                    sessionEmail ? "new-password" : "current-password"
                  }
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-navy-900/80 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </label>
            </div>
            {authError && (
              <p className="text-xs text-red-400 mb-3 break-words">
                {authError}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={authBusy}
                onClick={() => void handleLogin()}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
              >
                {authBusy ? "…" : "Log in"}
              </button>
              <button
                type="button"
                disabled={authBusy}
                onClick={() => void handleRegister()}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/[0.05] disabled:opacity-50"
              >
                Register
              </button>
            </div>
          </GlassCard>
        )}

        <GlassCard>
          <h2 className="text-sm font-semibold text-white mb-1">Security</h2>
          <p className="text-xs text-slate-500 mb-4">
            Protect your account with layered verification.
          </p>
          <div className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.06]">
            <div>
              <p className="font-medium text-white">
                Two-factor authentication
              </p>
              <p className="text-xs text-slate-500">Authenticator app or SMS</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFa}
              onClick={() => setTwoFa(!twoFa)}
              className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${
                twoFa ? "bg-sky-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  twoFa ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
          <div className="py-3">
            <p className="text-xs text-slate-500 mb-2">Recovery codes</p>
            <button
              type="button"
              className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
            >
              Generate new codes
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-white mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-sm text-slate-300">Email summaries</span>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={() => setEmailNotif(!emailNotif)}
                className="h-4 w-4 rounded border-white/20 bg-navy-900 text-sky-500 focus:ring-sky-500/40"
              />
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-sm text-slate-300">Push price alerts</span>
              <input
                type="checkbox"
                checked={pushNotif}
                onChange={() => setPushNotif(!pushNotif)}
                className="h-4 w-4 rounded border-white/20 bg-navy-900 text-sky-500 focus:ring-sky-500/40"
              />
            </label>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-white mb-2">Preferences</h2>
          <p className="text-xs text-slate-500 mb-4">
            Default order behavior (demo).
          </p>
          <label className="block max-w-xs">
            <span className="text-xs text-slate-500">Default order type</span>
            <select className="mt-1 w-full rounded-xl border border-white/10 bg-navy-900/80 px-3 py-2.5 text-sm text-white">
              <option>Market</option>
              <option>Limit</option>
              <option>Stop</option>
            </select>
          </label>
        </GlassCard>
      </div>
    </AppShell>
  );
}
