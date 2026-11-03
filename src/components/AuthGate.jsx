import { useState } from "react";
import { AuthError, MissingIdentityError } from "@netlify/identity";
import { TerminalIcon } from "./Icons";

export default function AuthGate({ auth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(auth.notice || "");
  const [busy, setBusy] = useState(false);

  function describe(err) {
    if (err instanceof MissingIdentityError) {
      return "Authentication is not enabled for this site yet.";
    }
    if (err instanceof AuthError) {
      if (mode === "login" && /confirm/i.test(err.message || "")) {
        return "Please confirm your email before signing in.";
      }
      if (mode === "login" && (err.status === 400 || err.status === 401)) {
        return "Invalid email or password.";
      }
      if (err.status === 403) return "Sign-ups are closed. Ask the site owner for an invite.";
      if (err.status === 422) return err.message || "Check your email and password (min 6 characters).";
      return err.message;
    }
    return err?.message || "Something went wrong.";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "login") {
        await auth.loginEmail(email, password);
      } else {
        const { needsConfirmation } = await auth.registerEmail(email, password);
        if (needsConfirmation) {
          setInfo("Check your inbox and click the confirmation link, then sign in.");
          setMode("login");
          setPassword("");
        }
      }
    } catch (err) {
      setError(describe(err));
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-case-border bg-case-850 px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              placeholder="••••••••"
            />
          </div>

          {info && (
            <p className="rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-mono text-xs text-emerald-300">
              {info}
            </p>
          )}

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

        <button
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
          className="mt-5 w-full text-center font-mono text-xs text-slate-500 hover:text-slate-300"
        >
          {mode === "login" ? "need an account? register" : "have an account? sign in"}
        </button>
      </div>
    </div>
  );
}
