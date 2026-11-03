import { useState } from "react";
import { TerminalIcon } from "./Icons";

export default function AuthGate({ auth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await auth.loginEmail(email, password);
      } else {
        await auth.registerEmail(email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setBusy(false);
    }
  }

  async function handleAnon() {
    setError("");
    setBusy(true);
    try {
      await auth.loginAnon();
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-case-950 bg-scanlines px-4">
      <div className="w-full max-w-sm rounded-lg border border-case-border bg-case-900/90 p-7 shadow-glow backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <TerminalIcon className="h-6 w-6 text-emerald-400" />
          <h1 className="font-mono text-lg font-semibold text-slate-100">
            0x<span className="text-emerald-400">Writeups</span>
          </h1>
        </div>
        <p className="mb-6 font-mono text-xs text-slate-500">
          // authenticate to access case files
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-slate-500">
              email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-case-border bg-case-850 px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              placeholder="operator@domain.io"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-slate-500">
              password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-case-border bg-case-850 px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-mono text-xs text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-emerald-500 px-3 py-2.5 font-mono text-sm font-semibold text-case-950 transition-all hover:bg-emerald-400 hover:shadow-glow disabled:opacity-50"
          >
            {mode === "login" ? "sign in" : "create account"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-case-border" />
          <span className="font-mono text-[10px] text-slate-600">or</span>
          <div className="h-px flex-1 bg-case-border" />
        </div>

        <button
          onClick={handleAnon}
          disabled={busy}
          className="w-full rounded-md border border-case-border px-3 py-2.5 font-mono text-sm text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-50"
        >
          continue as anonymous
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-center font-mono text-xs text-slate-500 hover:text-slate-300"
        >
          {mode === "login" ? "need an account? register" : "have an account? sign in"}
        </button>
      </div>
    </div>
  );
}
