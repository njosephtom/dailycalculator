import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { activityMultipliers } from "../../utils/bmiCalculations";
import { ChevronDown, ChevronUp } from "lucide-react";

const EQUATIONS = {
  mifflin:        { label:"Mifflin – St Jeor (Recommended)" },
  harris_revised: { label:"Harris-Benedict (Revised 1984)"  },
  harris_orig:    { label:"Harris-Benedict (Original 1919)" },
};

const EQ_OPTS      = Object.entries(EQUATIONS).map(([k,v])=>({ value:k, label:v.label }));
const SEX_OPTS     = [{ value:"male", label:"Male" }, { value:"female", label:"Female" }];
const ACTIVITY_OPTS= Object.entries(activityMultipliers).map(([k,v])=>({ value:k, label:v.label }));

function calcBMR(eq, weightKg, heightCm, age, sex) {
  const w=weightKg, h=heightCm, a=age;
  if (eq==="mifflin") {
    return sex==="male" ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161;
  }
  if (eq==="harris_revised") {
    return sex==="male" ? 88.362+13.397*w+4.799*h-5.677*a : 447.593+9.247*w+3.098*h-4.33*a;
  }
  // harris_orig
  return sex==="male" ? 66.473+13.7516*w+5.0033*h-6.755*a : 655.0955+9.5634*w+1.8496*h-4.6756*a;
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
  { q:"Which equation should I use?", a:"Mifflin-St Jeor is the most widely validated and recommended by the American Dietetic Association for estimating RMR in clinical and research settings. Use it unless you have a specific reason to compare." },
  { q:"What is the difference between BMR and TDEE?", a:"BMR is the calories needed at complete rest. TDEE (Total Daily Energy Expenditure) multiplies BMR by an activity factor to estimate actual daily caloric needs based on lifestyle." },
  { q:"How accurate is BMR?", a:"BMR formulas estimate within ±10% for most people. Individual variation from factors like body composition, genetics, and hormones means these are best used as starting points, not precise targets." },
];

export default function BmrCalculator() {
  const [unit,      setUnit]      = useState("metric");
  const [equation,  setEquation]  = useState("mifflin");
  const [sex,       setSex]       = useState("male");
  const [age,       setAge]       = useState("30");
  const [weightKg,  setWeightKg]  = useState("70");
  const [heightCm,  setHeightCm]  = useState("175");
  const [weightLbs, setWeightLbs] = useState("154");
  const [heightFt,  setHeightFt]  = useState("5");
  const [heightIn,  setHeightIn]  = useState("9");
  const [activity,  setActivity]  = useState("moderate");

  const { wKg, hCm } = useMemo(() => {
    if (unit==="metric") return { wKg:parseFloat(weightKg)||0, hCm:parseFloat(heightCm)||0 };
    const wKgI = (parseFloat(weightLbs)||0)*0.453592;
    const hCmI = ((parseFloat(heightFt)||0)*12+(parseFloat(heightIn)||0))*2.54;
    return { wKg:wKgI, hCm:hCmI };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const bmr  = useMemo(() => calcBMR(equation, wKg, hCm, parseInt(age)||25, sex), [equation, wKg, hCm, age, sex]);
  const tdee = bmr * (activityMultipliers[activity]?.factor ?? 1.55);

  // all three equations for comparison
  const comparison = useMemo(() => Object.keys(EQUATIONS).map(eq => ({
    label: EQUATIONS[eq].label.split("(")[0].trim(),
    bmr: calcBMR(eq, wKg, hCm, parseInt(age)||25, sex),
  })), [wKg, hCm, age, sex]);

  const goalsTable = [
    { goal:"Weight Loss (mild)",    kcal: Math.round(tdee * 0.85) },
    { goal:"Weight Loss (moderate)",kcal: Math.round(tdee * 0.75) },
    { goal:"Maintenance",           kcal: Math.round(tdee)        },
    { goal:"Weight Gain (mild)",    kcal: Math.round(tdee * 1.1)  },
    { goal:"Weight Gain (moderate)",kcal: Math.round(tdee * 1.2)  },
  ];

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">BMR Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate your Basal Metabolic Rate using three equations and find your daily calorie needs.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <SelectField label="BMR Equation" id="eq" value={equation} onChange={setEquation} options={EQ_OPTS}/>

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
              <SelectField label="Biological Sex" id="sex" value={sex} onChange={setSex} options={SEX_OPTS}/>
              <InputField  label="Age"            id="age" value={age} onChange={setAge} suffix="yrs" min="1" max="120"/>
              {unit==="metric" ? (
                <>
                  <InputField label="Weight" id="wkg" value={weightKg}  onChange={setWeightKg}  suffix="kg"/>
                  <InputField label="Height" id="hcm" value={heightCm}  onChange={setHeightCm}  suffix="cm"/>
                </>
              ) : (
                <>
                  <InputField label="Weight" id="wlbs" value={weightLbs} onChange={setWeightLbs} suffix="lbs"/>
                  <div className="flex gap-2">
                    <InputField label="Height (ft)" id="hft" value={heightFt} onChange={setHeightFt} suffix="ft"/>
                    <InputField label="(in)"        id="hin" value={heightIn} onChange={setHeightIn} suffix="in" className="mt-auto"/>
                  </div>
                </>
              )}
              <SelectField label="Activity Level" id="act" value={activity} onChange={setActivity} options={ACTIVITY_OPTS} className="sm:col-span-2"/>
            </div>
          </div>

          {/* 2-col metrics */}
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

          {/* Equation comparison */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Equation Comparison</h2>
            <div className="space-y-2">
              {comparison.map(c=>(
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 w-48 shrink-0">{c.label}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{width:`${Math.min(100, (c.bmr/3000)*100)}%`}}/>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-24 text-right">{Math.round(c.bmr)} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Reference Table + Formula */}
        <div className="space-y-4">

          {/* Goals table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Daily Calorie Targets by Goal</h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Goal</th>
                    <th className="pb-2 font-semibold">Daily Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {goalsTable.map(g=>(
                    <tr key={g.goal} className={`border-b border-slate-100 dark:border-slate-700/50 ${g.goal==="Maintenance"?"bg-indigo-50 dark:bg-indigo-900/20 font-semibold":""}`}>
                      <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{g.goal}</td>
                      <td className="py-2 text-slate-800 dark:text-white">{g.kcal.toLocaleString()} kcal</td>
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
{`Mifflin-St Jeor (Male):   10W + 6.25H − 5A + 5
Mifflin-St Jeor (Female): 10W + 6.25H − 5A − 161

Harris-Benedict Revised (Male):   88.362 + 13.397W + 4.799H − 5.677A
Harris-Benedict Revised (Female): 447.593 + 9.247W + 3.098H − 4.33A

W = kg, H = cm, A = years
TDEE = BMR × Activity Factor`}
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
