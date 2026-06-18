import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { calcBodyFatNavy, bodyFatCategory, BF_RANGES } from "../../utils/bodyFat";
import { ChevronDown, ChevronUp } from "lucide-react";

const BAND = {
  slate:  "bg-slate-100 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300",
  blue:   "bg-blue-100 dark:bg-blue-900/30 border-blue-300 text-blue-700 dark:text-blue-300",
  green:  "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 text-emerald-700 dark:text-emerald-300",
  emerald:"bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 text-yellow-700 dark:text-yellow-300",
  red:    "bg-red-100 dark:bg-red-900/30 border-red-300 text-red-700 dark:text-red-300",
};

function toCm(value, unit) {
  return unit==="metric" ? parseFloat(value)||0 : (parseFloat(value)||0)*2.54;
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
  { q:"What is the Navy body fat formula?", a:"The US Navy method estimates body fat using circumference measurements rather than calipers or DEXA scans. It's reasonably accurate (±3–4%) and requires no special equipment." },
  { q:"Where should I measure my waist?", a:"Measure your waist at its narrowest point, typically just above the belly button. Hold the tape horizontally and don't suck in your stomach. Take the measurement at the end of a normal exhale." },
  { q:"What is a healthy body fat percentage?", a:"For men, 10–20% is generally healthy. For women, 18–28% is considered healthy. Athletes typically have lower percentages (6–13% for men, 14–20% for women)." },
];

export default function BodyFat() {
  const [unit,    setUnit]    = useState("metric");
  const [sex,     setSex]     = useState("male");
  const [height,  setHeight]  = useState("175");
  const [heightFt,setHeightFt]= useState("5");
  const [heightIn,setHeightIn]= useState("9");
  const [neck,    setNeck]    = useState(unit==="metric"?"38":"15");
  const [waist,   setWaist]   = useState(unit==="metric"?"85":"33.5");
  const [hip,     setHip]     = useState(unit==="metric"?"95":"37");

  const { hCm, nCm, wCm, hiCm } = useMemo(() => {
    if (unit==="metric") return {
      hCm:  parseFloat(height)||0,
      nCm:  parseFloat(neck)||0,
      wCm:  parseFloat(waist)||0,
      hiCm: parseFloat(hip)||0,
    };
    return {
      hCm:  ((parseFloat(heightFt)||0)*12+(parseFloat(heightIn)||0))*2.54,
      nCm:  (parseFloat(neck)||0)*2.54,
      wCm:  (parseFloat(waist)||0)*2.54,
      hiCm: (parseFloat(hip)||0)*2.54,
    };
  }, [unit, height, heightFt, heightIn, neck, waist, hip]);

  const bf  = useMemo(() => calcBodyFatNavy({ sex, heightCm:hCm, neckCm:nCm, waistCm:wCm, hipCm:hiCm }), [sex, hCm, nCm, wCm, hiCm]);
  const cat = bodyFatCategory(bf, sex);

  const su = unit==="metric" ? "cm" : "in";
  const measureLabel = (l) => `${l} (${su})`;

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Body Fat Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Estimate body fat percentage using the US Navy circumference method.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex gap-2">
              {["metric","imperial"].map(u=>(
                <button key={u} onClick={()=>setUnit(u)} aria-pressed={unit===u}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
                    unit===u
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}>{u}</button>
              ))}
            </div>

            <div className="flex gap-2">
              {["male","female"].map(s=>(
                <button key={s} onClick={()=>setSex(s)} aria-pressed={sex===s}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
                    sex===s
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}>{s}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unit==="metric" ? (
                <InputField label={measureLabel("Height")} id="h" value={height}  onChange={setHeight}  min="100" max="250" autoFocus/>
              ) : (
                <div className="flex gap-2">
                  <InputField label="Height (ft)" id="hft" value={heightFt} onChange={setHeightFt} suffix="ft" autoFocus/>
                  <InputField label="(in)"        id="hin" value={heightIn} onChange={setHeightIn} suffix="in" className="mt-auto"/>
                </div>
              )}
              <InputField label={measureLabel("Neck circumference")}  id="neck"  value={neck}  onChange={setNeck}  min="0"/>
              <InputField label={measureLabel("Waist circumference")} id="waist" value={waist} onChange={setWaist} min="0"/>
              {sex==="female" && (
                <InputField label={measureLabel("Hip circumference")} id="hip" value={hip} onChange={setHip} min="0"/>
              )}
            </div>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-xs text-amber-700 dark:text-amber-400">
              Measure neck just below the larynx, waist at its narrowest point{sex==="female"?" and hips at the widest point below waist":""}.
            </div>
          </div>

          {/* Result */}
          <div className={`border rounded-xl p-5 ${BAND[cat.color]}`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Body Fat %</p>
                <p className="text-4xl font-bold mt-1">{bf !== null && isFinite(bf) ? bf.toFixed(1)+"%" : "—"}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${BAND[cat.color]}`}>{cat.label}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Reference Table + Formula */}
        <div className="space-y-4">

          {/* Classification reference */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Body Fat Classification ({sex==="male"?"Men":"Women"})</h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Category</th>
                    <th className="pb-2 font-semibold">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {BF_RANGES[sex].map(([label, range])=>(
                    <tr key={label} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-1.5 pr-4 text-slate-700 dark:text-slate-300">{label}</td>
                      <td className="py-1.5 font-medium text-slate-800 dark:text-white">{range}</td>
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
{`Male:   BF% = 86.01 × log₁₀(Waist − Neck) − 70.041 × log₁₀(Height) + 36.76
Female: BF% = 163.205 × log₁₀(Waist + Hips − Neck) − 97.684 × log₁₀(Height) − 78.387
(all measurements in cm)`}
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
