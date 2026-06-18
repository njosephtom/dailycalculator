import React from "react";

const ACCENT = {
  indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300",
  emerald: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
  slate: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
  rose: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300",
};

export default function ResultCard({ label, value, accent = "slate", sublabel }) {
  return (
    <div className={`rounded-xl border p-4 ${ACCENT[accent] ?? ACCENT.slate}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{label}</p>
      <p className="text-2xl font-bold mt-1 break-all">{value ?? "—"}</p>
      {sublabel && <p className="text-xs mt-1 opacity-60">{sublabel}</p>}
    </div>
  );
}
