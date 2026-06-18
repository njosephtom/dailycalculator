import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { generateLoanSchedule } from "../../utils/loanCalculator";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import BreakdownCard from "../../components/ui/BreakdownCard";

const CURRENCIES = { USD:"$", EUR:"€", GBP:"£", INR:"₹", JPY:"¥" };
const EXTRA_FREQ = [
  { value:"monthly",    label:"Monthly"    },
  { value:"quarterly",  label:"Quarterly"  },
  { value:"half-yearly",label:"Half-Yearly"},
  { value:"yearly",     label:"Yearly"     },
];
const FREQ_MONTHLY = { monthly:1, quarterly:3, "half-yearly":6, yearly:12 };

const fmt = (n, s="$") => isFinite(n) ? s + Math.abs(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : "—";

function addMonthsToDate(dateISO, n) {
  const d = new Date(dateISO);
  d.setMonth(d.getMonth() + n);
  return d.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});
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
  { q:"How do extra payments save money?", a:"Extra payments directly reduce your outstanding principal, which means less interest accrues in subsequent months. This shortens the loan term and reduces total interest paid, often by thousands of dollars." },
  { q:"What is a balloon payment?", a:"A balloon payment is a large lump-sum payment due at the end of a loan term. It's common in commercial loans and some mortgages when the regular payments don't fully amortize the loan." },
  { q:"What is APR vs. interest rate?", a:"The interest rate is the base cost of borrowing the principal. APR (Annual Percentage Rate) includes the interest rate plus fees and other costs, giving a more complete picture of the loan's total cost." },
];

export default function LoanCalculator() {
  const [currency,    setCurrency]    = useState("USD");
  const [loanAmt,     setLoanAmt]     = useState("25000");
  const [rate,        setRate]        = useState("6.5");
  const [termYears,   setTermYears]   = useState("5");
  const [termMonths,  setTermMonths]  = useState("0");
  const [startDate,   setStartDate]   = useState(new Date().toISOString().slice(0,10));
  const [extraAmt,    setExtraAmt]    = useState("0");
  const [extraFreq,   setExtraFreq]   = useState("monthly");
  const [fees,        setFees]        = useState("0");
  const [tab,         setTab]         = useState("monthly");

  const sym = CURRENCIES[currency] ?? "$";
  const currencyOpts = Object.keys(CURRENCIES).map(k=>({value:k,label:`${k} (${CURRENCIES[k]})`}));

  const totalMonths = (parseInt(termYears)||0)*12 + (parseInt(termMonths)||0);

  const extraMonthly = useMemo(() => {
    const ea = parseFloat(extraAmt)||0;
    const fm = FREQ_MONTHLY[extraFreq] ?? 1;
    return ea / fm;
  }, [extraAmt, extraFreq]);

  const result = useMemo(() => {
    const p = parseFloat(loanAmt)||0;
    const r = parseFloat(rate)||0;
    if (p <= 0 || totalMonths <= 0) return null;
    return generateLoanSchedule(p, r, totalMonths, extraMonthly);
  }, [loanAmt, rate, totalMonths, extraMonthly]);

  const totalFees   = parseFloat(fees)||0;
  const totalRepay  = result ? result.basePmt * totalMonths + totalFees : 0;
  const payoffDate  = result ? addMonthsToDate(startDate, result.actualMonths) : "—";

  const scheduleData = tab === "yearly" ? result?.yearlySchedule ?? [] : result?.schedule ?? [];

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Loan Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate monthly payments, total interest, and see your full amortization schedule. Extra payments shorten your term.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectField label="Currency" id="cur" value={currency} onChange={setCurrency} options={currencyOpts}/>
              <InputField  label="Loan Amount" id="loan" value={loanAmt} onChange={setLoanAmt} prefix={sym} className="sm:col-span-2"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Annual Interest Rate" id="rate" value={rate} onChange={setRate} suffix="%"/>
              <InputField label="Years"  id="ty" value={termYears}  onChange={setTermYears}  min="0"/>
              <InputField label="Months" id="tm" value={termMonths} onChange={setTermMonths} min="0" max="11"/>
            </div>
            <InputField label="Loan Start Date" id="start" type="date" value={startDate} onChange={setStartDate}/>

            {/* Extra payments */}
            <div>
              <SectionLabel text="Additional Payments" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Extra Payment Amount" id="extra" value={extraAmt} onChange={setExtraAmt} prefix={sym}/>
                <SelectField label="Frequency" id="ef" value={extraFreq} onChange={setExtraFreq} options={EXTRA_FREQ}/>
              </div>
            </div>

            {/* Fees */}
            <div>
              <SectionLabel text="Fees" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Extra Fees / Closing Costs" id="fees" value={fees} onChange={setFees} prefix={sym}/>
              </div>
            </div>
          </div>

          {/* 3-col metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Monthly Payment</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmt(result?.basePmt, sym)}</p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Total Interest</p>
              <p className="text-xl font-extrabold text-rose-700 dark:text-rose-300 leading-tight">{fmt(result?.totalInterest, sym)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Repayment</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt(totalRepay, sym)}</p>
            </div>
          </div>

          {/* 2-col metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Payoff Date</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{payoffDate}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Loan Term</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{result?.actualMonths ?? 0} months</p>
            </div>
          </div>

          {/* Breakdown */}
          {result && (() => {
            const loanPrincipal = parseFloat(loanAmt) || 0;
            const total = loanPrincipal + result.totalInterest;
            const pp = total > 0 ? (loanPrincipal / total) * 100 : 50;
            return (
              <BreakdownCard
                primaryPct={pp}
                secondaryPct={100 - pp}
                primaryAmount={loanPrincipal}
                secondaryAmount={result.totalInterest}
                primaryLabel="Principal"
                secondaryLabel="Interest"
                sym={sym}
                schedule={result.yearlySchedule?.map(r => ({ year: r.year, totalBalance: r.balance, interestEarned: r.interest }))}
              />
            );
          })()}
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* Repayment Schedule table — wrapped in scrollable container */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="text-indigo-500"/>
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Repayment Schedule</h2>
              </div>
              <div className="flex gap-2">
                {[{ v:"monthly", l:"Monthly" }, { v:"yearly", l:"Yearly" }].map(o => (
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
              <table className="w-full text-sm min-w-[460px]">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">{tab==="yearly"?"Year":"Month"}</th>
                    <th className="pb-2 pr-4 font-semibold">Principal</th>
                    <th className="pb-2 pr-4 font-semibold">Interest</th>
                    <th className="pb-2 pr-4 font-semibold">Total Interest</th>
                    <th className="pb-2 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row,i)=>(
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-2 pr-4 font-medium text-slate-600 dark:text-slate-400">{row.year ?? row.month}</td>
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{fmt(row.principal, sym)}</td>
                      <td className="py-2 pr-4 text-rose-600 dark:text-rose-400">{fmt(row.interest, sym)}</td>
                      <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{fmt(row.totalInterest, sym)}</td>
                      <td className="py-2 font-semibold text-slate-800 dark:text-white">{fmt(row.balance, sym)}</td>
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
{`PMT = P × r / (1 − (1 + r)^−n)

P = loan amount
r = monthly rate (annual ÷ 12)
n = total months`}
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
