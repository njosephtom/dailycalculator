import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { calculateAPR, autoPayment } from "../../utils/aprCalculator";
import { ChevronDown, ChevronUp } from "lucide-react";

const fmt2 = (n) => isFinite(n) ? n.toFixed(3) + "%" : "—";
const fmtUSD = (n) => isFinite(n) ? "$" + Math.abs(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : "—";

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
  { q:"What is APR and why does it differ from the interest rate?", a:"The interest rate is the base cost of borrowing. APR includes the interest rate plus fees (origination, closing costs, points), making it the true cost of the loan expressed annually. This lets you compare loans from different lenders fairly." },
  { q:"What is Effective APR?", a:"Effective APR accounts for compounding throughout the year, so it's slightly higher than the stated APR. It's also called the Annual Equivalent Rate (AER) and represents the true annualised cost if interest compounds monthly." },
  { q:"Is a lower APR always better?", a:"Generally yes — a lower APR means lower total cost. However, watch for loans with low APR but short terms that result in very high monthly payments, or loans with high upfront fees that make the long-term APR misleading if you plan to repay early." },
];

export default function AprCalculator() {
  const [loanAmt,  setLoanAmt]  = useState("20000");
  const [fees,     setFees]     = useState("500");
  const [termMos,  setTermMos]  = useState("60");
  const [annRate,  setAnnRate]  = useState("6");
  const [useRate,  setUseRate]  = useState(true); // true = enter rate, false = enter payment
  const [custPmt,  setCustPmt]  = useState("");

  const monthlyPmt = useMemo(() => {
    const p = parseFloat(loanAmt)||0;
    const r = parseFloat(annRate)||0;
    const n = parseInt(termMos)||1;
    if (useRate) return autoPayment(p, r, n);
    return parseFloat(custPmt)||0;
  }, [loanAmt, annRate, termMos, useRate, custPmt]);

  const result = useMemo(() => {
    const p   = parseFloat(loanAmt)||0;
    const f   = parseFloat(fees)||0;
    const n   = parseInt(termMos)||1;
    if (monthlyPmt <= 0 || p <= 0) return null;
    return calculateAPR({ loanAmount:p, fees:f, termMonths:n, monthlyPmt });
  }, [loanAmt, fees, termMos, monthlyPmt]);

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">APR Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate the Annual Percentage Rate (APR) of a loan including fees and closing costs.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Loan Amount"          id="la" value={loanAmt} onChange={setLoanAmt} prefix="$" autoFocus/>
              <InputField label="Fees / Closing Costs" id="fe" value={fees}    onChange={setFees}    prefix="$"/>
              <InputField label="Loan Term (months)"   id="tm" value={termMos} onChange={setTermMos} min="1"/>
            </div>

            <div>
              <SectionLabel text="Payment Source" />
              <div className="flex gap-2">
                {[{ v:true, l:"Enter Interest Rate" }, { v:false, l:"Enter Monthly Payment" }].map(o => (
                  <button key={String(o.v)} onClick={() => setUseRate(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      useRate === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
              <div className="mt-3">
                {useRate
                  ? <InputField label="Annual Interest Rate" id="ar" value={annRate} onChange={setAnnRate} suffix="%"/>
                  : <InputField label="Monthly Payment"      id="cp" value={custPmt} onChange={setCustPmt} prefix="$"/>
                }
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Calculated monthly payment: <span className="font-semibold text-slate-600 dark:text-slate-300">{fmtUSD(monthlyPmt)}</span>
              </p>
            </div>
          </div>

          {/* 3-col metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">APR</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmt2(result?.apr)}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Effective APR</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmt2(result?.effectiveAPR)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nominal Rate</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt2(result?.nominalRate)}</p>
            </div>
          </div>

          {/* 2-col metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Monthly Payment</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmtUSD(monthlyPmt)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Repayment</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmtUSD(result?.totalRepayment)}</p>
            </div>
          </div>

          {/* Rate Comparison bar chart */}
          {result && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Rate Comparison</h2>
              <div className="space-y-2 text-sm">
                {[
                  { label:"Nominal Interest Rate (no fees)", value:result.nominalRate },
                  { label:"APR (includes fees)",             value:result.apr          },
                  { label:"Effective APR (compounded)",      value:result.effectiveAPR },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400 w-52 shrink-0">{r.label}</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{width:`${Math.min(100, r.value * 4)}%`}}/>
                    </div>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 w-16 text-right">{fmt2(r.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Formula */}
        <div className="space-y-4">
          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`APR = r × 12 (where r is the monthly rate that satisfies)
Net Loan = PMT × (1 − (1+r)^−n) / r

Net Loan = Loan Amount − Upfront Fees
PMT = Monthly payment, n = loan term in months`}
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
