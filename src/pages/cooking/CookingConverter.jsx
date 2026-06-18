import React, { useState, useMemo } from "react";
import { convertCooking } from "../../utils/cookingConversions";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { ClipboardList, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";

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
  { value: "milk",   label: "Milk" },
  { value: "oil",    label: "Cooking Oil" },
  { value: "honey",  label: "Honey" },
  { value: "rice",   label: "Rice (uncooked)" },
  { value: "cocoa",  label: "Cocoa Powder" },
  { value: "salt",   label: "Salt" },
];

const DENSITIES_EXTRA = {
  milk: 245, oil: 218, honey: 340, rice: 185, cocoa: 86, salt: 292,
};

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
  { q: "How does recipe scaling work?", a: "Enter your original recipe serving count and desired servings. All ingredient amounts are multiplied by the ratio (desired ÷ original). For example, scaling a 4-person recipe to 6 people multiplies everything by 1.5×." },
];

function scaleValue(val, ratio) {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  const scaled = n * ratio;
  if (scaled === Math.round(scaled)) return String(Math.round(scaled));
  return scaled.toFixed(2).replace(/\.?0+$/, "");
}

export default function CookingConverter() {
  const [mode, setMode] = useState("convert");

  // ── Unit Converter state ──
  const [value,      setValue]      = useState("1");
  const [fromUnit,   setFromUnit]   = useState("cups");
  const [toUnit,     setToUnit]     = useState("grams");
  const [ingredient, setIngredient] = useState("flour");
  const [history,    setHistory]    = useState([]);

  // ── Recipe Scaler state ──
  const [origServings, setOrigServings] = useState("4");
  const [newServings,  setNewServings]  = useState("6");
  const [ingredients,  setIngredients]  = useState([
    { name: "All-purpose flour", amount: "2", unit: "cups" },
    { name: "Sugar", amount: "1", unit: "cups" },
    { name: "Butter", amount: "0.5", unit: "cups" },
    { name: "Eggs", amount: "3", unit: "whole" },
  ]);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    return convertCooking(v, fromUnit, toUnit, ingredient);
  }, [value, fromUnit, toUnit, ingredient]);

  const scaleRatio = useMemo(() => {
    const orig = parseFloat(origServings) || 1;
    const target = parseFloat(newServings) || 1;
    return target / orig;
  }, [origServings, newServings]);

  function saveToHistory() {
    if (result === null) return;
    const ingredientLabel = INGREDIENT_OPTIONS.find((o) => o.value === ingredient)?.label ?? ingredient;
    const entry = `${value} ${fromUnit} of ${ingredientLabel} → ${fmtResult(result)} ${toUnit}`;
    setHistory((h) => [entry, ...h].slice(0, 10));
  }

  function updateIngredient(index, field, val) {
    setIngredients(prev => prev.map((item, i) => i === index ? { ...item, [field]: val } : item));
  }

  function addIngredient() {
    setIngredients(prev => [...prev, { name: "", amount: "", unit: "cups" }]);
  }

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Cooking Unit Converter</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convert kitchen measurements with ingredient-specific density, or scale entire recipes up and down.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2">
            {[{ v: "convert", l: "Unit Converter" }, { v: "scale", l: "Recipe Scaler" }].map(o => (
              <button key={o.v} onClick={() => setMode(o.v)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  mode === o.v
                    ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                    : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                }`}>{o.l}</button>
            ))}
          </div>

          {/* ── UNIT CONVERTER MODE ── */}
          {mode === "convert" && (
            <>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField label="Amount" id="amount" value={value} onChange={setValue} placeholder="e.g. 2" autoFocus />
                  <SelectField label="From Unit" id="from-unit" value={fromUnit} onChange={setFromUnit} options={UNIT_OPTIONS} />
                  <SelectField label="To Unit" id="to-unit" value={toUnit} onChange={setToUnit} options={UNIT_OPTIONS} />
                </div>
                <SelectField label="Ingredient" id="ingredient" value={ingredient} onChange={setIngredient} options={INGREDIENT_OPTIONS} />
                <button onClick={saveToHistory} disabled={result === null}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors">
                  Save to History
                </button>
              </div>

              {/* Result */}
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

              {/* Quick conversions table */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Quick Conversions</h2>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  {[
                    ["1 cup", "236.6 ml"], ["1 tbsp", "14.8 ml"], ["1 tsp", "4.9 ml"],
                    ["1 fl oz", "29.6 ml"], ["1 cup flour", "120 g"], ["1 cup sugar", "200 g"],
                    ["1 cup butter", "227 g"], ["1 cup water", "240 g"], ["16 tbsp", "1 cup"],
                    ["3 tsp", "1 tbsp"], ["8 fl oz", "1 cup"], ["1 stick butter", "113 g"],
                  ].map(([from, to], i) => (
                    <div key={i} className="flex justify-between py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700/50">
                      <span className="font-medium">{from}</span>
                      <span className="text-slate-400">=</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{to}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList size={15} className="text-indigo-500" />
                      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">History</h2>
                    </div>
                    <button onClick={() => setHistory([])} className="text-slate-400 hover:text-red-500 transition-colors" aria-label="Clear history">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {history.map((h, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0 font-mono">{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* ── RECIPE SCALER MODE ── */}
          {mode === "scale" && (
            <>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Original Servings" id="orig" value={origServings} onChange={setOrigServings} min="1" autoFocus />
                  <InputField label="New Servings" id="new" value={newServings} onChange={setNewServings} min="1" />
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-3 text-center">
                  <span className="text-xs text-indigo-500 font-medium">Scale Factor: </span>
                  <span className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300">{scaleRatio.toFixed(2)}×</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ingredients</span>
                    <button onClick={addIngredient}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {ingredients.map((item, i) => (
                      <div key={i} className="flex items-end gap-2">
                        <div className="flex-1">
                          {i === 0 && <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Ingredient</label>}
                          <input
                            value={item.name}
                            onChange={(e) => updateIngredient(i, "name", e.target.value)}
                            placeholder="e.g. Flour"
                            className="w-full py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
                          />
                        </div>
                        <div className="w-20">
                          {i === 0 && <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Amount</label>}
                          <input
                            type="text"
                            inputMode="decimal"
                            value={item.amount}
                            onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                            placeholder="2"
                            className="w-full py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
                          />
                        </div>
                        <div className="w-24">
                          {i === 0 && <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Unit</label>}
                          <input
                            value={item.unit}
                            onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                            placeholder="cups"
                            className="w-full py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
                          />
                        </div>
                        {ingredients.length > 1 && (
                          <button onClick={() => removeIngredient(i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" aria-label="Remove">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scaled results */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Scaled Recipe ({newServings} servings)
                </h2>
                <div className="space-y-1">
                  {ingredients.filter(item => item.name.trim()).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 line-through">{item.amount} {item.unit}</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {scaleValue(item.amount, scaleRatio)} {item.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {ingredients.filter(item => item.name.trim()).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">Add ingredients above to see scaled amounts.</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* How to Use */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">How to Use</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {mode === "convert"
                ? "Enter an amount, choose source and target units, select the ingredient for density-aware conversions, and the result updates instantly. Save conversions to history for reference."
                : "Enter how many servings the original recipe makes and how many you want. Add each ingredient with its amount and unit. The scaled amounts are calculated automatically using the ratio."}
            </p>
          </div>

          {/* Common scaling reference */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Scaling Reference</h2>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-[1]">
                  <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-3 font-semibold">From → To</th>
                    <th className="pb-2 font-semibold">Factor</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["2 → 4 servings", "2×"], ["4 → 6 servings", "1.5×"], ["4 → 2 servings", "0.5×"],
                    ["6 → 8 servings", "1.33×"], ["4 → 8 servings", "2×"], ["8 → 4 servings", "0.5×"],
                    ["4 → 12 servings", "3×"], ["6 → 3 servings", "0.5×"], ["4 → 1 serving", "0.25×"],
                  ].map(([label, factor], i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{label}</td>
                      <td className="py-2 font-semibold text-indigo-600 dark:text-indigo-400">{factor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Formulas</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Unit Conversion:
  Volume ↔ Volume: value × (from_ml / to_ml)
  Volume → Mass:   (ml / 236.6) × density(g/cup)
  Mass → Volume:   (grams / density) × 236.6 ml

Recipe Scaling:
  Scale Factor = New Servings / Original Servings
  Scaled Amount = Original Amount × Scale Factor

Common Densities (g/cup):
  Flour: 120    Sugar: 200    Butter: 227
  Water: 240    Milk: 245     Oil: 218
  Honey: 340    Rice: 185     Salt: 292`}
            </pre>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH FAQ */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Frequently Asked Questions</h2>
        {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
      </div>
    </div>
  );
}
