import { TerminalIcon, GridIcon, PlusFileIcon, LogoutIcon } from "./Icons";

export default function Sidebar({ view, setView, user, onLogout }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: GridIcon },
    { key: "editor", label: "New Case File", icon: PlusFileIcon },
  ];

  const uid = user?.id ? `${user.id.slice(0, 10)}…` : "—";
  const identity = user?.email || user?.name || "unknown";

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-case-border bg-case-900/80 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-case-border px-5 py-5">
        <TerminalIcon className="h-5 w-5 text-emerald-400" />
        <span className="font-mono text-[15px] font-semibold tracking-tight text-slate-100">
          0x<span className="text-emerald-400">Writeups</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map(({ key, label, icon: Icon }) => {
          const active = view === key;
          return (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-all ${
                active
                  ? "bg-emerald-400/10 text-emerald-300 shadow-glow-sm"
                  : "text-slate-400 hover:bg-case-800 hover:text-slate-200"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`}
              />
              <span className="font-mono">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-case-border px-4 py-4">
        <div className="mb-3 flex items-center gap-2 rounded-md border border-case-border bg-case-850 px-3 py-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-slate-300">{identity}</p>
            <p className="truncate font-mono text-[10px] text-slate-500">uid:{uid}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-mono text-xs text-slate-500 transition-colors hover:bg-case-800 hover:text-rose-300"
        >
          <LogoutIcon className="h-3.5 w-3.5" />
          end session
        </button>
      </div>
    </aside>
  );
}
