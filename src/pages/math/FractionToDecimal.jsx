import React, { useState, useMemo } from "react";
import { convertFraction } from "../../utils/fractionDecimal";
import { ChevronDown, ChevronUp } from "lucide-react";

function NumInput({ id, label, value, onChange, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <input id={id} type="number" value={value} onChange={e => onChange(e.target.value)}
        className="w-full py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
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
  { q:"How do you convert a fraction to a decimal?", a:"Simply divide the numerator (top number) by the denominator (bottom number). For example, 3/4 = 3 ÷ 4 = 0.75." },
  { q:"What is a repeating decimal?", a:"Some fractions produce a decimal that repeats forever — like 1/3 = 0.3333… A fraction produces a repeating decimal whenever the denominator has prime factors other than 2 and 5." },
  { q:"How do you simplify a fraction?", a:"Find the Greatest Common Divisor (GCD) of the numerator and denominator, then divide both by it. For 6/8, GCD is 2, so 6/8 simplifies to 3/4." },
];

export default function FractionToDecimal() {
  const [whole, setWhole] = useState("");
  const [numer, setNumer] = useState("1");
  const [denom, setDenom] = useState("4");

  const result = useMemo(
    () => convertFraction({ whole: parseInt(whole)||0, numerator: parseInt(numer)||0, denominator: parseInt(denom)||0 }),
    [whole, numer, denom]
  );

  const decimalFull = result ? result.decimal.toFixed(10).replace(/0+$/, "") : null;
  const percentFull = result ? (result.percentage).toFixed(6).replace(/\.?0+$/, "") : null;

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Fraction to Decimal Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convert any fraction or mixed number to a decimal and percentage instantly.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Enter Fraction</p>

            {/* Visual fraction input */}
            <div className="flex items-center gap-4 flex-wrap">
              <NumInput id="whole" label="Whole Number (optional)" value={whole} onChange={setWhole} className="w-40"/>
              <div className="flex flex-col items-center gap-1 mt-5">
                <NumInput id="numer" label="" value={numer} onChange={setNumer} className="w-24"/>
                <div className="w-24 h-0.5 bg-slate-400 dark:bg-slate-500"/>
                <NumInput id="denom" label="" value={denom} onChange={setDenom} className="w-24"/>
              </div>
              {result && (
                <div className="mt-5 flex items-center gap-2">
                  <span className="text-2xl text-slate-400">=</span>
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {result.decimal.toFixed(6).replace(/\.?0+$/, "")}
                  </span>
                </div>
              )}
            </div>

            {whole && (
              <p className="mt-3 text-xs text-slate-400">
                Mixed number: <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {whole} {numer}/{denom}
                </span> = <span className="font-semibold">{result?.simpN}/{result?.simpD}</span> (improper fraction)
              </p>
            )}

            {/* Common fractions reference */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Common Fractions</p>
              <div className="grid grid-cols-4 gap-2">
                {[["1","2"],["1","3"],["1","4"],["1","5"],["2","3"],["3","4"],["1","8"],["3","8"]].map(([n,d])=>(
                  <button key={`${n}/${d}`} onClick={()=>{ setNumer(n); setDenom(d); setWhole(""); }}
                    className="text-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                    <span className="block text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">{n}/{d}</span>
                    <span className="block text-xs text-slate-400">{(parseInt(n)/parseInt(d)).toFixed(4).replace(/0+$/,"")}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Metric/result cards — moved to left column */}
          {result && (
            <>
              {/* 2-col metric cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Decimal</p>
                  <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight break-all">{decimalFull}</p>
                  {result.repeatingPart && (
                    <p className="text-xs text-indigo-400 mt-1">Repeating: <span className="font-mono">{result.repeatingPart}</span></p>
                  )}
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Percentage</p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{percentFull}%</p>
                </div>
              </div>

              {/* 2-col more cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Simplified Fraction</p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{result.simplified}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Step-by-Step</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{numer} ÷ {denom}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">= {decimalFull}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">= {percentFull}%</p>
                  {result.simplified !== `${numer}/${denom}` &&
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">Simplified: {result.simplified}</p>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN — How-to + Formula */}
        <div className="space-y-4">

          {/* How to Calculate card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">How to Convert Fractions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Enter the numerator and denominator on the left. Optionally add a whole number to convert mixed numbers. Select any common fraction shortcut to fill the inputs instantly.
            </p>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Decimal = Numerator ÷ Denominator
Percentage = Decimal × 100
Simplified: divide both by GCD(numerator, denominator)

Mixed number to improper fraction:
  (Whole × Denominator + Numerator) / Denominator`}
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
