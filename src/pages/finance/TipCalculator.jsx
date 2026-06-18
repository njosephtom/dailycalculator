import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { calcTipEven, calcTipCustom } from "../../utils/tipCalculator";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

const TIP_PRESETS = [10, 15, 18, 20, 25];

const fmt = (n) =>
  isFinite(n)
    ? "$" +
      n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";

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

const FAQS = [
  {
    q: "How much should I tip at a restaurant?",
    a: "In the United States, 15-20% is standard for sit-down restaurants. For exceptional service, 20-25% is appropriate. In other countries tipping customs vary widely — in Japan tipping can be considered rude, while in many European countries a 5-10% tip or rounding up is common.",
  },
  {
    q: "Should tip be calculated before or after tax?",
    a: "Traditionally, tip is calculated on the pre-tax subtotal of your bill. However, many people tip on the total including tax for simplicity. Either approach is acceptable — the difference is usually small.",
  },
  {
    q: "How do you split a bill fairly when people ordered different items?",
    a: 'Use the "Custom Split" mode in this calculator. Enter what each person ordered, and the tip will be distributed proportionally based on each person\'s subtotal. This ensures the person who ordered a salad isn\'t subsidizing someone else\'s steak dinner.',
  },
];

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState("100");
  const [tipPercent, setTipPercent] = useState("18");
  const [numPeople, setNumPeople] = useState("2");
  const [splitMode, setSplitMode] = useState("even"); // "even" | "custom"
  const [people, setPeople] = useState([
    { name: "Person 1", amount: "50" },
    { name: "Person 2", amount: "50" },
  ]);

  /* ---- even-split result ---- */
  const evenResult = useMemo(
    () => calcTipEven({ billAmount, tipPercent, numPeople }),
    [billAmount, tipPercent, numPeople]
  );

  /* ---- custom-split result ---- */
  const customResult = useMemo(
    () => calcTipCustom({ tipPercent, people }),
    [tipPercent, people]
  );

  const isCustom = splitMode === "custom";
  const tipAmount = isCustom ? customResult.tipAmount : evenResult.tipAmount;
  const totalWithTip = isCustom
    ? customResult.totalWithTip
    : evenResult.totalWithTip;
  const perPerson = isCustom ? null : evenResult.perPerson;

  /* ---- helpers for custom people list ---- */
  const updatePerson = (idx, field, val) => {
    setPeople((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: val } : p))
    );
  };
  const addPerson = () => {
    setPeople((prev) => [
      ...prev,
      { name: `Person ${prev.length + 1}`, amount: "0" },
    ]);
  };
  const removePerson = (idx) => {
    if (people.length <= 1) return;
    setPeople((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Tip Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate tip, split the bill evenly, or use custom splits based
              on what each person ordered.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            {/* Bill amount */}
            <InputField
              label="Bill Amount"
              id="bill"
              value={billAmount}
              onChange={setBillAmount}
              prefix="$"
              autoFocus
            />

            {/* Tip percentage + presets */}
            <div>
              <InputField
                label="Tip Percentage"
                id="tip"
                value={tipPercent}
                onChange={setTipPercent}
                suffix="%"
                min="0"
                max="100"
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {TIP_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(String(pct))}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      String(tipPercent) === String(pct)
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Split mode toggle */}
            <div>
              <SectionLabel text="Split Mode" />
              <div className="flex gap-2">
                {[
                  { v: "even", l: "Split Evenly" },
                  { v: "custom", l: "Custom Split" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => setSplitMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      splitMode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Even split — number of people */}
            {!isCustom && (
              <InputField
                label="Number of People"
                id="numPeople"
                value={numPeople}
                onChange={setNumPeople}
                min="1"
              />
            )}

            {/* Custom split — person list */}
            {isCustom && (
              <div>
                <SectionLabel text="Per-Person Amounts" />
                <div className="space-y-3">
                  {people.map((p, i) => (
                    <div key={i} className="flex items-end gap-2">
                      <InputField
                        label={i === 0 ? "Name" : undefined}
                        id={`name-${i}`}
                        type="text"
                        value={p.name}
                        onChange={(v) => updatePerson(i, "name", v)}
                        placeholder="Name"
                        className="flex-1"
                      />
                      <InputField
                        label={i === 0 ? "Subtotal" : undefined}
                        id={`amt-${i}`}
                        value={p.amount}
                        onChange={(v) => updatePerson(i, "amount", v)}
                        prefix="$"
                        className="flex-1"
                      />
                      <button
                        onClick={() => removePerson(i)}
                        disabled={people.length <= 1}
                        className="mb-0.5 p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Remove person"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addPerson}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    <Plus size={14} /> Add Person
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3-col metric cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                Tip Amount
              </p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {fmt(tipAmount)}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                Total with Tip
              </p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {fmt(totalWithTip)}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                {isCustom ? "People" : "Per Person"}
              </p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {isCustom ? people.length : fmt(perPerson)}
              </p>
            </div>
          </div>

          {/* Custom split breakdown */}
          {isCustom && customResult.breakdown.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Per-Person Breakdown
              </h2>
              <div className="space-y-3">
                {customResult.breakdown.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {fmt(p.subtotal)} + {fmt(p.tipShare)} tip
                      </p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {fmt(p.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Split summary table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Split Summary
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">
                      {isCustom ? "Person" : "#"}
                    </th>
                    <th className="pb-2 pr-4 font-semibold">Subtotal</th>
                    <th className="pb-2 pr-4 font-semibold">Tip Share</th>
                    <th className="pb-2 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {isCustom
                    ? customResult.breakdown.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-300">
                            {row.name}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                            {fmt(row.subtotal)}
                          </td>
                          <td className="py-2.5 pr-4 text-indigo-600 dark:text-indigo-400">
                            {fmt(row.tipShare)}
                          </td>
                          <td className="py-2.5 font-semibold text-slate-800 dark:text-white">
                            {fmt(row.total)}
                          </td>
                        </tr>
                      ))
                    : Array.from(
                        { length: Math.max(1, parseInt(numPeople) || 1) },
                        (_, i) => {
                          const ppl = Math.max(1, parseInt(numPeople) || 1);
                          const sub =
                            (parseFloat(billAmount) || 0) / ppl;
                          const tipShare = evenResult.tipAmount / ppl;
                          return (
                            <tr
                              key={i}
                              className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                              <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-300">
                                Person {i + 1}
                              </td>
                              <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                                {fmt(sub)}
                              </td>
                              <td className="py-2.5 pr-4 text-indigo-600 dark:text-indigo-400">
                                {fmt(tipShare)}
                              </td>
                              <td className="py-2.5 font-semibold text-slate-800 dark:text-white">
                                {fmt(evenResult.perPerson)}
                              </td>
                            </tr>
                          );
                        }
                      )}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-300 dark:border-slate-600">
                    <td className="py-2.5 pr-4 font-bold text-slate-700 dark:text-slate-300">
                      Total
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                      {fmt(
                        isCustom
                          ? customResult.subtotalSum
                          : parseFloat(billAmount) || 0
                      )}
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {fmt(tipAmount)}
                    </td>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-white">
                      {fmt(totalWithTip)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* How it works card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              How It Works
            </h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Even Split
                </p>
                <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Tip    = Bill x (Tip% / 100)
Total  = Bill + Tip
Each   = Total / People`}
                </pre>
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Custom Split
                </p>
                <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Subtotal Sum = Sum of all person amounts
Tip = Subtotal Sum x (Tip% / 100)
Person Tip = Tip x (Their Subtotal / Sum)
Person Total = Their Subtotal + Person Tip`}
                </pre>
              </div>
            </div>
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
