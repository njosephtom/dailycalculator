import React, { useState, useMemo } from "react";
import {
  calculateBMI,
  bmiCategory,
  calculateBMR,
  activityMultipliers,
} from "../../utils/bmiCalculations";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { ChevronDown, ChevronUp } from "lucide-react";

const SEX_OPTIONS = [
  { value: "male",   label: "Male" },
  { value: "female", label: "Female" },
];

const ACTIVITY_OPTIONS = Object.entries(activityMultipliers).map(([k, v]) => ({
  value: k,
  label: v.label,
}));

const BMI_BAND_COLORS = {
  slate:  "bg-slate-100  dark:bg-slate-700   border-slate-300  dark:border-slate-600  text-slate-700  dark:text-slate-300",
  blue:   "bg-blue-100   dark:bg-blue-900/30  border-blue-300   dark:border-blue-700   text-blue-700   dark:text-blue-300",
  green:  "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300",
  red:    "bg-red-100    dark:bg-red-900/30   border-red-300    dark:border-red-700    text-red-700    dark:text-red-300",
};

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
  { q: "What is a healthy BMI range?", a: "For adults, a BMI between 18.5 and 24.9 is considered normal weight. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is classified as obese." },
  { q: "What is BMR?", a: "Basal Metabolic Rate is the number of calories your body burns to maintain basic life functions (breathing, circulation, cell repair) while completely at rest. It's the minimum energy your body needs to survive." },
  { q: "Can I use TDEE to lose weight?", a: "Yes. Consuming fewer calories than your TDEE creates a caloric deficit. A deficit of 500 kcal/day typically results in approximately 0.5 kg (1 lb) of fat loss per week." },
];

export default function BmiBmr() {
  const [unit,       setUnit]       = useState("metric");
  const [weightKg,   setWeightKg]   = useState("70");
  const [heightCm,   setHeightCm]   = useState("175");
  const [weightLbs,  setWeightLbs]  = useState("154");
  const [heightFt,   setHeightFt]   = useState("5");
  const [heightIn,   setHeightIn]   = useState("9");
  const [age,        setAge]        = useState("30");
  const [sex,        setSex]        = useState("male");
  const [activity,   setActivity]   = useState("moderate");

  const { wKg, hCm } = useMemo(() => {
    if (unit === "metric") {
      return { wKg: parseFloat(weightKg) || 0, hCm: parseFloat(heightCm) || 0 };
    }
    const wKgImp = (parseFloat(weightLbs) || 0) * 0.453592;
    const hCmImp = ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 2.54;
    return { wKg: wKgImp, hCm: hCmImp };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const bmi  = useMemo(() => calculateBMI({ weightKg: wKg, heightCm: hCm }), [wKg, hCm]);
  const cat  = bmiCategory(bmi);
  const bmr  = useMemo(() => calculateBMR({ weightKg: wKg, heightCm: hCm, age: parseInt(age) || 25, sex }), [wKg, hCm, age, sex]);
  const tdee = bmr * (activityMultipliers[activity]?.factor ?? 1.55);

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">BMI & BMR Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate your Body Mass Index and daily caloric requirements.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <SectionLabel text="Unit System" />
            <div className="flex gap-2" role="group" aria-label="Unit system">
              {["metric", "imperial"].map((u) => (
                <button key={u} onClick={() => setUnit(u)} aria-pressed={unit === u}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
                    unit === u
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}>{u}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unit === "metric" ? (
                <>
                  <InputField label="Weight" id="wkg"  value={weightKg}  onChange={setWeightKg}  suffix="kg" autoFocus />
                  <InputField label="Height" id="hcm"  value={heightCm}  onChange={setHeightCm}  suffix="cm" />
                </>
              ) : (
                <>
                  <InputField label="Weight" id="wlbs" value={weightLbs} onChange={setWeightLbs} suffix="lbs" autoFocus />
                  <div className="flex gap-2">
                    <InputField label="Height (ft)" id="hft"  value={heightFt}  onChange={setHeightFt}  suffix="ft" />
                    <InputField label="(in)"        id="hin"  value={heightIn}  onChange={setHeightIn}  suffix="in" className="mt-auto" />
                  </div>
                </>
              )}
              <InputField label="Age" id="age" value={age} onChange={setAge} suffix="yrs" min="1" max="120" />
              <SelectField label="Biological Sex" id="sex" value={sex} onChange={setSex} options={SEX_OPTIONS} />
              <SelectField label="Activity Level" id="activity" value={activity} onChange={setActivity} options={ACTIVITY_OPTIONS} className="sm:col-span-2" />
            </div>
          </div>

          {/* BMI banner */}
          <div className={`border rounded-xl p-5 ${BMI_BAND_COLORS[cat.color]}`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Body Mass Index (BMI)</p>
                <p className="text-4xl font-bold mt-1">
                  {isFinite(bmi) && bmi > 0 ? bmi.toFixed(1) : "—"}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${BMI_BAND_COLORS[cat.color]}`}>
                {cat.label}
              </span>
            </div>
            {/* BMI scale bar */}
            <div className="mt-4 flex rounded-full overflow-hidden h-2.5">
              <div className="flex-1 bg-blue-400"   title="Underweight < 18.5" />
              <div className="flex-1 bg-emerald-400" title="Normal 18.5–24.9" />
              <div className="flex-1 bg-yellow-400"  title="Overweight 25–29.9" />
              <div className="flex-1 bg-red-400"     title="Obese ≥ 30" />
            </div>
            <div className="flex justify-between text-xs opacity-50 mt-1">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
          </div>

          {/* Caloric output cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">BMR (at rest)</p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{Math.round(bmr).toLocaleString()} kcal/day</p>
              <p className="text-xs text-indigo-400 mt-1">Calories at complete rest</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">TDEE (with activity)</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{Math.round(tdee).toLocaleString()} kcal/day</p>
              <p className="text-xs text-emerald-400 mt-1">Total daily energy</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Formula */}
        <div className="space-y-4">
          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`BMI   = Weight (kg) / Height (m)²

BMR (Male)   = 88.362 + (13.397 × W) + (4.799 × H) − (5.677 × A)
BMR (Female) = 447.593 + (9.247 × W) + (3.098 × H) − (4.330 × A)
  W = weight in kg, H = height in cm, A = age in years

TDEE = BMR × Activity Factor
  Sedentary × 1.2  |  Light × 1.375  |  Moderate × 1.55
  Active × 1.725   |  Very Active × 1.9`}
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
