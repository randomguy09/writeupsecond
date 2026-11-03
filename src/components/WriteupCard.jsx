import { DifficultyBadge, CategoryBadge } from "./Badges";

function formatDate(ts) {
  if (!ts) return "pending…";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function WriteupCard({ writeup, onOpen }) {
  return (
    <button
      onClick={() => onOpen?.(writeup)}
      className="group flex flex-col rounded-lg border border-case-border bg-case-900/60 p-5 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-glow"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] uppercase tracking-wide text-slate-500">
            {writeup.ctfName || "Unnamed CTF"}
          </p>
          <h3 className="mt-0.5 truncate text-[15px] font-semibold text-slate-100 group-hover:text-emerald-300">
            {writeup.challengeName || "Untitled Challenge"}
          </h3>
        </div>
        <DifficultyBadge difficulty={writeup.difficulty} />
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-400">
        {writeup.summary || "No summary provided for this case file."}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-case-border pt-3">
        <CategoryBadge category={writeup.category} />
        <span className="font-mono text-[11px] text-slate-600">
          {formatDate(writeup.createdAt)}
        </span>
      </div>
    </button>
  );
}
