import React, { useState, useMemo } from "react";
import { calcLumpsum, lumpsumSchedule } from "../../utils/sipCalculator";
import { ChevronDown, ChevronUp } from "lucide-react";
import BreakdownCard from "../../components/ui/BreakdownCard";

const CURRENCIES = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
const CUR_OPTS   = Object.entries(CURRENCIES).map(([k, v]) => ({ value: k, label: `${v} ${k}` }));

function fmtN(sym, n) {
  if (!isFinite(n)) return "—";
  return sym + Math.round(n).toLocaleString("en-IN");
}

function SliderInput({ label, value, onChange, min, max, step = 1, prefix = "", suffix = "" }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg px-2 py-1">
          {prefix && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{prefix}</span>}
          <input
            type="number" value={value}
            onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
            className="w-28 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-transparent border-none outline-none text-right"
          />
          {suffix && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-emerald-600 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
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
  { q: "What is a lumpsum investment?", a: "A lumpsum investment means investing a large fixed amount all at once, as opposed to spreading it over time with SIP. It can generate higher returns if markets perform well over the investment period." },
  { q: "Lumpsum vs SIP — which is better?", a: "If you have a large amount available and markets are at a low, lumpsum can outperform SIP. SIP is better for regular income earners and volatile markets, as it averages out the cost of investment." },
  { q: "How is the return rate calculated?", a: "The formula uses compound annual growth rate (CAGR). At 12% annual return, your money grows roughly 3.1× in 10 years and 9.6× in 20 years due to the power of compounding." },
];

export default function LumpsumCalculator() {
  const [currency,  setCurrency]  = useState("INR");
  const [principal, setPrincipal] = useState(100000);
  const [rate,      setRate]      = useState(12);
  const [years,     setYears]     = useState(10);

  const sym = CURRENCIES[currency];

  const result   = useMemo(() => calcLumpsum({ principal, annualRate: rate, years }), [principal, rate, years]);
  const schedule = useMemo(() => lumpsumSchedule({ principal, annualRate: rate, years }), [principal, rate, years]);

  const investedPct = result.total > 0 ? (result.invested / result.total) * 100 : 50;
  const returnsPct  = 100 - investedPct;

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Lumpsum Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate the future value of a one-time lump sum investment at a given annual return rate.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-6">
            {/* Currency */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Currency</label>
              <div className="flex gap-2 flex-wrap">
                {CUR_OPTS.map(o => (
                  <button key={o.value} onClick={() => setCurrency(o.value)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      currency === o.value
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.label}</button>
                ))}
              </div>
            </div>

            <SliderInput label="Total Investment" value={principal} onChange={setPrincipal} min={1000} max={10000000} step={1000} prefix={sym} />
            <SliderInput label="Expected Return Rate (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
            <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} suffix=" yr" />
          </div>

          {/* 3-col metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Total Value</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmtN(sym, result.total)}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Est. Returns</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmtN(sym, result.returns)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Invested Amount</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmtN(sym, result.invested)}</p>
            </div>
          </div>

          {/* Breakdown */}
          <BreakdownCard
            title="Invested vs. Returns Breakdown"
            primaryLabel="Invested"
            secondaryLabel="Returns"
            primaryPct={investedPct}
            secondaryPct={returnsPct}
            primaryAmount={result.invested}
            secondaryAmount={result.returns}
            sym={sym}
            schedule={schedule.map(r => ({ year: r.year, totalBalance: r.total, interestEarned: r.returns - (schedule[r.year - 2]?.returns ?? 0) }))}
          />
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* Year-by-year table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Year-by-Year Growth</h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Year</th>
                    <th className="pb-2 pr-4 font-semibold">Invested</th>
                    <th className="pb-2 pr-4 font-semibold">Returns</th>
                    <th className="pb-2 font-semibold">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(row => (
                    <tr key={row.year} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-300">{row.year}</td>
                      <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{fmtN(sym, row.invested)}</td>
                      <td className="py-2.5 pr-4 text-emerald-600 dark:text-emerald-400">{fmtN(sym, row.returns)}</td>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-white">{fmtN(sym, row.total)}</td>
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
{`A = P × (1 + r)ᵗ

Where:
  A = Future value
  P = Principal (lump sum invested)
  r = Annual return rate (as decimal)
  t = Time period in years

Example: ₹1,00,000 at 12% for 10 years
  = 1,00,000 × (1.12)¹⁰ = ₹3,10,585`}
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
