import React, { useState, useMemo } from "react";
import SelectField from "../../components/ui/SelectField";
import { weightUnits, convert } from "../../utils/unitConversions";
import { ChevronDown, ChevronUp } from "lucide-react";

const UNIT_OPTS = Object.entries(weightUnits).map(([k,v])=>({ value:k, label:v.label }));
const fmtVal = (n) => {
  if (!isFinite(n) || n < 0) return "—";
  if (Math.abs(n) < 0.0001 || Math.abs(n) >= 1e9) return n.toExponential(4);
  if (Math.abs(n) < 1) return n.toFixed(6).replace(/\.?0+$/,"");
  if (Math.abs(n) < 1000) return Number(n.toPrecision(8)).toString();
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
};

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
  { q:"What is the difference between weight and mass?", a:"Mass measures the amount of matter in an object (kg, g) and doesn't change with gravity. Weight is the force of gravity on that mass (measured in Newtons). In everyday usage, the terms are used interchangeably since we're all on Earth." },
  { q:"How do I convert kg to lbs?", a:"Multiply kilograms by 2.20462. For example, 70 kg × 2.20462 = 154.32 lbs. To go the other direction, multiply pounds by 0.453592." },
  { q:"What is a stone in pounds?", a:"One stone equals exactly 14 pounds. This unit is commonly used for body weight in the UK and Ireland." },
];

export default function WeightConverter() {
  const [fromUnit, setFromUnit] = useState("kg");
  const [toUnit,   setToUnit]   = useState("lb");
  const [value,    setValue]    = useState("1");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!isFinite(v)) return null;
    return convert(v, fromUnit, toUnit, weightUnits);
  }, [value, fromUnit, toUnit]);

  // all units table
  const allResults = useMemo(() => {
    const v = parseFloat(value);
    if (!isFinite(v)) return [];
    return Object.entries(weightUnits).map(([k,u])=>({
      key: k, label: u.label, value: convert(v, fromUnit, k, weightUnits),
    }));
  }, [value, fromUnit]);

  function swap() { setFromUnit(toUnit); setToUnit(fromUnit); }

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Weight & Mass Converter</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convert between kilograms, pounds, ounces, stone, grams, and milligrams.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              {/* Value input */}
              <div className="flex flex-col gap-1 flex-1 min-w-32">
                <label htmlFor="val" className="text-sm font-medium text-slate-700 dark:text-slate-300">Value</label>
                <input id="val" type="number" value={value} onChange={e=>setValue(e.target.value)}
                  className="py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"/>
              </div>

              <SelectField label="From" id="from" value={fromUnit} onChange={setFromUnit} options={UNIT_OPTS} className="flex-1 min-w-40"/>

              {/* Swap button */}
              <button onClick={swap} className="mb-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" title="Swap units">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
              </button>

              <SelectField label="To" id="to" value={toUnit} onChange={setToUnit} options={UNIT_OPTS} className="flex-1 min-w-40"/>
            </div>
          </div>

          {/* Primary result */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Result</p>
            <p className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 break-all leading-tight">
              {value} {weightUnits[fromUnit]?.label?.split(" ")[0] ?? fromUnit} = {fmtVal(result)} {weightUnits[toUnit]?.label?.split(" ")[0] ?? toUnit}
            </p>
          </div>

          {/* Common conversions */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Common Conversions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              {[
                "1 kg = 2.2046 lbs",  "1 lb = 0.4536 kg",
                "1 stone = 6.3503 kg","1 oz = 28.3495 g",
                "1 kg = 1000 g",      "1 lb = 16 oz",
                "1 ton = 1000 kg",    "1 g = 1000 mg",
              ].map(s=>(
                <div key={s} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <span className="font-mono text-slate-700 dark:text-slate-200">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* All conversions table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              All conversions for {value} {weightUnits[fromUnit]?.label}
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Unit</th>
                    <th className="pb-2 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map(r=>(
                    <tr key={r.key} className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 cursor-pointer ${r.key===toUnit?"bg-indigo-50 dark:bg-indigo-900/20":""}`}
                        onClick={()=>setToUnit(r.key)}>
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{r.label}</td>
                      <td className="py-2 font-mono font-medium text-slate-800 dark:text-white">{fmtVal(r.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-2">Click a row to set it as the target unit</p>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Base unit: Kilogram (kg)

To convert: multiply value by fromUnit.toBase, then divide by toUnit.toBase

Key relationships:
  1 kg = 2.20462 lbs
  1 lb = 16 oz
  1 stone = 14 lbs
  1 ton = 1,000 kg`}
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
