import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { calculateBMI, bmiCategory } from "../../utils/bmiCalculations";
import { ChevronDown, ChevronUp } from "lucide-react";

const BMI_CLASSES = [
  { label:"Severely Underweight", range:"< 16",    color:"blue"  },
  { label:"Underweight",          range:"16–18.4",  color:"blue"  },
  { label:"Normal Weight",        range:"18.5–24.9",color:"green" },
  { label:"Overweight",           range:"25–29.9",  color:"yellow"},
  { label:"Obese (Class I)",      range:"30–34.9",  color:"orange"},
  { label:"Obese (Class II)",     range:"35–39.9",  color:"red"   },
  { label:"Obese (Class III)",    range:"≥ 40",     color:"red"   },
];

const BAND_COLORS = {
  slate: "bg-slate-100 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300",
  blue:  "bg-blue-100 dark:bg-blue-900/30 border-blue-300 text-blue-700 dark:text-blue-300",
  green: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 text-emerald-700 dark:text-emerald-300",
  yellow:"bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 text-yellow-700 dark:text-yellow-300",
  red:   "bg-red-100 dark:bg-red-900/30 border-red-300 text-red-700 dark:text-red-300",
};

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
  { q:"What is BMI?", a:"BMI (Body Mass Index) is a simple measure of body weight relative to height. It's widely used to screen for underweight, normal weight, overweight, and obesity in adults." },
  { q:"What are the limitations of BMI?", a:"BMI doesn't distinguish between muscle and fat. Athletes may have a high BMI but low body fat. It also doesn't account for age, sex, ethnicity, or body fat distribution." },
  { q:"Is 25 BMI overweight?", a:"Yes, a BMI of 25.0–29.9 is classified as overweight. A BMI of 18.5–24.9 is considered normal or healthy weight for most adults." },
];

export default function BmiCalculator() {
  const [unit,      setUnit]      = useState("metric");
  const [weightKg,  setWeightKg]  = useState("70");
  const [heightCm,  setHeightCm]  = useState("175");
  const [weightLbs, setWeightLbs] = useState("154");
  const [heightFt,  setHeightFt]  = useState("5");
  const [heightIn,  setHeightIn]  = useState("9");

  const { wKg, hCm } = useMemo(() => {
    if (unit==="metric") return { wKg:parseFloat(weightKg)||0, hCm:parseFloat(heightCm)||0 };
    const wKgI = (parseFloat(weightLbs)||0)*0.453592;
    const hCmI = ((parseFloat(heightFt)||0)*12 + (parseFloat(heightIn)||0))*2.54;
    return { wKg:wKgI, hCm:hCmI };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const bmi = useMemo(() => calculateBMI({ weightKg:wKg, heightCm:hCm }), [wKg, hCm]);
  const cat = bmiCategory(bmi);

  // Healthy weight range for height
  const minKg = hCm > 0 ? 18.5 * Math.pow(hCm/100, 2) : 0;
  const maxKg = hCm > 0 ? 24.9 * Math.pow(hCm/100, 2) : 0;
  const minLbs = minKg * 2.20462;
  const maxLbs = maxKg * 2.20462;

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">BMI Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate your Body Mass Index and see where you fall in the standard classification.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex gap-2" role="group">
              {["metric","imperial"].map(u=>(
                <button key={u} onClick={()=>setUnit(u)} aria-pressed={unit===u}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
                    unit===u
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}>{u}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unit==="metric" ? (
                <>
                  <InputField label="Weight" id="wkg"  value={weightKg}  onChange={setWeightKg}  suffix="kg" autoFocus/>
                  <InputField label="Height" id="hcm"  value={heightCm}  onChange={setHeightCm}  suffix="cm"/>
                </>
              ) : (
                <>
                  <InputField label="Weight"      id="wlbs" value={weightLbs} onChange={setWeightLbs} suffix="lbs" autoFocus/>
                  <div className="flex gap-2">
                    <InputField label="Height (ft)" id="hft"  value={heightFt}  onChange={setHeightFt}  suffix="ft"/>
                    <InputField label="(in)"        id="hin"  value={heightIn}  onChange={setHeightIn}  suffix="in" className="mt-auto"/>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BMI result banner */}
          <div className={`border rounded-xl p-5 ${BAND_COLORS[cat.color]}`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Body Mass Index</p>
                <p className="text-4xl font-bold mt-1">{isFinite(bmi)&&bmi>0 ? bmi.toFixed(1) : "—"}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${BAND_COLORS[cat.color]}`}>
                {cat.label}
              </span>
            </div>

            {/* Color scale bar */}
            <div className="mt-4 flex rounded-full overflow-hidden h-3">
              <div className="flex-1 bg-blue-400" title="Underweight"/>
              <div className="flex-1 bg-emerald-400" title="Normal"/>
              <div className="flex-1 bg-yellow-400" title="Overweight"/>
              <div className="flex-1 bg-orange-400" title="Obese I"/>
              <div className="flex-1 bg-red-500" title="Obese II+"/>
            </div>
            <div className="flex justify-between text-xs opacity-50 mt-1">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
          </div>

          {/* Healthy range */}
          {hCm > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Healthy Weight Range for Your Height</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                BMI 18.5–24.9 corresponds to <span className="font-semibold text-slate-800 dark:text-white">
                  {unit==="metric"
                    ? `${minKg.toFixed(1)} – ${maxKg.toFixed(1)} kg`
                    : `${minLbs.toFixed(1)} – ${maxLbs.toFixed(1)} lbs`}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Reference Table + Formula */}
        <div className="space-y-4">

          {/* Classification table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">BMI Classification Table</h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Classification</th>
                    <th className="pb-2 font-semibold">BMI Range</th>
                  </tr>
                </thead>
                <tbody>
                  {BMI_CLASSES.map(c=>(
                    <tr key={c.label} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-1.5 pr-4 text-slate-700 dark:text-slate-300">{c.label}</td>
                      <td className="py-1.5 font-medium text-slate-800 dark:text-white">{c.range}</td>
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
{`BMI = Weight (kg) / Height (m)²
Imperial: BMI = 703 × Weight (lbs) / Height (in)²`}
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
