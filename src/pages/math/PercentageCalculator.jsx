import React, { useState } from "react";
import {
  whatIsXPercentOfY,
  xIsWhatPercentOfY,
  percentageChangeBetween,
  applyPercentageTo,
  xIsYPercentOfWhat,
} from "../../utils/percentage";
import InputField from "../../components/ui/InputField";
import { ChevronDown, ChevronUp } from "lucide-react";

function fmt(n, suffix = "") {
  if (n === null || !isFinite(n)) return null;
  const val = Math.round(n * 10000) / 10000;
  return `${val}${suffix}`;
}

function ResultBadge({ value, color }) {
  if (value === null) return null;
  return (
    <span className={`inline-flex items-center text-2xl font-bold ${color ?? "text-indigo-600 dark:text-indigo-400"}`}>
      = {value}
    </span>
  );
}

function ModeCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-4">{title}</p>
      {children}
    </div>
  );
}

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
  { q:"What does 'percent' mean?", a:"Percent literally means 'per hundred'. So 45% means 45 out of every 100, or equivalently 0.45 as a decimal." },
  { q:"How do I calculate a percentage increase?", a:"Subtract the original value from the new value, divide by the absolute value of the original, then multiply by 100. A positive result is an increase; negative is a decrease." },
  { q:"How do I find what number a value is a percentage of?", a:"Divide the value by the percentage (as a decimal). For example, 45 is 30% of what? → 45 ÷ 0.30 = 150." },
];

export default function PercentageCalculator() {
  const [a1, setA1] = useState("20");
  const [b1, setB1] = useState("80");
  const [a2, setA2] = useState("30");
  const [b2, setB2] = useState("150");
  const [a3, setA3] = useState("50");
  const [b3, setB3] = useState("75");
  const [a4, setA4] = useState("200");
  const [b4, setB4] = useState("15");
  const [a5, setA5] = useState("45");
  const [b5, setB5] = useState("30");

  const r1 = whatIsXPercentOfY(parseFloat(a1), parseFloat(b1));
  const r2 = xIsWhatPercentOfY(parseFloat(a2), parseFloat(b2));
  const r3 = percentageChangeBetween(parseFloat(a3), parseFloat(b3));
  const r4 = applyPercentageTo(parseFloat(a4), parseFloat(b4));
  const r5 = xIsYPercentOfWhat(parseFloat(a5), parseFloat(b5));

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Percentage Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Five calculation modes — results update as you type.
            </p>
          </div>

          {/* Input form card — mode cards */}
          <div className="space-y-4">
            {/* Mode 1: What is X% of Y? */}
            <ModeCard title="What is X% of Y?">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">What is</span>
                <InputField id="a1" value={a1} onChange={setA1} suffix="%" className="w-28" autoFocus />
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">of</span>
                <InputField id="b1" value={b1} onChange={setB1} className="w-28" />
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">?</span>
                <ResultBadge value={fmt(r1)} />
              </div>
            </ModeCard>

            {/* Mode 2: X is what % of Y? */}
            <ModeCard title="X is what percentage of Y?">
              <div className="flex flex-wrap items-end gap-3">
                <InputField id="a2" value={a2} onChange={setA2} className="w-28" />
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">is what % of</span>
                <InputField id="b2" value={b2} onChange={setB2} className="w-28" />
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">?</span>
                <ResultBadge value={fmt(r2, "%")} />
              </div>
            </ModeCard>

            {/* Mode 3: % change */}
            <ModeCard title="Percentage change from X to Y?">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">From</span>
                <InputField id="a3" value={a3} onChange={setA3} className="w-28" />
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">to</span>
                <InputField id="b3" value={b3} onChange={setB3} className="w-28" />
                {r3 !== null && isFinite(r3) && (
                  <span className={`text-2xl font-bold ${r3 >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    = {r3 >= 0 ? "+" : ""}{Math.round(r3 * 10000) / 10000}%
                  </span>
                )}
              </div>
            </ModeCard>

            {/* Mode 5: X is Y% of what? */}
            <ModeCard title="X is Y% of what?">
              <div className="flex flex-wrap items-end gap-3">
                <InputField id="a5" value={a5} onChange={setA5} className="w-28" />
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">is</span>
                <InputField id="b5" value={b5} onChange={setB5} suffix="%" className="w-28" />
                <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">of what?</span>
                <ResultBadge value={fmt(r5)} />
              </div>
            </ModeCard>
          </div>

          {/* Mode 4: Increase / Decrease — moved to left column */}
          <ModeCard title="Increase / Decrease X by Y%">
            <div className="flex flex-wrap items-end gap-3">
              <InputField id="a4" value={a4} onChange={setA4} className="w-28" />
              <span className="text-sm text-slate-500 dark:text-slate-400 pb-2">±</span>
              <InputField id="b4" value={b4} onChange={setB4} suffix="%" className="w-28" />
            </div>
            {r4 && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wide mb-1">Increased</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{fmt(r4.increased)}</p>
                  <p className="text-xs text-emerald-400">+{fmt(r4.delta)}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                  <p className="text-xs text-red-400 font-semibold uppercase tracking-wide mb-1">Decreased</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">{fmt(r4.decreased)}</p>
                  <p className="text-xs text-red-400">−{fmt(r4.delta)}</p>
                </div>
              </div>
            )}
          </ModeCard>
        </div>

        {/* RIGHT COLUMN — How-to + Formula */}
        <div className="space-y-4">

          {/* How to Calculate card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">How to Calculate Percentages</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Use the five modes on the left to instantly solve any percentage problem. All results update as you type with no submit button needed.
            </p>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`1. What is P% of X?           →  (P / 100) × X
2. X is what % of Y?          →  (X / Y) × 100
3. % Change from X to Y?      →  ((Y − X) / |X|) × 100
4. X increased / decreased by P%  →  X ± (P / 100) × X
5. X is P% of what?           →  X × (100 / P)`}
            </pre>
          </div>

        </div>
      </div>

      {/* FULL-WIDTH FAQ — below both columns */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Frequently Asked Questions</h2>
        {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
      </div>
    </div>
  );
}
