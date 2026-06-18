import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { ChevronDown, ChevronUp } from "lucide-react";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button className="w-full flex items-center justify-between py-3 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors" onClick={() => setOpen(v => !v)}>
        <span>{q}</span>
        {open ? <ChevronUp size={14} className="shrink-0 ml-2 text-slate-400" /> : <ChevronDown size={14} className="shrink-0 ml-2 text-slate-400" />}
      </button>
      {open && <p className="pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>}
    </div>
  );
}

const FAQS = [
  { q: "What is percentage change?", a: "Percentage change measures the relative difference between an initial value and a final value, expressed as a percentage of the initial value. A positive result means an increase; a negative result means a decrease." },
  { q: "What is the difference between percentage change and percentage difference?", a: "Percentage change uses the initial value as the base (directional — it matters which is 'old' and which is 'new'). Percentage difference uses the average of both values as the base and is always positive — useful when neither value is clearly the 'starting' value." },
  { q: "Can percentage change be more than 100%?", a: "Yes. If the final value is more than double the initial value, the percentage change exceeds 100%. For example, going from 50 to 150 is a 200% increase." },
  { q: "What if the initial value is zero?", a: "Percentage change is undefined when the initial value is zero because division by zero is not possible. In practice, going from 0 to any positive number is considered an infinite increase." },
];

function fmt(n) {
  if (n === null || !isFinite(n)) return "—";
  return Math.round(n * 10000) / 10000;
}

function calcChange(initial, final) {
  const i = parseFloat(initial);
  const f = parseFloat(final);
  if (isNaN(i) || isNaN(f) || i === 0) return null;
  const diff = f - i;
  const pct = (diff / Math.abs(i)) * 100;
  return { initial: i, final: f, diff, pct, isIncrease: diff >= 0 };
}

function calcDifference(a, b) {
  const va = parseFloat(a);
  const vb = parseFloat(b);
  if (isNaN(va) || isNaN(vb)) return null;
  const avg = (Math.abs(va) + Math.abs(vb)) / 2;
  if (avg === 0) return null;
  const diff = Math.abs(va - vb);
  const pct = (diff / avg) * 100;
  return { a: va, b: vb, diff, pct, avg };
}

export default function PercentageChange() {
  const [mode, setMode] = useState("change");
  const [initial, setInitial] = useState("800");
  const [final, setFinal] = useState("1000");
  const [diffA, setDiffA] = useState("50");
  const [diffB, setDiffB] = useState("75");

  const change = useMemo(() => calcChange(initial, final), [initial, final]);
  const difference = useMemo(() => calcDifference(diffA, diffB), [diffA, diffB]);

  const result = mode === "change" ? change : difference;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* Title */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Percentage Change Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate the percentage change between two values, or the percentage difference between any two numbers.
            </p>
          </div>

          {/* Mode toggle + inputs */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex gap-2">
              {[{ v: "change", l: "% Change" }, { v: "difference", l: "% Difference" }].map(o => (
                <button key={o.v} onClick={() => setMode(o.v)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                    mode === o.v
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}>{o.l}</button>
              ))}
            </div>

            {mode === "change" ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Initial Value" id="initial" value={initial} onChange={setInitial} autoFocus />
                <InputField label="Final Value" id="final" value={final} onChange={setFinal} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Value A" id="diffA" value={diffA} onChange={setDiffA} />
                <InputField label="Value B" id="diffB" value={diffB} onChange={setDiffB} />
              </div>
            )}
          </div>

          {/* Result card */}
          {mode === "change" && change && (
            <>
              <div className={`${change.isIncrease ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"} border rounded-xl p-4`}>
                <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${change.isIncrease ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  Percentage {change.isIncrease ? "Increase" : "Decrease"}
                </p>
                <p className={`text-3xl font-extrabold leading-tight ${change.isIncrease ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {change.isIncrease ? "+" : ""}{fmt(change.pct)}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Absolute Change</p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                    {change.diff >= 0 ? "+" : ""}{fmt(change.diff)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Multiplier</p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                    ×{fmt(change.final / change.initial)}
                  </p>
                </div>
              </div>

              {/* Step-by-step */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Step-by-Step Calculation</h2>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-mono">
                  <div><span className="text-slate-400">Step 1:</span> Difference = {fmt(change.final)} − {fmt(change.initial)} = <span className="font-bold text-slate-800 dark:text-slate-200">{fmt(change.diff)}</span></div>
                  <div><span className="text-slate-400">Step 2:</span> Divide by initial = {fmt(change.diff)} ÷ {fmt(Math.abs(change.initial))} = <span className="font-bold text-slate-800 dark:text-slate-200">{fmt(change.diff / Math.abs(change.initial))}</span></div>
                  <div><span className="text-slate-400">Step 3:</span> Multiply by 100 = {fmt(change.diff / Math.abs(change.initial))} × 100 = <span className={`font-bold ${change.isIncrease ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{change.isIncrease ? "+" : ""}{fmt(change.pct)}%</span></div>
                </div>
              </div>
            </>
          )}

          {mode === "difference" && difference && (
            <>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Percentage Difference</p>
                <p className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmt(difference.pct)}%</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Absolute Difference</p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt(difference.diff)}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Average of Both</p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt(difference.avg)}</p>
                </div>
              </div>

              {/* Step-by-step */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Step-by-Step Calculation</h2>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-mono">
                  <div><span className="text-slate-400">Step 1:</span> Difference = |{fmt(difference.a)} − {fmt(difference.b)}| = <span className="font-bold text-slate-800 dark:text-slate-200">{fmt(difference.diff)}</span></div>
                  <div><span className="text-slate-400">Step 2:</span> Average = (|{fmt(difference.a)}| + |{fmt(difference.b)}|) ÷ 2 = <span className="font-bold text-slate-800 dark:text-slate-200">{fmt(difference.avg)}</span></div>
                  <div><span className="text-slate-400">Step 3:</span> Divide and × 100 = ({fmt(difference.diff)} ÷ {fmt(difference.avg)}) × 100 = <span className="font-bold text-indigo-600 dark:text-indigo-400">{fmt(difference.pct)}%</span></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* Examples table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Common Examples</h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-3 font-semibold">From</th>
                    <th className="pb-2 pr-3 font-semibold">To</th>
                    <th className="pb-2 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [100, 125, "+25%"], [100, 150, "+50%"], [100, 200, "+100%"],
                    [100, 75, "−25%"], [100, 50, "−50%"], [100, 10, "−90%"],
                    [50, 75, "+50%"], [200, 250, "+25%"], [1000, 800, "−20%"],
                    [650, 700, "+7.69%"], [80, 100, "+25%"], [500, 350, "−30%"],
                  ].map(([from, to, pct], i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                      onClick={() => { if (mode === "change") { setInitial(String(from)); setFinal(String(to)); } }}>
                      <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{from}</td>
                      <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{to}</td>
                      <td className={`py-2 font-semibold ${pct.startsWith("+") || pct.startsWith("−") ? (pct.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400") : "text-slate-800 dark:text-white"}`}>{pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Formulas</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Percentage Change:
  ((Final − Initial) / |Initial|) × 100

Percentage Difference:
  (|A − B| / ((|A| + |B|) / 2)) × 100`}
            </pre>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH FAQ */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Frequently Asked Questions</h2>
        {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
      </div>
    </div>
  );
}
