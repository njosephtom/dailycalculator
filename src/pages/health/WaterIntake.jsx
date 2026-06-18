import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import {
  calcWaterIntake,
  lbsToKg,
  litersToOz,
  ACTIVITY_LEVELS,
  CLIMATE_OPTIONS,
  SPECIAL_OPTIONS,
} from "../../utils/waterIntake";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ── local helpers ────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
      {children}
    </p>
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
    q: "How much water should I drink per day?",
    a: "A common guideline is about 2-3 liters (8-12 cups) per day for most adults, but your ideal intake depends on body weight, activity level, climate, and individual health factors. The formula used here (body weight in kg x 0.033 L) provides a personalised baseline that you can adjust based on how you feel.",
  },
  {
    q: "Can I count coffee, tea, or other beverages toward my daily water intake?",
    a: "Yes, most beverages contribute to your daily fluid intake, including coffee, tea, milk, and juice. However, water is the best choice because it has no calories, sugar, or additives. Caffeinated drinks have a mild diuretic effect but still provide a net hydration benefit. Alcohol, on the other hand, is dehydrating and should not count toward your goal.",
  },
  {
    q: "What are the signs of dehydration I should watch for?",
    a: "Early signs include thirst, dark yellow urine, dry mouth, fatigue, and headaches. More serious symptoms include dizziness, rapid heartbeat, confusion, and very little or no urination. A simple check is urine colour: pale straw or light yellow indicates good hydration, while dark amber suggests you need more fluids.",
  },
];

const ACTIVITY_OPTS = Object.entries(ACTIVITY_LEVELS).map(([k, v]) => ({
  value: k,
  label: v.label,
}));

const CLIMATE_OPTS = Object.entries(CLIMATE_OPTIONS).map(([k, v]) => ({
  value: k,
  label: v.label,
}));

const SPECIAL_OPTS = SPECIAL_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

/* ── Hydration Tracker Visual ─────────────────────── */

function HydrationTracker({ glasses, bottles }) {
  const displayGlasses = Math.min(glasses, 20); // cap visual at 20
  const displayBottles = Math.min(bottles, 12);  // cap visual at 12

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Daily Hydration Goal
      </h2>

      {/* Glasses (8 oz) */}
      <div className="mb-4">
        <SectionLabel>8 oz Glasses ({glasses})</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {Array.from({ length: displayGlasses }, (_, i) => (
            <div
              key={`g-${i}`}
              className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 border border-sky-300 dark:border-sky-700 flex items-center justify-center text-base"
              title={`Glass ${i + 1}`}
            >
              <span role="img" aria-label="water glass">💧</span>
            </div>
          ))}
          {glasses > 20 && (
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-500">
              +{glasses - 20}
            </div>
          )}
        </div>
      </div>

      {/* Bottles (500 ml) */}
      <div>
        <SectionLabel>500 ml Bottles ({bottles})</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {Array.from({ length: displayBottles }, (_, i) => (
            <div
              key={`b-${i}`}
              className="w-10 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 flex items-center justify-center text-lg"
              title={`Bottle ${i + 1}`}
            >
              <span role="img" aria-label="water bottle">💧</span>
            </div>
          ))}
          {bottles > 12 && (
            <div className="w-10 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-500">
              +{bottles - 12}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── component ────────────────────────────────────── */

export default function WaterIntake() {
  const [unit, setUnit] = useState("imperial");
  const [weightLbs, setWeightLbs] = useState("150");
  const [weightKg, setWeightKg] = useState("68");
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("cool");
  const [exerciseMin, setExerciseMin] = useState("0");
  const [special, setSpecial] = useState("none");

  /* ── derived values ──────────────────────────────── */
  const wKg = useMemo(() => {
    if (unit === "metric") return parseFloat(weightKg) || 0;
    return lbsToKg(parseFloat(weightLbs) || 0);
  }, [unit, weightKg, weightLbs]);

  const exMin = parseInt(exerciseMin) || 0;

  const result = useMemo(
    () =>
      calcWaterIntake({
        weightKg: wKg,
        climateKey: climate,
        exerciseMin: exMin,
        specialKey: special,
      }),
    [wKg, climate, exMin, special]
  );

  const fmt = (n, d = 1) => n.toFixed(d);
  const fmtOz = (liters) => litersToOz(liters).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Water Intake Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate your optimal daily water intake based on weight, activity,
              climate, and special needs.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            {/* Unit toggle */}
            <div className="flex gap-2">
              {["imperial", "metric"].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  aria-pressed={unit === u}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
                    unit === u
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unit === "metric" ? (
                <InputField
                  label="Weight"
                  id="wkg"
                  value={weightKg}
                  onChange={setWeightKg}
                  suffix="kg"
                  min="1"
                  max="500"
                  autoFocus
                />
              ) : (
                <InputField
                  label="Weight"
                  id="wlbs"
                  value={weightLbs}
                  onChange={setWeightLbs}
                  suffix="lbs"
                  min="1"
                  max="1100"
                  autoFocus
                />
              )}

              <InputField
                label="Exercise per Day"
                id="exercise"
                value={exerciseMin}
                onChange={setExerciseMin}
                suffix="min"
                min="0"
                max="600"
              />

              <SelectField
                label="Activity Level"
                id="activity"
                value={activity}
                onChange={setActivity}
                options={ACTIVITY_OPTS}
              />

              <SelectField
                label="Climate"
                id="climate"
                value={climate}
                onChange={setClimate}
                options={CLIMATE_OPTS}
              />

              <SelectField
                label="Pregnant or Breastfeeding?"
                id="special"
                value={special}
                onChange={setSpecial}
                options={SPECIAL_OPTS}
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Result metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total daily goal */}
            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 rounded-xl p-4">
              <SectionLabel>Daily Water Goal</SectionLabel>
              <p className="text-xl font-extrabold text-sky-700 dark:text-sky-300 leading-tight">
                {fmt(result.totalLiters)} L
              </p>
              <p className="text-xs text-sky-400 mt-1">
                {fmt(result.totalOz, 0)} fl oz
              </p>
            </div>

            {/* Glasses */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <SectionLabel>8 oz Glasses</SectionLabel>
              <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                {result.glasses8oz}
              </p>
              <p className="text-xs text-blue-400 mt-1">glasses per day</p>
            </div>

            {/* Bottles */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <SectionLabel>500 ml Bottles</SectionLabel>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">
                {result.bottles500ml}
              </p>
              <p className="text-xs text-indigo-400 mt-1">bottles per day</p>
            </div>
          </div>

          {/* Hourly intake card */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
            <SectionLabel>Hourly Intake Suggestion</SectionLabel>
            <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
              {result.hourlyMl} ml
            </p>
            <p className="text-xs text-emerald-400 mt-1">
              every hour over 16 waking hours &middot;{" "}
              {(result.hourlyMl / 29.5735).toFixed(1)} fl oz/hr
            </p>
          </div>

          {/* Visual hydration tracker */}
          <HydrationTracker
            glasses={result.glasses8oz}
            bottles={result.bottles500ml}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Breakdown table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Intake Breakdown
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Component</th>
                    <th className="pb-2 pr-4 font-semibold text-right">Liters</th>
                    <th className="pb-2 font-semibold text-right">Fl oz</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                      Base Intake
                      <span className="block text-[10px] text-slate-400">
                        {fmt(wKg, 1)} kg &times; 0.033
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white text-right">
                      {fmt(result.baseLiters)} L
                    </td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white text-right">
                      {fmtOz(result.baseLiters)} oz
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                      Exercise Adjustment
                      <span className="block text-[10px] text-slate-400">
                        +350 ml per 30 min &middot; {exMin} min
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white text-right">
                      +{fmt(result.exerciseLiters)} L
                    </td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white text-right">
                      +{fmtOz(result.exerciseLiters)} oz
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                      Climate Adjustment
                      <span className="block text-[10px] text-slate-400">
                        {CLIMATE_OPTIONS[climate]?.label} (+{Math.round(result.climatePct * 100)}%)
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white text-right">
                      +{fmt(result.climateLiters)} L
                    </td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white text-right">
                      +{fmtOz(result.climateLiters)} oz
                    </td>
                  </tr>
                  {special !== "none" && (
                    <tr className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                        {special === "pregnant" ? "Pregnancy" : "Breastfeeding"} Adjustment
                      </td>
                      <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white text-right">
                        +{fmt(result.specialLiters)} L
                      </td>
                      <td className="py-2 font-medium text-slate-800 dark:text-white text-right">
                        +{fmtOz(result.specialLiters)} oz
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 pr-4 font-semibold text-slate-700 dark:text-slate-200">
                      Total Daily Goal
                    </td>
                    <td className="py-2 pr-4 font-bold text-sky-600 dark:text-sky-400 text-right">
                      {fmt(result.totalLiters)} L
                    </td>
                    <td className="py-2 font-bold text-sky-600 dark:text-sky-400 text-right">
                      {fmt(result.totalOz, 0)} oz
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Reference / Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              How It Works
            </h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Base Intake
  Weight (kg) x 0.033 = liters/day

Exercise Adjustment
  +350 ml per 30 minutes of exercise

Climate Adjustment (% of base)
  Cool/Temperate:    +0%
  Warm:             +10%
  Hot/Humid:        +20%
  Very Hot/Tropical: +30%

Special Needs
  Pregnant:      +300 ml/day
  Breastfeeding: +700 ml/day

Conversions
  1 liter  = 33.814 fl oz
  1 glass  = 8 fl oz (237 ml)
  1 bottle = 500 ml (16.9 fl oz)
  Hourly   = Total / 16 waking hours`}
            </pre>
          </div>

          {/* Quick reference */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Your Numbers
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Weight</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {unit === "metric"
                    ? `${parseFloat(weightKg) || 0} kg`
                    : `${parseFloat(weightLbs) || 0} lbs (${fmt(wKg, 1)} kg)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Climate</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {CLIMATE_OPTIONS[climate]?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Exercise</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {exMin} min/day
                </span>
              </div>
              {special !== "none" && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Special</span>
                  <span className="font-medium text-slate-800 dark:text-white capitalize">
                    {special}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Daily Goal
                </span>
                <span className="font-bold text-sky-600 dark:text-sky-400">
                  {fmt(result.totalLiters)} L ({fmt(result.totalOz, 0)} oz)
                </span>
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
