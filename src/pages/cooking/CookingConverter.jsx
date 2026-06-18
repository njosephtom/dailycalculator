import React, { useState, useMemo } from "react";
import { convertCooking } from "../../utils/cookingConversions";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { ClipboardList, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const UNIT_OPTIONS = [
  { value: "cups",         label: "Cups" },
  { value: "grams",        label: "Grams" },
  { value: "tablespoons",  label: "Tablespoons" },
  { value: "teaspoons",    label: "Teaspoons" },
  { value: "milliliters",  label: "Milliliters" },
  { value: "ounces",       label: "Fluid Ounces" },
];

const INGREDIENT_OPTIONS = [
  { value: "flour",  label: "All-Purpose Flour" },
  { value: "sugar",  label: "Granulated Sugar" },
  { value: "butter", label: "Butter" },
  { value: "water",  label: "Water" },
];

function fmtResult(n) {
  if (n === null || !isFinite(n)) return "—";
  if (Math.abs(n) >= 100)  return n.toFixed(1);
  if (Math.abs(n) >= 10)   return n.toFixed(2);
  return n.toFixed(3);
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
  { q: "Why does the ingredient matter for conversions?", a: "Different ingredients have different densities. One cup of flour weighs about 120g while one cup of water weighs 240g. The ingredient selector adjusts the density so mass-to-volume conversions are accurate." },
  { q: "Are fluid ounces and weight ounces the same?", a: "No. Fluid ounces measure volume (≈29.57 ml each), while weight ounces measure mass (≈28.35 g each). This converter uses fluid ounces for volume-based conversions." },
  { q: "How do I convert tablespoons to cups?", a: "There are 16 tablespoons in 1 cup. So divide your tablespoon count by 16. This tool handles that automatically." },
];

export default function CookingConverter() {
  const [value,      setValue]      = useState("1");
  const [fromUnit,   setFromUnit]   = useState("cups");
  const [toUnit,     setToUnit]     = useState("grams");
  const [ingredient, setIngredient] = useState("flour");
  const [history,    setHistory]    = useState([]);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    return convertCooking(v, fromUnit, toUnit, ingredient);
  }, [value, fromUnit, toUnit, ingredient]);

  function saveToHistory() {
    if (result === null) return;
    const ingredientLabel = INGREDIENT_OPTIONS.find((o) => o.value === ingredient)?.label ?? ingredient;
    const entry = `${value} ${fromUnit} of ${ingredientLabel} → ${fmtResult(result)} ${toUnit}`;
    setHistory((h) => [entry, ...h].slice(0, 10));
  }

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Cooking Converter</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convert kitchen measurements with ingredient-specific density adjustments.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField    label="Amount"    id="amount"     value={value}    onChange={setValue}    placeholder="e.g. 2" />
              <SelectField   label="From Unit" id="from-unit"  value={fromUnit} onChange={setFromUnit} options={UNIT_OPTIONS} />
              <SelectField   label="To Unit"   id="to-unit"    value={toUnit}   onChange={setToUnit}   options={UNIT_OPTIONS} />
            </div>
            <SelectField label="Ingredient" id="ingredient" value={ingredient} onChange={setIngredient} options={INGREDIENT_OPTIONS} />

            <button
              onClick={saveToHistory}
              disabled={result === null}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              Save to History
            </button>
          </div>

          {/* Result display */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-6 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">Result</p>
            <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
              {fmtResult(result)}{" "}
              <span className="text-xl font-medium text-indigo-500">{toUnit}</span>
            </p>
            <p className="text-xs text-indigo-400 mt-2">
              {value} {fromUnit} of {INGREDIENT_OPTIONS.find((o) => o.value === ingredient)?.label}
            </p>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList size={15} className="text-indigo-500" />
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Calculation History</h2>
                </div>
                <button onClick={() => setHistory([])} className="text-slate-400 hover:text-red-500 transition-colors" aria-label="Clear history">
                  <Trash2 size={14} />
                </button>
              </div>
              <ul className="space-y-1">
                {history.map((h, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0 font-mono">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — How to Use + Formula */}
        <div className="space-y-4">

          {/* How to Calculate card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">How to Use</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Enter your amount, choose the source and target units, select the ingredient for density-aware conversions, and the result updates instantly. Save conversions to history for reference.
            </p>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Volume ↔ Volume: Convert via milliliters as base unit
Volume → Mass: Grams = (ml / ml-per-cup) × density(g/cup)
Mass → Volume: Cups = Grams / density(g/cup)

Example densities:
  All-Purpose Flour: 120 g/cup
  Granulated Sugar:  200 g/cup
  Butter:            227 g/cup
  Water:             240 g/cup`}
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
