import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { futureValue, presentValue, generateSchedule, HISTORICAL_RATES } from "../../utils/inflationCalculator";
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

const CURRENCIES = { USD:"$", EUR:"€", GBP:"£", INR:"₹", JPY:"¥" };
const fmt = (n, s="$") => isFinite(n) ? s + Math.abs(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : "—";

function SectionLabel({ text }) {
  return (
    <div className="mb-3">
      <span className="inline-block border border-slate-300 dark:border-slate-600 rounded px-2 py-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{text}</span>
      </span>
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
  { q:"What is inflation?", a:"Inflation is the rate at which the general price level of goods and services rises over time, eroding purchasing power. A 3% annual inflation rate means something that costs $100 today will cost $103 next year." },
  { q:"What is a good inflation rate to use?", a:"Use the current official rate for your country (often published by central banks). For long-term projections, a 2–3% rate is commonly used as it reflects typical central bank targets in developed economies." },
  { q:"How does inflation affect savings?", a:"If your savings account earns less than the inflation rate, your money is losing real purchasing power even as the nominal balance grows. A 5% return with 3% inflation gives you only ~2% real return." },
];

export default function InflationCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [amount,   setAmount]   = useState("1000");
  const [rate,     setRate]     = useState("3");
  const [years,    setYears]    = useState("10");
  const [mode,     setMode]     = useState("future"); // future | past

  const sym = CURRENCIES[currency] ?? "$";
  const A   = parseFloat(amount)||0;
  const r   = parseFloat(rate)||0;
  const y   = parseInt(years)||0;

  const fv       = useMemo(() => futureValue(A, r, y), [A, r, y]);
  const pv       = useMemo(() => presentValue(A, r, y), [A, r, y]);
  const schedule = useMemo(() => generateSchedule(A, r, Math.min(y, 50), mode), [A, r, y, mode]);

  const displayed   = mode === "future" ? fv : pv;
  const lostPower   = mode === "future" ? fv - A : A - pv;
  const cumInflPct  = mode === "future" ? ((fv - A) / A) * 100 : ((A - pv) / pv) * 100;

  const currencyOpts = Object.keys(CURRENCIES).map(k=>({value:k,label:`${k} (${CURRENCIES[k]})`}));

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Inflation Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate the impact of inflation on purchasing power — project future costs or find past equivalents.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            {/* Mode */}
            <div>
              <SectionLabel text="Mode" />
              <div className="flex gap-2">
                {[{ v:"future", l:"Future Cost" }, { v:"past", l:"Past Equivalent" }].map(o => (
                  <button key={o.v} onClick={() => setMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      mode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {mode==="future"
                  ? "What will today's amount cost in the future at this inflation rate?"
                  : "What was the equivalent amount in the past worth in today's money?"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <select value={currency} onChange={e=>setCurrency(e.target.value)}
                  className="py-2 px-2 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                  {currencyOpts.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <InputField label="" id="amt" value={amount} onChange={setAmount} prefix={sym} className="flex-1"/>
              </div>
              <InputField label="Annual Inflation Rate" id="rate" value={rate} onChange={setRate} suffix="%"/>
              <InputField label="Time Period (years)"   id="yrs"  value={years} onChange={setYears} min="1" max="100"/>
            </div>

            {/* Historical presets */}
            <div>
              <SectionLabel text="Historical Presets" />
              <div className="flex flex-wrap gap-2">
                {HISTORICAL_RATES.map(hr=>(
                  <button key={hr.label} onClick={()=>setRate(String(hr.rate))}
                    className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-full text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    {hr.label}: {hr.rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3-col metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">{mode==="future"?"Future Cost":"Past Equivalent"}</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmt(displayed, sym)}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">{mode==="future"?"Power Lost":"Power Gained"}</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmt(Math.abs(lostPower), sym)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cumulative Inflation</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{isFinite(cumInflPct) ? cumInflPct.toFixed(1) : "—"}%</p>
            </div>
          </div>

          {/* 2-col metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Annual Rate</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{r}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Yearly Impact</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt(Math.abs(lostPower/y), sym)}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* Year-by-year table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-indigo-500"/>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {mode==="future"?"Projected Cost Over Time":"Equivalent Value Over Time"}
              </h2>
            </div>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm min-w-[340px]">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Year</th>
                    <th className="pb-2 pr-4 font-semibold">Value</th>
                    <th className="pb-2 font-semibold">Change from Original</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(row=>(
                    <tr key={row.year} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-2 pr-4 font-medium text-slate-600 dark:text-slate-400">{row.year}</td>
                      <td className="py-2 pr-4 font-semibold text-slate-800 dark:text-white">{fmt(row.value, sym)}</td>
                      <td className="py-2">
                        <span className={mode==="future"?"text-rose-500":"text-emerald-600"}>
                          {mode==="future" ? "+" : ""}{fmt(row.value - A, sym)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Future Value:  FV = PV × (1 + r)^t
Present Value: PV = FV / (1 + r)^t

r = annual inflation rate (decimal)
t = number of years`}
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
