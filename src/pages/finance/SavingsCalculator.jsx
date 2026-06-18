import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { calculateCompoundInterest } from "../../utils/compoundInterest";
import { ChevronDown, ChevronUp } from "lucide-react";
import BreakdownCard from "../../components/ui/BreakdownCard";

const CURRENCIES = { USD:"$", EUR:"€", GBP:"£", INR:"₹", JPY:"¥" };
const FREQ_OPTS = [
  { value:"Daily",      label:"Daily (365/yr)"    },
  { value:"Monthly",    label:"Monthly (12/yr)"   },
  { value:"Quarterly",  label:"Quarterly (4/yr)"  },
  { value:"Annually",   label:"Annually (1/yr)"   },
];
const CONTRIB_OPTS = [
  { value:"monthly",    label:"Monthly"    },
  { value:"quarterly",  label:"Quarterly"  },
  { value:"half-yearly",label:"Half-Yearly"},
  { value:"yearly",     label:"Yearly"     },
];
const CONTRIB_MONTHS = { monthly:1, quarterly:3, "half-yearly":6, yearly:12 };
const FREQ_N = { Daily:365, Monthly:12, Quarterly:4, Annually:1 };

const fmt = (n, s) => isFinite(n) ? s + Math.abs(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : "—";

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
  { q:"What is the difference between nominal rate and APY?", a:"The nominal rate is the stated annual rate without accounting for compounding. APY (Annual Percentage Yield) includes the effect of compounding and is always slightly higher than the nominal rate for the same account." },
  { q:"How often should I compound for the best return?", a:"More frequent compounding (daily vs annually) produces slightly higher returns. The difference is more pronounced over longer periods and at higher interest rates." },
  { q:"How does adding regular deposits help?", a:"Regular deposits amplify compound growth significantly. Even small monthly additions can dramatically increase your final balance because each deposit also earns compound interest over the remaining period." },
];

export default function SavingsCalculator() {
  const [currency,   setCurrency]   = useState("USD");
  const [principal,  setPrincipal]  = useState("5000");
  const [rateInput,  setRateInput]  = useState("5");
  const [rateMode,   setRateMode]   = useState("nominal"); // nominal | apy
  const [years,      setYears]      = useState("10");
  const [months,     setMonths]     = useState("0");
  const [freq,       setFreq]       = useState("Monthly");
  const [contMode,   setContMode]   = useState("none"); // none | deposits | withdrawals
  const [contAmt,    setContAmt]    = useState("200");
  const [contFreq,   setContFreq]   = useState("monthly");
  const [inflToggle, setInflToggle] = useState(false);
  const [inflRate,   setInflRate]   = useState("2.5");
  const [tab,        setTab]        = useState("yearly");

  const sym = CURRENCIES[currency] ?? "$";

  const annualRate = useMemo(() => {
    const r = parseFloat(rateInput) || 0;
    if (rateMode === "apy") {
      const n = FREQ_N[freq] ?? 12;
      return (Math.pow(1 + r / 100, 1 / n) - 1) * n * 100;
    }
    return r;
  }, [rateInput, rateMode, freq]);

  const result = useMemo(() => {
    const freqMonths = CONTRIB_MONTHS[contFreq] ?? 1;
    const totalMonths = (parseInt(years)||0)*12 + (parseInt(months)||0);
    const p = parseFloat(principal)||0;
    const ca = parseFloat(contAmt)||0;
    const ir = parseFloat(inflRate)||0;

    let effectiveMonthlyDeposit = 0;
    if (contMode !== "none" && ca > 0) {
      const monthlyFactor = 1 / freqMonths;
      const inflatedAvg = inflToggle
        ? ca * (1 + ir / 100 / 2)
        : ca;
      effectiveMonthlyDeposit = (contMode === "withdrawals" ? -1 : 1) * inflatedAvg * monthlyFactor;
    }

    return calculateCompoundInterest({
      principal: p,
      monthlyDeposit: effectiveMonthlyDeposit,
      annualRate,
      years:  parseInt(years)||0,
      months: parseInt(months)||0,
      compoundFrequency: freq,
    });
  }, [principal, annualRate, years, months, freq, contMode, contAmt, contFreq, inflToggle, inflRate]);

  const n = FREQ_N[freq] ?? 12;
  const nomRate = parseFloat(rateInput)||0;
  const apy = rateMode === "nominal"
    ? (Math.pow(1 + nomRate / 100 / n, n) - 1) * 100
    : nomRate;

  const principalPct = result.finalBalance > 0
    ? Math.min(100, (result.totalDeposits / result.finalBalance) * 100) : 50;
  const interestPct = 100 - principalPct;

  const currencyOpts = Object.keys(CURRENCIES).map(k => ({ value:k, label:`${k} (${CURRENCIES[k]})` }));

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Savings Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Project savings growth with compound interest and optional regular contributions.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectField label="Currency" id="cur" value={currency} onChange={setCurrency} options={currencyOpts} />
              <InputField  label="Initial Balance" id="principal" value={principal} onChange={setPrincipal} prefix={sym} className="sm:col-span-2"/>
            </div>

            {/* Rate */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Interest Rate</label>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <input type="number" value={rateInput} onChange={e=>setRateInput(e.target.value)}
                    className="w-28 py-2 pl-3 pr-7 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"/>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                </div>
                <div className="flex gap-2">
                  {[{ v:"nominal", l:"Nominal" }, { v:"apy", l:"APY/AER" }].map(o => (
                    <button key={o.v} onClick={() => setRateMode(o.v)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                        rateMode === o.v
                          ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                          : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                      }`}>{o.l}</button>
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {rateMode==="nominal" ? `APY: ${apy.toFixed(3)}%` : `Nominal: ${(parseFloat(rateInput)||0).toFixed(3)}%`}
                </span>
              </div>
            </div>

            {/* Compounding */}
            <SelectField label="Compounding Frequency" id="freq" value={freq} onChange={setFreq} options={FREQ_OPTS}/>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Years"  id="yrs" value={years}  onChange={setYears}  min="0"/>
              <InputField label="Months" id="mos" value={months} onChange={setMonths} min="0" max="11"/>
            </div>

            {/* Contributions */}
            <div>
              <SectionLabel text="Regular Contributions" />
              <div className="flex gap-2">
                {[{ v:"none", l:"None" }, { v:"deposits", l:"Deposits" }, { v:"withdrawals", l:"Withdrawals" }].map(o => (
                  <button key={o.v} onClick={() => setContMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      contMode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
              {contMode !== "none" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <InputField label={contMode==="deposits"?"Deposit Amount":"Withdrawal Amount"} id="ca" value={contAmt} onChange={setContAmt} prefix={sym}/>
                  <SelectField label="Frequency" id="cf" value={contFreq} onChange={setContFreq} options={CONTRIB_OPTS}/>
                </div>
              )}
            </div>

            {/* Inflation toggle */}
            {contMode === "deposits" && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={inflToggle} onChange={e=>setInflToggle(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600"/>
                <span className="text-sm text-slate-700 dark:text-slate-300">Increase deposits annually with inflation</span>
                {inflToggle && (
                  <div className="relative ml-2">
                    <input type="number" value={inflRate} onChange={e=>setInflRate(e.target.value)}
                      className="w-20 py-1.5 pl-2 pr-6 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                  </div>
                )}
              </label>
            )}
          </div>

          {/* 3-col metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Final Balance</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmt(result.finalBalance, sym)}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Total Interest</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmt(result.totalInterest, sym)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Deposited</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt(result.totalDeposits, sym)}</p>
            </div>
          </div>

          {/* 2-col metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Effective APY</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{apy.toFixed(3)}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Time Period</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{years}y {months}m</p>
            </div>
          </div>

          {/* Breakdown */}
          <BreakdownCard
            primaryPct={principalPct}
            secondaryPct={interestPct}
            primaryAmount={result.totalDeposits}
            secondaryAmount={result.totalInterest}
            sym={sym}
            schedule={result.schedule}
          />
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* Growth Schedule table — wrapped in scrollable container */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Growth Schedule</h2>
              <div className="flex gap-2">
                {[{ v:"yearly", l:"Yearly" }, { v:"monthly", l:"Monthly" }].map(o => (
                  <button key={o.v} onClick={() => setTab(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      tab === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm min-w-[420px]">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    {(tab==="yearly"?["Year","Deposits","Interest Earned","Balance"]:["Month","Deposits","Interest Earned","Balance"]).map(h=>(
                      <th key={h} className="pb-2 pr-4 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.slice(0, tab==="monthly"?120:undefined).map((row,i)=>(
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-2 pr-4 font-medium text-slate-600 dark:text-slate-400">{row.year ?? row.month}</td>
                      <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{fmt(row.yearlyDeposit, sym)}</td>
                      <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">{fmt(row.interestEarned, sym)}</td>
                      <td className="py-2 font-semibold text-slate-800 dark:text-white">{fmt(row.totalBalance, sym)}</td>
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
{`FV = P(1 + r/n)^(nt)

P = Principal, r = annual rate, n = compounds/year, t = years
APY = (1 + r/n)^n − 1`}
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
