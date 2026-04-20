import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { GlassCard } from "../components/ui/GlassCard";

export function Profile() {
  const [twoFa, setTwoFa] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

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
              <p className="text-sm text-slate-500">jordan.doe@email.com</p>
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
