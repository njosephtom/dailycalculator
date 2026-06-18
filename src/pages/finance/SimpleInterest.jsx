import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import BreakdownCard from "../../components/ui/BreakdownCard";
import {
  calculateSimpleInterest,
  durationToMonths,
  monthsFromDates,
  addMonths,
  todayISO,
  CURRENCIES,
  CONTRIB_FREQUENCIES,
} from "../../utils/simpleInterest";

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmt(n, symbol = "$") {
  if (!isFinite(n)) return "—";
  return (
    symbol +
    Math.abs(n)
      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function fmtShort(n, symbol = "$") {
  if (!isFinite(n)) return "—";
  return symbol + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

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
  { q: "What is simple interest?", a: "Simple interest is calculated only on the original principal — it does not compound. Each period, the same fixed amount of interest is earned. The formula is I = P × r × t." },
  { q: "How is simple interest different from compound interest?", a: "With simple interest, you always earn interest on the original principal only. With compound interest, you earn interest on the principal plus all previously earned interest, causing it to grow exponentially." },
  { q: "When is simple interest used in real life?", a: "Simple interest is commonly used for short-term loans, car loans, some personal loans, U.S. Treasury bills, and some savings bonds. Most long-term savings accounts and mortgages use compound interest." },
];

// ─── main component ───────────────────────────────────────────────────────────
export default function SimpleInterest() {
  // ── inputs ──
  const [currency,       setCurrency]       = useState("USD");
  const [principal,      setPrincipal]      = useState("10000");
  const [rate,           setRate]           = useState("5");
  const [rateType,       setRateType]       = useState("yearly");   // yearly | monthly
  const [timeMode,       setTimeMode]       = useState("duration"); // duration | enddate
  const [durYears,       setDurYears]       = useState("5");
  const [durMonths,      setDurMonths]      = useState("0");
  const [durWeeks,       setDurWeeks]       = useState("0");
  const [durDays,        setDurDays]        = useState("0");
  const [startDate,      setStartDate]      = useState(todayISO());
  const [endDate,        setEndDate]        = useState(addMonths(todayISO(), 60));
  const [contribMode,    setContribMode]    = useState("none");     // none | additions | deductions
  const [contribAmount,  setContribAmount]  = useState("200");
  const [contribFreq,    setContribFreq]    = useState("monthly");

  // ── output tab ──
  const [tableTab, setTableTab] = useState("monthly"); // monthly | yearly

  const sym = CURRENCIES[currency]?.symbol ?? "$";

  // ── derived values ──
  const totalMonths = useMemo(() => {
    if (timeMode === "duration") {
      return durationToMonths({
        years: durYears, months: durMonths, weeks: durWeeks, days: durDays,
      });
    }
    return monthsFromDates(startDate, endDate);
  }, [timeMode, durYears, durMonths, durWeeks, durDays, startDate, endDate]);

  const annualRate = useMemo(() => {
    const r = parseFloat(rate) || 0;
    return rateType === "monthly" ? r * 12 : r;
  }, [rate, rateType]);

  const result = useMemo(
    () =>
      calculateSimpleInterest({
        principal:             parseFloat(principal)     || 0,
        annualRate,
        totalMonths,
        contributionMode:      contribMode,
        contributionAmount:    parseFloat(contribAmount) || 0,
        contributionFreqMonths: CONTRIB_FREQUENCIES[contribFreq]?.months ?? 1,
      }),
    [principal, annualRate, totalMonths, contribMode, contribAmount, contribFreq]
  );

  const endDateDisplay = useMemo(() => {
    const base = timeMode === "enddate" ? endDate : startDate;
    const d = new Date(addMonths(base, timeMode === "enddate" ? 0 : totalMonths));
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }, [timeMode, startDate, endDate, totalMonths]);

  // ── formula display ──
  const P = parseFloat(principal) || 0;
  const r = annualRate / 100;
  const t = totalMonths / 12;
  const formulaLine1 = `A = P × (1 + r × t)`;
  const formulaLine2 = `A = ${sym}${P.toLocaleString()} × (1 + ${r.toFixed(4)} × ${t.toFixed(4)})`;
  const formulaLine3 = `A = ${sym}${P.toLocaleString()} × ${(1 + r * t).toFixed(6)}`;
  const formulaLine4 = `A = ${fmt(result.finalBalance, sym)}`;

  // ─── currency options ──────────────────────────────────────────────────────
  const currencyOptions = Object.entries(CURRENCIES).map(([k, v]) => ({
    value: k, label: v.label,
  }));
  const contribFreqOptions = Object.entries(CONTRIB_FREQUENCIES).map(([k, v]) => ({
    value: k, label: v.label,
  }));

  // ── progress bar ──
  const total = result.finalBalance;
  const principalPct = total > 0 ? Math.min(100, (result.initialBalance / total) * 100) : 50;
  const interestPct  = 100 - principalPct;

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Simple Interest Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate interest on a principal sum over time — with optional regular additions or deductions.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">

            {/* Principal & Rate */}
            <div>
              <SectionLabel text="Principal & Rate" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField label="Currency" id="currency" value={currency} onChange={setCurrency} options={currencyOptions} />
                <InputField label="Principal Amount" id="principal" value={principal} onChange={setPrincipal} prefix={sym} className="sm:col-span-2" autoFocus />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interest Rate</label>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
                      className="w-32 py-2 pl-3 pr-8 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      aria-label="Interest rate" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">%</span>
                  </div>
                  <div className="flex gap-2">
                    {[{ v:"yearly", l:"Per Year" }, { v:"monthly", l:"Per Month" }].map(o => (
                      <button key={o.v} onClick={() => setRateType(o.v)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                          rateType === o.v
                            ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                            : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                        }`}>{o.l}</button>
                    ))}
                  </div>
                  {rateType === "monthly" && (
                    <span className="text-xs text-slate-400">= {(parseFloat(rate) * 12 || 0).toFixed(2)}% annual</span>
                  )}
                </div>
              </div>
            </div>

            {/* Time period */}
            <div>
              <SectionLabel text="Time Period" />
              <div className="flex gap-2">
                {[{ v:"duration", l:"Duration" }, { v:"enddate", l:"End Date" }].map(o => (
                  <button key={o.v} onClick={() => setTimeMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      timeMode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
              {timeMode === "duration" ? (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <InputField label="Years"  id="dur-y" value={durYears}  onChange={setDurYears}  min="0" />
                  <InputField label="Months" id="dur-m" value={durMonths} onChange={setDurMonths} min="0" max="11" />
                  <InputField label="Weeks"  id="dur-w" value={durWeeks}  onChange={setDurWeeks}  min="0" />
                  <InputField label="Days"   id="dur-d" value={durDays}   onChange={setDurDays}   min="0" />
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Start Date" id="start-date" type="date" value={startDate} onChange={setStartDate} />
                  <InputField label="End Date"   id="end-date"   type="date" value={endDate}   onChange={setEndDate} />
                </div>
              )}
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Duration: <span className="font-medium text-slate-600 dark:text-slate-300">{totalMonths} months ({(totalMonths / 12).toFixed(2)} years)</span>
              </p>
            </div>

            {/* Contributions */}
            <div>
              <SectionLabel text="Regular Contributions" />
              <div className="flex gap-2">
                {[{ v:"none", l:"None" }, { v:"additions", l:"Additions" }, { v:"deductions", l:"Deductions" }].map(o => (
                  <button key={o.v} onClick={() => setContribMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      contribMode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
              {contribMode !== "none" && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label={contribMode === "additions" ? "Addition Amount" : "Deduction Amount"}
                    id="contrib-amount"
                    value={contribAmount}
                    onChange={setContribAmount}
                    prefix={sym}
                  />
                  <SelectField label="Frequency" id="contrib-freq" value={contribFreq} onChange={setContribFreq} options={contribFreqOptions} />
                </div>
              )}
            </div>
          </div>

          {/* 3-col metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Final Balance</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmt(result.finalBalance, sym)}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Interest Accrued</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmt(result.interestAccrued, sym)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Initial Balance</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt(result.initialBalance, sym)}</p>
            </div>
          </div>

          {/* 2-col metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Monthly Interest</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmtShort(result.monthlyInterest, sym)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">End Date</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{endDateDisplay}</p>
            </div>
          </div>

          {/* Breakdown */}
          <BreakdownCard
            primaryPct={principalPct}
            secondaryPct={interestPct}
            primaryAmount={result.initialBalance}
            secondaryAmount={result.interestAccrued}
            sym={sym}
            schedule={result.yearlySchedule?.map(r => ({ year: r.year, totalBalance: r.balance, interestEarned: r.interest }))}
          />
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* Interest Schedule table — wrapped in scrollable container */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Interest Schedule</h2>
              </div>
              <div className="flex gap-2">
                {[{ v:"monthly", l:"Monthly" }, { v:"yearly", l:"Yearly" }].map(o => (
                  <button key={o.v} onClick={() => setTableTab(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      tableTab === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              {tableTab === "monthly" ? (
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                    <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 pr-3 font-semibold">Month</th>
                      {contribMode !== "none" && <th className="pb-2 pr-3 font-semibold capitalize">{contribMode === "additions" ? "Addition" : "Deduction"}</th>}
                      <th className="pb-2 pr-3 font-semibold">Interest</th>
                      {contribMode !== "none" && <th className="pb-2 pr-3 font-semibold">Total {contribMode === "additions" ? "Added" : "Deducted"}</th>}
                      <th className="pb-2 pr-3 font-semibold">Total Interest</th>
                      <th className="pb-2 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-2 pr-3 font-medium text-slate-600 dark:text-slate-400">{row.month}</td>
                        {contribMode !== "none" && (
                          <td className={`py-2 pr-3 ${row.contribution > 0 ? "text-emerald-600 dark:text-emerald-400" : row.contribution < 0 ? "text-red-500" : "text-slate-400"}`}>
                            {row.contribution !== 0 ? fmtShort(row.contribution, sym) : "—"}
                          </td>
                        )}
                        <td className="py-2 pr-3 text-indigo-600 dark:text-indigo-400">{fmtShort(row.interest, sym)}</td>
                        {contribMode !== "none" && (
                          <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{fmtShort(Math.abs(row.totalAdditions), sym)}</td>
                        )}
                        <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{fmtShort(row.totalInterest, sym)}</td>
                        <td className="py-2 font-semibold text-slate-800 dark:text-white">{fmtShort(row.balance, sym)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                    <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 pr-3 font-semibold">Year</th>
                      {contribMode !== "none" && <th className="pb-2 pr-3 font-semibold capitalize">{contribMode === "additions" ? "Additions" : "Deductions"}</th>}
                      <th className="pb-2 pr-3 font-semibold">Interest</th>
                      {contribMode !== "none" && <th className="pb-2 pr-3 font-semibold">Total {contribMode === "additions" ? "Added" : "Deducted"}</th>}
                      <th className="pb-2 pr-3 font-semibold">Total Interest</th>
                      <th className="pb-2 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlySchedule.map((row) => (
                      <tr key={row.year} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-2.5 pr-3 font-medium text-slate-700 dark:text-slate-300">{row.year}</td>
                        {contribMode !== "none" && (
                          <td className={`py-2.5 pr-3 ${row.contributions > 0 ? "text-emerald-600 dark:text-emerald-400" : row.contributions < 0 ? "text-red-500" : "text-slate-400"}`}>
                            {row.contributions !== 0 ? fmtShort(Math.abs(row.contributions), sym) : "—"}
                          </td>
                        )}
                        <td className="py-2.5 pr-3 text-indigo-600 dark:text-indigo-400">{fmtShort(row.interest, sym)}</td>
                        {contribMode !== "none" && (
                          <td className="py-2.5 pr-3 text-slate-600 dark:text-slate-400">{fmtShort(Math.abs(row.totalAdditions), sym)}</td>
                        )}
                        <td className="py-2.5 pr-3 text-slate-600 dark:text-slate-400">{fmtShort(row.totalInterest, sym)}</td>
                        <td className="py-2.5 font-semibold text-slate-800 dark:text-white">{fmtShort(row.balance, sym)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Calculation Breakdown</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap leading-6">
{`${formulaLine1}
${formulaLine2}
${formulaLine3}
${formulaLine4}`}
            </pre>
            {contribMode !== "none" && (
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Note: The schedule below incorporates {contribMode} of {sym}{contribAmount} {contribFreq}. The formula above shows the base principal only.
              </p>
            )}
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`A = P(1 + rt)

Where:
  A = Final amount (principal + interest)
  P = Principal (initial amount)
  r = Annual interest rate as a decimal (e.g. 5% → 0.05)
  t = Time in years

Variations:
  Interest only:  I = P × r × t
  Principal:      P = A / (1 + rt)
  Rate:           r = (A/P − 1) / t
  Time:           t = (A/P − 1) / r`}
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
