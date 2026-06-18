import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import InputField from "../../components/ui/InputField";
import { calculateDiscount } from "../../utils/discountCalculator";

/* ── local helpers ─────────────────────────────────── */

const fmt = (n) =>
  isFinite(n)
    ? "$" +
      Math.abs(n).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";

const pct = (n) =>
  isFinite(n) ? n.toFixed(2).replace(/\.?0+$/, "") + "%" : "—";

function SectionLabel({ text }) {
  return (
    <div className="mb-3">
      <span className="inline-block border border-slate-300 dark:border-slate-600 rounded px-2 py-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {text}
        </span>
      </span>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button
        className="w-full flex items-center justify-between py-3 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp size={14} className="shrink-0 ml-2 text-slate-400" />
        ) : (
          <ChevronDown size={14} className="shrink-0 ml-2 text-slate-400" />
        )}
      </button>
      {open && (
        <p className="pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

/* ── constants ─────────────────────────────────────── */

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 50];

const FAQS = [
  {
    q: "How do discounts and sales tax interact?",
    a: "In most US states and many countries, sales tax is calculated on the discounted price — the amount you actually pay. This means a discount reduces both the base cost and the tax you owe, giving you slightly more savings than just the discount percentage alone.",
  },
  {
    q: "Does it matter whether tax is applied before or after a discount?",
    a: "Yes. The standard (and most common) method is to apply tax after the discount, so you only pay tax on the reduced price. If tax is applied before the discount, you pay more because the tax is calculated on the full original price. Some jurisdictions or specific transactions may vary.",
  },
  {
    q: "How do I calculate my total savings from a discount?",
    a: "Total savings = (Original price + tax on original) minus (Discounted price + tax on discounted price). This captures both the direct discount and the tax you avoid. The 'You save X% overall' figure shown above expresses this as a percentage of what you would have paid without any discount.",
  },
];

/* ── component ─────────────────────────────────────── */

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("100");
  const [discountPct, setDiscountPct] = useState("20");
  const [taxRate, setTaxRate] = useState("8.25");
  const [taxMode, setTaxMode] = useState("after"); // "after" | "before"

  const result = useMemo(
    () =>
      calculateDiscount({
        originalPrice: parseFloat(originalPrice) || 0,
        discountPct: parseFloat(discountPct) || 0,
        taxRate: parseFloat(taxRate) || 0,
        taxMode,
      }),
    [originalPrice, discountPct, taxRate, taxMode]
  );

  /* ── step-by-step breakdown ──────────────────────── */
  const steps = useMemo(() => {
    const price = parseFloat(originalPrice) || 0;
    const disc = parseFloat(discountPct) || 0;
    const tax = parseFloat(taxRate) || 0;

    if (taxMode === "before") {
      return [
        { label: "Original price", value: fmt(price) },
        {
          label: `Sales tax (${pct(tax)} on ${fmt(price)})`,
          value: `+ ${fmt(price * (tax / 100))}`,
        },
        {
          label: "Price + tax",
          value: fmt(price + price * (tax / 100)),
        },
        {
          label: `Discount (${pct(disc)} of ${fmt(price)})`,
          value: `- ${fmt(price * (disc / 100))}`,
        },
        { label: "Final price", value: fmt(result.finalPrice), bold: true },
      ];
    }
    return [
      { label: "Original price", value: fmt(price) },
      {
        label: `Discount (${pct(disc)} of ${fmt(price)})`,
        value: `- ${fmt(price * (disc / 100))}`,
      },
      { label: "Price after discount", value: fmt(result.priceAfterDiscount) },
      {
        label: `Sales tax (${pct(tax)} on ${fmt(result.priceAfterDiscount)})`,
        value: `+ ${fmt(result.taxAmount)}`,
      },
      { label: "Final price", value: fmt(result.finalPrice), bold: true },
    ];
  }, [originalPrice, discountPct, taxRate, taxMode, result]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* ── LEFT COLUMN ──────────────────────────── */}
        <div className="space-y-4">
          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Discount &amp; Sales Tax Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate the final price after applying a discount and sales tax.
              See how much you save instantly.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <InputField
              label="Original Price"
              value={originalPrice}
              onChange={setOriginalPrice}
              prefix="$"
              placeholder="0.00"
              min={0}
              autoFocus
            />

            <div>
              <InputField
                label="Discount"
                value={discountPct}
                onChange={setDiscountPct}
                suffix="%"
                placeholder="0"
                min={0}
                max={100}
              />
              {/* Quick preset buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {DISCOUNT_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setDiscountPct(String(p))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      parseFloat(discountPct) === p
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <InputField
              label="Sales Tax Rate"
              value={taxRate}
              onChange={setTaxRate}
              suffix="%"
              placeholder="0"
              min={0}
            />

            {/* Tax mode toggle */}
            <div>
              <SectionLabel text="Tax Application Order" />
              <div className="flex gap-2">
                {[
                  { v: "after", l: "Tax after discount" },
                  { v: "before", l: "Tax before discount" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => setTaxMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      taxMode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {taxMode === "after"
                  ? "Standard method — tax is calculated on the discounted price."
                  : "Tax is calculated on the original price, then the discount is subtracted."}
              </p>
            </div>
          </div>

          {/* Result metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Discount Amount
              </p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                {fmt(result.discountAmount)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Price After Discount
              </p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                {fmt(result.priceAfterDiscount)}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                Tax Amount
              </p>
              <p className="text-xl font-extrabold text-amber-700 dark:text-amber-300 leading-tight">
                {fmt(result.taxAmount)}
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                Final Price
              </p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">
                {fmt(result.finalPrice)}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                Total Savings
              </p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {fmt(result.totalSavings)}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                You Save
              </p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {pct(result.savingsPct)}
              </p>
            </div>
          </div>

          {/* Step-by-step breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Step-by-Step Breakdown
            </h2>
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li
                  key={i}
                  className={`flex items-center justify-between text-sm ${
                    s.bold
                      ? "font-bold text-slate-800 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2 mt-1"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {i + 1}
                    </span>
                    {s.label}
                  </span>
                  <span className="font-mono tabular-nums">{s.value}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────── */}
        <div className="space-y-4">
          {/* Comparison table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              With Discount vs Without Discount
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold"></th>
                    <th className="pb-2 pr-4 font-semibold">Without Discount</th>
                    <th className="pb-2 font-semibold">With Discount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                      Base Price
                    </td>
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">
                      {fmt(result.originalPrice)}
                    </td>
                    <td className="py-2 text-slate-700 dark:text-slate-300">
                      {fmt(result.priceAfterDiscount)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                      Tax ({pct(result.taxRate)})
                    </td>
                    <td className="py-2 pr-4 text-amber-600 dark:text-amber-400">
                      {fmt(result.originalPrice * (result.taxRate / 100))}
                    </td>
                    <td className="py-2 text-amber-600 dark:text-amber-400">
                      {fmt(result.taxAmount)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50 font-semibold">
                    <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">
                      Total
                    </td>
                    <td className="py-2 pr-4 text-slate-800 dark:text-white">
                      {fmt(result.priceWithoutDiscount)}
                    </td>
                    <td className="py-2 text-indigo-600 dark:text-indigo-400">
                      {fmt(result.finalPrice)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                      Savings
                    </td>
                    <td className="py-2 pr-4 text-slate-400">—</td>
                    <td className="py-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {fmt(result.totalSavings)} ({pct(result.savingsPct)})
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Mathematical Formula
            </h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              {taxMode === "after"
                ? `Standard Method (Tax After Discount):

  Discount      = Original Price x Discount%
  After Discount = Original Price - Discount
  Tax Amount    = After Discount x Tax Rate
  Final Price   = After Discount + Tax Amount

  Total Savings = (Original + Tax on Original) - Final Price
  Savings %     = Total Savings / (Original + Tax on Original) x 100`
                : `Tax Before Discount Method:

  Tax Amount    = Original Price x Tax Rate
  Discount      = Original Price x Discount%
  Final Price   = Original Price + Tax Amount - Discount

  Total Savings = (Original + Tax on Original) - Final Price
  Savings %     = Total Savings / (Original + Tax on Original) x 100`}
            </pre>
          </div>
        </div>
      </div>

      {/* Full-width FAQ */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
          Frequently Asked Questions
        </h2>
        {FAQS.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </div>
  );
}
