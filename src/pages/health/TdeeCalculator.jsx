import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import {
  calcBMR,
  calcTDEE,
  calcMacros,
  lbsToKg,
  ftInToCm,
  ACTIVITY_LEVELS,
} from "../../utils/calorieDeficit";
import { ChevronDown, ChevronUp } from "lucide-react";

/* -- local helpers ---------------------------------------- */

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
    q: "What is TDEE and why does it matter?",
    a: "Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a day, including your basal metabolic rate, physical activity, and the thermic effect of food. Knowing your TDEE helps you set accurate calorie targets for weight loss, maintenance, or muscle gain.",
  },
  {
    q: "What is BMR and how is it different from TDEE?",
    a: "Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest just to maintain basic life functions like breathing, circulation, and cell production. TDEE builds on BMR by multiplying it by an activity factor that accounts for your daily movement and exercise.",
  },
  {
    q: "How do I choose the right activity level?",
    a: "Sedentary suits desk jobs with little exercise. Lightly Active fits 1-3 light workouts per week. Moderately Active covers 3-5 moderate sessions. Very Active applies to intense training 6-7 days per week. Extra Active is for athletes or those with physically demanding jobs plus daily training. When in doubt, choose one level lower to avoid overestimating.",
  },
];

const ACTIVITY_OPTS = Object.entries(ACTIVITY_LEVELS).map(([k, v]) => ({
  value: k,
  label: v.label,
}));

const GOAL_OPTIONS = [
  { value: "lose", label: "Lose Weight (-500 kcal)" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "gain", label: "Gain Weight (+500 kcal)" },
];

const MEAL_SPLIT = [
  { name: "Breakfast", pct: 0.25, color: "indigo" },
  { name: "Lunch", pct: 0.35, color: "emerald" },
  { name: "Dinner", pct: 0.30, color: "amber" },
  { name: "Snacks", pct: 0.10, color: "rose" },
];

/* -- component -------------------------------------------- */

export default function TdeeCalculator() {
  const [unit, setUnit] = useState("imperial");
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("175");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weightLbs, setWeightLbs] = useState("180");
  const [weightKg, setWeightKg] = useState("82");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");

  /* -- derived values ------------------------------------- */
  const { wKg, hCm } = useMemo(() => {
    if (unit === "metric") {
      return {
        wKg: parseFloat(weightKg) || 0,
        hCm: parseFloat(heightCm) || 0,
      };
    }
    return {
      wKg: lbsToKg(parseFloat(weightLbs) || 0),
      hCm: ftInToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0),
    };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const ageNum = parseInt(age) || 25;
  const bmr = useMemo(() => calcBMR(wKg, hCm, ageNum, sex), [wKg, hCm, ageNum, sex]);
  const tdee = useMemo(() => calcTDEE(bmr, activity), [bmr, activity]);

  const goalCalories = useMemo(() => {
    if (goal === "lose") return Math.round(tdee - 500);
    if (goal === "gain") return Math.round(tdee + 500);
    return Math.round(tdee);
  }, [tdee, goal]);

  const macros = useMemo(() => calcMacros(goalCalories), [goalCalories]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              TDEE Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate your Total Daily Energy Expenditure, goal calories, and
              macronutrient breakdown.
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

            {/* Sex toggle */}
            <div className="flex gap-2">
              {["male", "female"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  aria-pressed={sex === s}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
                    sex === s
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Age"
                id="tdee-age"
                value={age}
                onChange={setAge}
                suffix="yrs"
                min="1"
                max="120"
                autoFocus
              />

              {unit === "metric" ? (
                <InputField
                  label="Height"
                  id="tdee-hcm"
                  value={heightCm}
                  onChange={setHeightCm}
                  suffix="cm"
                />
              ) : (
                <div className="flex gap-2">
                  <InputField
                    label="Height (ft)"
                    id="tdee-hft"
                    value={heightFt}
                    onChange={setHeightFt}
                    suffix="ft"
                  />
                  <InputField
                    label="(in)"
                    id="tdee-hin"
                    value={heightIn}
                    onChange={setHeightIn}
                    suffix="in"
                    className="mt-auto"
                  />
                </div>
              )}

              {unit === "metric" ? (
                <InputField
                  label="Weight"
                  id="tdee-wkg"
                  value={weightKg}
                  onChange={setWeightKg}
                  suffix="kg"
                />
              ) : (
                <InputField
                  label="Weight"
                  id="tdee-wlbs"
                  value={weightLbs}
                  onChange={setWeightLbs}
                  suffix="lbs"
                />
              )}

              <SelectField
                label="Activity Level"
                id="tdee-act"
                value={activity}
                onChange={setActivity}
                options={ACTIVITY_OPTS}
              />

              <SelectField
                label="Goal"
                id="tdee-goal"
                value={goal}
                onChange={setGoal}
                options={GOAL_OPTIONS}
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Result metric cards -- 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* BMR */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <SectionLabel>BMR</SectionLabel>
              <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                {Math.round(bmr).toLocaleString()}
              </p>
              <p className="text-xs text-blue-400 mt-1">kcal / day</p>
            </div>

            {/* TDEE */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <SectionLabel>TDEE</SectionLabel>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">
                {Math.round(tdee).toLocaleString()}
              </p>
              <p className="text-xs text-indigo-400 mt-1">kcal / day</p>
            </div>

            {/* Goal Calories */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <SectionLabel>Goal Calories</SectionLabel>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {goalCalories.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                kcal / day
                {goal === "lose" && " (-500)"}
                {goal === "gain" && " (+500)"}
              </p>
            </div>
          </div>

          {/* Macronutrient breakdown with color bars */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Macronutrient Breakdown
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Protein 30% &middot; Carbs 40% &middot; Fat 30% &middot;{" "}
              {goalCalories.toLocaleString()} kcal
            </p>

            {/* Stacked bar */}
            <div className="flex rounded-full h-3 overflow-hidden bg-slate-100 dark:bg-slate-700 mb-2">
              <div
                className="bg-blue-500 dark:bg-blue-400"
                style={{ width: "30%" }}
                title={`Protein: ${macros.protein}g`}
              />
              <div
                className="bg-yellow-400 dark:bg-yellow-500"
                style={{ width: "40%" }}
                title={`Carbs: ${macros.carbs}g`}
              />
              <div
                className="bg-rose-400 dark:bg-rose-500"
                style={{ width: "30%" }}
                title={`Fat: ${macros.fat}g`}
              />
            </div>

            {/* Macro detail rows */}
            <div className="space-y-2 mt-3">
              {[
                {
                  label: "Protein",
                  grams: macros.protein,
                  cals: Math.round(goalCalories * 0.3),
                  pct: 30,
                  dot: "bg-blue-500 dark:bg-blue-400",
                },
                {
                  label: "Carbs",
                  grams: macros.carbs,
                  cals: Math.round(goalCalories * 0.4),
                  pct: 40,
                  dot: "bg-yellow-400 dark:bg-yellow-500",
                },
                {
                  label: "Fat",
                  grams: macros.fat,
                  cals: Math.round(goalCalories * 0.3),
                  pct: 30,
                  dot: "bg-rose-400 dark:bg-rose-500",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${m.dot}`}
                    />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {m.label}
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">
                    {m.grams}g &middot; {m.cals} kcal &middot; {m.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Meal breakdown table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Calorie Breakdown by Meal
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Meal</th>
                    <th className="pb-2 pr-4 font-semibold text-right">%</th>
                    <th className="pb-2 font-semibold text-right">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {MEAL_SPLIT.map((meal) => {
                    const cals = Math.round(goalCalories * meal.pct);
                    return (
                      <tr
                        key={meal.name}
                        className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                      >
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block w-2 h-2 rounded-full bg-${meal.color}-500`}
                            />
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {meal.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 text-right text-slate-500 dark:text-slate-400">
                          {Math.round(meal.pct * 100)}%
                        </td>
                        <td className="py-2.5 text-right font-medium text-slate-800 dark:text-white">
                          {cals.toLocaleString()} kcal
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 dark:border-slate-700">
                    <td className="pt-2.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                      Total
                    </td>
                    <td className="pt-2.5 pr-4 text-right text-slate-500 dark:text-slate-400">
                      100%
                    </td>
                    <td className="pt-2.5 text-right font-bold text-slate-800 dark:text-white">
                      {goalCalories.toLocaleString()} kcal
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Mathematical Formula
            </h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Mifflin-St Jeor BMR
  Male:   10W + 6.25H - 5A + 5
  Female: 10W + 6.25H - 5A - 161

TDEE = BMR x Activity Factor
  Sedentary:    1.200
  Light:        1.375
  Moderate:     1.550
  Very Active:  1.725
  Extra Active: 1.900

Goal Calories
  Lose Weight:  TDEE - 500 kcal/day
  Maintain:     TDEE
  Gain Weight:  TDEE + 500 kcal/day

Macros (% of Goal Calories)
  Protein: 30% / 4 cal per g
  Carbs:   40% / 4 cal per g
  Fat:     30% / 9 cal per g

W = weight (kg), H = height (cm), A = age (yrs)`}
            </pre>
          </div>

          {/* Your Numbers breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Your Numbers
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  BMR (at rest)
                </span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {Math.round(bmr).toLocaleString()} kcal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Activity multiplier
                </span>
                <span className="font-medium text-slate-800 dark:text-white">
                  x {ACTIVITY_LEVELS[activity]?.factor ?? 1.55}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  TDEE
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(tdee).toLocaleString()} kcal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Goal adjustment
                </span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {goal === "lose"
                    ? "-500 kcal"
                    : goal === "gain"
                    ? "+500 kcal"
                    : "0 kcal"}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Goal Calories
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {goalCalories.toLocaleString()} kcal
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
