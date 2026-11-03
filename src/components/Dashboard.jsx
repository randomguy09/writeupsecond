import { useMemo, useState } from "react";
import WriteupCard from "./WriteupCard";
import { PlusFileIcon } from "./Icons";

export default function Dashboard({ writeups, loading, onNew, onOpen }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return writeups;
    const q = query.toLowerCase();
    return writeups.filter((w) =>
      [w.ctfName, w.challengeName, w.category, w.summary]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q))
    );
  }, [writeups, query]);

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-case-border bg-case-950/80 px-8 py-6 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-emerald-400/80">
              case_files --list
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-100">Dashboard</h1>
          </div>
          <button
            onClick={onNew}
            className="flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 font-mono text-sm font-semibold text-case-950 transition-all hover:bg-emerald-400 hover:shadow-glow"
          >
            <PlusFileIcon className="h-4 w-4" />
            New Case File
          </button>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="grep writeups --name --category…"
          className="mt-4 w-full max-w-md rounded-md border border-case-border bg-case-900 px-3 py-2 font-mono text-sm text-slate-300 outline-none placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
        />
      </header>

      <main className="px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-lg border border-case-border bg-case-900/40"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-case-border py-24 text-center">
            <p className="font-mono text-sm text-slate-500">
              {writeups.length === 0
                ? "// no case files on record yet"
                : "// no matches for that query"}
            </p>
            {writeups.length === 0 && (
              <button
                onClick={onNew}
                className="mt-4 rounded-md border border-emerald-500/40 px-4 py-2 font-mono text-sm text-emerald-300 hover:bg-emerald-400/10"
              >
                open first case file
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((w) => (
              <WriteupCard key={w.id} writeup={w} onOpen={onOpen} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
