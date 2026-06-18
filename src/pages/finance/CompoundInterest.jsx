import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import BreakdownCard from "../../components/ui/BreakdownCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import katex from "katex";

const CURRENCIES = { USD:"$", EUR:"€", GBP:"£", INR:"₹", JPY:"¥" };
const CUR_OPTS   = Object.entries(CURRENCIES).map(([k,v])=>({ value:k, label:`${v} ${k}` }));

const COMP_FREQ_MAP = {
  daily:         365,
  weekly:         52,
  "bi-weekly":    26,
  "semi-monthly": 24,
  monthly:        12,
  quarterly:       4,
  "semi-annually": 2,
  annually:        1,
};
const COMP_OPTS = Object.keys(COMP_FREQ_MAP).map(k=>({ value:k, label:k.charAt(0).toUpperCase()+k.slice(1) }));

const DEP_FREQ_MAP = { monthly:12, quarterly:4, "semi-annually":2, annually:1 };
const DEP_OPTS = Object.keys(DEP_FREQ_MAP).map(k=>({ value:k, label:k.charAt(0).toUpperCase()+k.slice(1) }));

const CONTRIB_MODES = [{ v:"none", l:"None" }, { v:"deposit", l:"Deposits" }, { v:"withdraw", l:"Withdrawals" }];

function fmtC(sym, n) {
  if (!isFinite(n)) return "—";
  return sym + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
}

function calcCompound({ principal, annualRate, compFreqKey, totalMonths, contribMode, contribAmt, contribFreqKey }) {
  const n     = COMP_FREQ_MAP[compFreqKey] ?? 12;
  const r     = annualRate / 100;
  const df    = DEP_FREQ_MAP[contribFreqKey] ?? 12;
  const monthsPerDeposit = 12 / df;
  const sign  = contribMode === "withdraw" ? -1 : contribMode === "deposit" ? 1 : 0;
  let balance = principal;
  const schedule = [];
  let totalContrib = 0;

  for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
    const monthsInYear = Math.min(12, totalMonths - (year - 1) * 12);
    let yearlyContrib = 0;
    let yearlyInterest = 0;

    for (let m = 1; m <= monthsInYear; m++) {
      const absMonth = (year - 1) * 12 + m;
      const monthlyInterest = balance * (r / n) * (n / 12);
      yearlyInterest += monthlyInterest;
      balance += monthlyInterest;
      if (sign !== 0 && absMonth % monthsPerDeposit < 1) {
        const delta = sign * contribAmt;
        balance += delta;
        yearlyContrib += Math.abs(delta);
        totalContrib  += Math.abs(delta);
      }
    }

    schedule.push({
      year,
      yearlyContrib,
      interestEarned: yearlyInterest,
      totalBalance: balance,
    });
  }

  const totalDeposits = principal + (sign === 1 ? totalContrib : 0);
  const effectiveAPY  = Math.pow(1 + r / n, n) - 1;
  const yearsToDouble = r > 0 ? Math.log(2) / (n * Math.log(1 + r / n)) : Infinity;

  return {
    finalBalance: balance,
    totalDeposits,
    totalInterest: balance - totalDeposits,
    totalWithdrawn: sign === -1 ? totalContrib : 0,
    effectiveAPY,
    yearsToDouble,
    schedule,
  };
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
  { q:"What is compound interest?", a:"Compound interest is interest calculated on both the initial principal and the accumulated interest from prior periods. Unlike simple interest, it grows exponentially over time." },
  { q:"How does compounding frequency affect returns?", a:"More frequent compounding produces higher effective returns because interest is reinvested sooner. Daily vs. monthly compounding has a small but real difference at high balances or over long periods." },
  { q:"What is the Rule of 72?", a:"Divide 72 by your annual interest rate to estimate how long it takes your money to double. At 7%, money doubles in roughly 10.3 years (72 ÷ 7 ≈ 10.3)." },
];

const FORMULAS = [
  { label: null, tex: "A = P\\left(1 + \\frac{r}{n}\\right)^{nt} + PMT \\times \\frac{\\left(1 + \\frac{r}{n}\\right)^{nt} - 1}{\\;\\frac{r}{n}\\;}" },
  { label: "Where:", defs: [
    ["A",   "Final amount"],
    ["P",   "Principal"],
    ["r",   "Annual rate (decimal)"],
    ["n",   "Compounding frequency per year"],
    ["t",   "Time in years"],
    ["PMT", "Regular deposit amount"],
  ]},
  { label: null, tex: "\\text{Effective APY} = \\left(1 + \\frac{r}{n}\\right)^{n} - 1" },
  { label: null, tex: "\\text{Time to double} = \\frac{\\ln(2)}{n \\times \\ln\\!\\left(1 + \\frac{r}{n}\\right)}" },
];

function renderTex(tex) {
  return { __html: katex.renderToString(tex, { throwOnError: false, displayMode: true }) };
}

function FormulaCard() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-4 overflow-x-auto">
        {FORMULAS.map((f, i) => {
          if (f.tex) {
            return <div key={i} dangerouslySetInnerHTML={renderTex(f.tex)} />;
          }
          if (f.defs) {
            return (
              <div key={i}>
                <p className="text-xs italic text-slate-500 dark:text-slate-400 mb-1 font-sans">{f.label}</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs pl-2 font-sans">
                  {f.defs.map(([sym, desc]) => (
                    <React.Fragment key={sym}>
                      <span className="font-semibold italic text-slate-700 dark:text-slate-200">{sym}</span>
                      <span className="text-slate-500 dark:text-slate-400">= {desc}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default function CompoundInterest() {
  const [currency,    setCurrency]    = useState("USD");
  const [principal,   setPrincipal]   = useState("10000");
  const [rate,        setRate]        = useState("7");
  const [compFreq,    setCompFreq]    = useState("monthly");
  const [years,       setYears]       = useState("10");
  const [months,      setMonths]      = useState("0");
  const [contribMode, setContribMode] = useState("deposit");
  const [contribAmt,  setContribAmt]  = useState("200");
  const [contribFreq, setContribFreq] = useState("monthly");

  const sym = CURRENCIES[currency];

  const result = useMemo(() => calcCompound({
    principal:    parseFloat(principal)  || 0,
    annualRate:   parseFloat(rate)       || 0,
    compFreqKey:  compFreq,
    totalMonths:  (parseInt(years)||0)*12 + (parseInt(months)||0),
    contribMode,
    contribAmt:   parseFloat(contribAmt) || 0,
    contribFreqKey: contribFreq,
  }), [principal, rate, compFreq, years, months, contribMode, contribAmt, contribFreq]);

  const principalPct = result.finalBalance > 0
    ? Math.max(0, Math.min(100, (result.totalDeposits / result.finalBalance) * 100))
    : 50;
  const interestPct = Math.max(0, 100 - principalPct);

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Compound Interest Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              See how your savings grow with compound interest, regular deposits or withdrawals, and different compounding frequencies.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField  label="Currency"             id="cur"  value={currency}  onChange={setCurrency}  options={CUR_OPTS}/>
              <InputField   label="Initial Amount"        id="p"    value={principal} onChange={setPrincipal} prefix={sym} autoFocus/>
              <InputField   label="Annual Interest Rate"  id="rate" value={rate}      onChange={setRate}      suffix="%"/>
              <SelectField  label="Compounding Frequency" id="cf"   value={compFreq}  onChange={setCompFreq}  options={COMP_OPTS}/>
              <InputField   label="Years"                 id="yrs"  value={years}     onChange={setYears}     min="0"/>
              <InputField   label="Additional Months"     id="mos"  value={months}    onChange={setMonths}    min="0" max="11"/>
            </div>

            <div>
              <SectionLabel text="Contributions" />
              <div className="flex gap-2">
                {CONTRIB_MODES.map(o => (
                  <button key={o.v} onClick={() => setContribMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      contribMode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
              {contribMode !== "none" && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <InputField  label={`${contribMode==="withdraw"?"Withdrawal":"Deposit"} Amount`} id="ca" value={contribAmt} onChange={setContribAmt} prefix={sym}/>
                  <SelectField label="Frequency" id="df" value={contribFreq} onChange={setContribFreq} options={DEP_OPTS}/>
                </div>
              )}
            </div>
          </div>

          {/* 3-col metric cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Final Balance</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmtC(sym, result.finalBalance)}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Total Principal</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmtC(sym, result.totalDeposits)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Interest Earned</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmtC(sym, result.totalInterest)}</p>
            </div>
          </div>

          {/* 2-col metric cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Effective APY</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{(result.effectiveAPY * 100).toFixed(4)}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Time to Double</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{isFinite(result.yearsToDouble) ? result.yearsToDouble.toFixed(1) + " yrs" : "—"}</p>
            </div>
          </div>

          {/* Breakdown visualization */}
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

          {/* Yearly schedule table — scrollable */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Yearly Growth Schedule</h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm min-w-[340px]">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Year</th>
                    {contribMode !== "none" && <th className="pb-2 pr-4 font-semibold">{contribMode === "withdraw" ? "Withdrawals" : "Deposits"}</th>}
                    <th className="pb-2 pr-4 font-semibold">Interest</th>
                    <th className="pb-2 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map(row => (
                    <tr key={row.year} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-300">{row.year}</td>
                      {contribMode !== "none" && <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{fmtC(sym, row.yearlyContrib)}</td>}
                      <td className="py-2.5 pr-4 text-emerald-600 dark:text-emerald-400">{fmtC(sym, row.interestEarned)}</td>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-white">{fmtC(sym, row.totalBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <FormulaCard />
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
