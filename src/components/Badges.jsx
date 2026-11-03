export const DIFFICULTY_STYLES = {
  Textbook: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  Easy: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  Hard: "bg-rose-500/10 text-rose-300 border-rose-500/30",
};

export const CATEGORY_STYLES = {
  Pwn: "bg-red-500/10 text-red-300 border-red-500/30",
  Web: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  Crypto: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  Rev: "bg-orange-500/10 text-orange-300 border-orange-500/30",
  Forensics: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  OSINT: "bg-teal-500/10 text-teal-300 border-teal-500/30",
};

function Badge({ label, styles }) {
  const cls = styles[label] || "bg-slate-500/10 text-slate-300 border-slate-500/30";
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono tracking-tight ${cls}`}
    >
      {label}
    </span>
  );
}

export function DifficultyBadge({ difficulty }) {
  return <Badge label={difficulty} styles={DIFFICULTY_STYLES} />;
}

export function CategoryBadge({ category }) {
  return <Badge label={category} styles={CATEGORY_STYLES} />;
}
