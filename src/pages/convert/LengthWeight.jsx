import React, { useState, useCallback } from "react";
import { convert, lengthUnits, weightUnits } from "../../utils/unitConversions";
import SelectField from "../../components/ui/SelectField";
import { ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";

function ConverterPanel({ title, unitMap, id }) {
  const unitKeys = Object.keys(unitMap);
  const opts = unitKeys.map((k) => ({ value: k, label: unitMap[k].label }));

  const [fromVal,  setFromVal]  = useState("1");
  const [fromUnit, setFromUnit] = useState(unitKeys[0]);
  const [toUnit,   setToUnit]   = useState(unitKeys[2]);

  const computeTo = useCallback(
    (val, from, to) => {
      const v = parseFloat(val);
      if (isNaN(v)) return "";
      const r = convert(v, from, to, unitMap);
      return isNaN(r) ? "" : parseFloat(r.toPrecision(10)).toString();
    },
    [unitMap]
  );

  const toVal = computeTo(fromVal, fromUnit, toUnit);

  function handleFromVal(v) { setFromVal(v); }

  function handleToVal(v) {
    const r = parseFloat(v);
    if (isNaN(r)) { setFromVal(""); return; }
    const back = convert(r, toUnit, fromUnit, unitMap);
    setFromVal(isNaN(back) ? "" : parseFloat(back.toPrecision(10)).toString());
  }

  function swap() {
    const newFromUnit = toUnit;
    const newToUnit   = fromUnit;
    const newFromVal  = toVal;
    setFromUnit(newFromUnit);
    setToUnit(newToUnit);
    setFromVal(newFromVal);
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{title}</h2>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
        {/* From */}
        <div className="space-y-2">
          <SelectField id={`${id}-from`} label="From" value={fromUnit} onChange={setFromUnit} options={opts} />
          <input type="number" value={fromVal} onChange={(e) => handleFromVal(e.target.value)}
            placeholder="0" aria-label="From value"
            className="w-full py-3 px-4 text-lg font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-shadow" />
        </div>

        {/* Swap button */}
        <button onClick={swap}
          className="mb-0.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 text-slate-500 hover:text-indigo-600 transition-all"
          aria-label="Swap units">
          <ArrowLeftRight size={16} />
        </button>

        {/* To */}
        <div className="space-y-2">
          <SelectField id={`${id}-to`} label="To" value={toUnit} onChange={setToUnit} options={opts} />
          <input type="number" value={toVal} onChange={(e) => handleToVal(e.target.value)}
            placeholder="0" aria-label="To value"
            className="w-full py-3 px-4 text-lg font-semibold border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-700 dark:text-indigo-300 transition-shadow" />
        </div>
      </div>
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
  { q: "How do I convert centimeters to inches?", a: "Divide the centimeter value by 2.54. For example, 100 cm ÷ 2.54 = 39.37 inches. Or just use this tool and edit the right-hand field." },
  { q: "How many pounds are in a kilogram?", a: "There are approximately 2.2046 pounds in one kilogram." },
  { q: "What is a stone in pounds?", a: "One stone equals 14 pounds (approximately 6.35 kilograms). Stones are commonly used to describe body weight in the UK and Ireland." },
];

export default function LengthWeight() {
  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Length & Weight Converter</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bi-directional converter — edit either field, swap units with one click.
            </p>
          </div>

          {/* Length converter */}
          <ConverterPanel title="Length Converter" unitMap={lengthUnits} id="length" />

          {/* Weight converter */}
          <ConverterPanel title="Weight Converter" unitMap={weightUnits} id="weight" />
        </div>

        {/* RIGHT COLUMN — Reference + Formula */}
        <div className="space-y-4">

          {/* How to Calculate card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">How to Use</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Select your units, type a value in either field and the other updates instantly. Click the swap button to reverse the conversion direction.
            </p>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Converted = (Input × fromBase) / toBase

Length base unit: Meter (m)
Weight base unit: Kilogram (kg)

Example:
  5 feet → meters: (5 × 0.3048) / 1 = 1.524 m
  10 lbs → kg:     (10 × 0.453592) / 1 = 4.536 kg`}
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
