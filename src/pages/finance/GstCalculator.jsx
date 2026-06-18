import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import BreakdownCard from "../../components/ui/BreakdownCard";

const GST_SLABS = [0.25, 3, 5, 12, 18, 28];

function fmtINR(sym, n) {
  if (!isFinite(n)) return "—";
  return sym + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  { q: "What are the GST slabs in India?", a: "India has six GST slabs: 0.25% (rough precious stones), 3% (gold, silver), 5% (essential goods), 12% (processed foods, electronics), 18% (most goods and services), and 28% (luxury items, vehicles, tobacco)." },
  { q: "What is the difference between exclusive and inclusive GST?", a: "GST-exclusive price is the base price before tax — GST is added on top. GST-inclusive price is the final price the customer pays — GST is already embedded within it." },
  { q: "How do I remove GST from a total price?", a: "Divide the total by (1 + GST rate). For example, to remove 18% GST from ₹11,800: ₹11,800 ÷ 1.18 = ₹10,000 (base price) and ₹1,800 (GST)." },
];

const CURRENCY_SYMS = ["₹", "$", "€", "£", "¥"];

export default function GstCalculator() {
  const [mode,   setMode]   = useState("excluding"); // excluding | including
  const [amount, setAmount] = useState("10000");
  const [slab,   setSlab]   = useState(18);
  const [sym,    setSym]    = useState("₹");

  const result = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const r   = slab / 100;
    if (mode === "excluding") {
      const gst  = amt * r;
      const post = amt + gst;
      return { preGst: amt, gst, postGst: post };
    }
    // including: remove GST from total
    const pre = amt * (100 / (100 + slab));
    const gst = amt - pre;
    return { preGst: pre, gst, postGst: amt };
  }, [amount, slab, mode]);

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">GST Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Add or remove GST from any amount across all Indian tax slabs.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            {/* Mode toggle */}
            <div>
              <SectionLabel text="Mode" />
              <div className="flex gap-2">
                {[{ v: "excluding", l: "Excluding GST" }, { v: "including", l: "Including GST" }].map(o => (
                  <button key={o.v} onClick={() => setMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      mode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}>{o.l}</button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {mode === "excluding" ? "Enter the base price — GST will be added on top." : "Enter the total price that already includes GST — we'll extract the tax."}
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                {mode === "excluding" ? "Original Amount (excl. GST)" : "Total Amount (incl. GST)"}
              </label>
              <div className="flex gap-2">
                <select value={sym} onChange={e => setSym(e.target.value)}
                  className="py-2 px-2 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none dark:text-white">
                  {CURRENCY_SYMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
                  className="flex-1 py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>

            {/* GST slab */}
            <div>
              <SectionLabel text="GST Rate" />
              <div className="flex flex-wrap gap-2">
                {GST_SLABS.map(s => (
                  <button key={s} onClick={() => setSlab(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${slab === s ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"}`}>
                    {s}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3-col metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pre-GST Amount</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmtINR(sym, result.preGst)}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Post-GST Amount</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{fmtINR(sym, result.postGst)}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">GST ({slab}%)</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmtINR(sym, result.gst)}</p>
            </div>
          </div>

          {/* Breakdown */}
          {result.postGst > 0 && (
            <BreakdownCard
              title="Tax Breakdown"
              primaryLabel="Base Amount"
              secondaryLabel={`GST (${slab}%)`}
              primaryPct={(result.preGst / result.postGst) * 100}
              secondaryPct={(result.gst / result.postGst) * 100}
              primaryAmount={result.preGst}
              secondaryAmount={result.gst}
              sym={sym}
            />
          )}
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* All slabs reference table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              GST on {fmtINR(sym, parseFloat(amount) || 0)} across all slabs
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">GST Rate</th>
                    <th className="pb-2 pr-4 font-semibold">Tax Amount</th>
                    <th className="pb-2 font-semibold">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {GST_SLABS.map(s => {
                    const amt = parseFloat(amount) || 0;
                    const gst  = mode === "excluding" ? amt * (s / 100) : amt - amt * (100 / (100 + s));
                    const post = mode === "excluding" ? amt + gst : amt;
                    return (
                      <tr key={s} className={`border-b border-slate-100 dark:border-slate-700/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/20 ${slab === s ? "bg-indigo-50 dark:bg-indigo-900/20 font-semibold" : ""}`}
                        onClick={() => setSlab(s)}>
                        <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{s}%</td>
                        <td className="py-2 pr-4 text-amber-600 dark:text-amber-400">{fmtINR(sym, gst)}</td>
                        <td className="py-2 text-slate-800 dark:text-white">{fmtINR(sym, post)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-2">Click a row to switch to that slab</p>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Adding GST:
  GST Amount = Original Price × GST Rate
  Total Price = Original Price + GST Amount

Removing GST from a GST-inclusive price:
  Original Price = Total ÷ (1 + GST Rate)
  GST Amount = Total − Original Price`}
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
