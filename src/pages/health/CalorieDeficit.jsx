import React, { useState, useMemo, useRef, useEffect } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import {
  calcBMR,
  calcTDEE,
  buildPlan,
  calcMacros,
  minSafeCalories,
  lbsToKg,
  ftInToCm,
  ACTIVITY_LEVELS,
} from "../../utils/calorieDeficit";
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
    q: "What is a calorie deficit?",
    a: "A calorie deficit occurs when you consume fewer calories than your body burns. This forces your body to use stored energy (primarily fat) to make up the difference, resulting in weight loss over time.",
  },
  {
    q: "Is a 500 or 1000 calorie deficit safe?",
    a: "A 500 cal/day deficit (about 1 lb/week loss) is widely considered safe and sustainable. A 1000 cal/day deficit (about 2 lbs/week) can be safe for some individuals but may be too aggressive for others. Never go below 1200 calories/day for women or 1500 calories/day for men without medical supervision.",
  },
  {
    q: "How accurate are these estimates?",
    a: "BMR formulas like Mifflin-St Jeor are accurate to within about 10% for most people. Real-world weight loss may vary due to metabolic adaptation, water retention, muscle changes, and other factors. Use these numbers as a starting point and adjust based on your results.",
  },
  {
    q: "Should I eat back exercise calories?",
    a: "The activity multiplier already accounts for your general exercise level. If you do an unusually intense workout, eating back a portion (about 50%) of those extra calories can help maintain energy levels without stalling progress.",
  },
];

const ACTIVITY_OPTS = Object.entries(ACTIVITY_LEVELS).map(([k, v]) => ({
  value: k,
  label: v.label,
}));

function buildWeeklyProjection(currentKg, goalKg, weeksModerate, weeksAggressive, unit) {
  const maxWeeks = Math.max(weeksModerate, weeksAggressive, 1);
  const capped = Math.min(maxWeeks, 52);
  const step = capped > 26 ? Math.ceil(capped / 26) : 1;
  const toDisplay = (kg) => unit === "metric" ? parseFloat(kg.toFixed(1)) : parseFloat((kg * 2.20462).toFixed(1));
  const lossPerWeekMod = maxWeeks > 0 ? (currentKg - goalKg) / weeksModerate : 0;
  const lossPerWeekAgg = maxWeeks > 0 ? (currentKg - goalKg) / weeksAggressive : 0;

  const points = [];
  for (let w = 0; w <= capped; w += step) {
    const modW = Math.max(goalKg, currentKg - lossPerWeekMod * w);
    const aggW = Math.max(goalKg, currentKg - lossPerWeekAgg * w);
    points.push({ week: w, moderate: toDisplay(modW), aggressive: toDisplay(aggW) });
  }
  if (points[points.length - 1].week !== capped) {
    const modW = Math.max(goalKg, currentKg - lossPerWeekMod * capped);
    const aggW = Math.max(goalKg, currentKg - lossPerWeekAgg * capped);
    points.push({ week: capped, moderate: toDisplay(modW), aggressive: toDisplay(aggW) });
  }
  return { points, goalWeight: toDisplay(goalKg), startWeight: toDisplay(currentKg) };
}

function WeightChart({ data, unit }) {
  const svgRef = useRef(null);
  const [svgW, setSvgW] = useState(500);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setSvgW(e.contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!data || data.points.length < 2) return null;

  const { points, goalWeight, startWeight } = data;
  const W = svgW, H = 220, pad = { t: 15, r: 15, b: 35, l: 50 };
  const plotW = W - pad.l - pad.r, plotH = H - pad.t - pad.b;

  const allVals = points.flatMap(p => [p.moderate, p.aggressive]);
  const minVal = Math.min(...allVals, goalWeight) - 2;
  const maxVal = Math.max(...allVals, startWeight) + 2;
  const range = maxVal - minVal || 1;
  const maxWeek = points[points.length - 1].week;

  const toX = (w) => pad.l + (w / maxWeek) * plotW;
  const toY = (v) => pad.t + plotH - ((v - minVal) / range) * plotH;

  const modLine = points.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.week)} ${toY(p.moderate)}`).join(" ");
  const aggLine = points.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.week)} ${toY(p.aggressive)}`).join(" ");

  const yTicks = 5;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const val = minVal + (range / yTicks) * i;
    return { y: toY(val), label: Math.round(val) };
  });

  const wUnit = unit === "metric" ? "kg" : "lbs";

  return (
    <div className="relative">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220, fontFamily: "'Inter', sans-serif" }}>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={pad.l} y1={g.y} x2={W - pad.r} y2={g.y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.5" />
            <text x={pad.l - 6} y={g.y + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 9 }}>{g.label}</text>
          </g>
        ))}
        {/* Goal weight line */}
        <line x1={pad.l} y1={toY(goalWeight)} x2={W - pad.r} y2={toY(goalWeight)} stroke="currentColor" className="text-indigo-300 dark:text-indigo-600" strokeWidth="1" strokeDasharray="4 3" />
        <text x={W - pad.r + 3} y={toY(goalWeight) + 3} className="fill-indigo-400" style={{ fontSize: 8 }}>Goal</text>

        {/* X axis labels */}
        {points.filter((_, i) => points.length <= 15 || i % Math.ceil(points.length / 12) === 0 || i === points.length - 1).map(p => (
          <text key={p.week} x={toX(p.week)} y={H - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9 }}>W{p.week}</text>
        ))}

        {/* Lines */}
        <path d={modLine} fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={aggLine} fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={toX(p.week)} cy={toY(p.moderate)} r={points.length <= 20 ? 3.5 : 2.5}
              className="fill-emerald-500 dark:fill-emerald-400 stroke-white dark:stroke-slate-800" strokeWidth="1.5"
              onMouseEnter={() => setHovered({ ...p, x: toX(p.week), y: toY(p.moderate) })} onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }} />
            <circle cx={toX(p.week)} cy={toY(p.aggressive)} r={points.length <= 20 ? 3.5 : 2.5}
              className="fill-amber-500 dark:fill-amber-400 stroke-white dark:stroke-slate-800" strokeWidth="1.5"
              onMouseEnter={() => setHovered({ ...p, x: toX(p.week), y: toY(p.aggressive) })} onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }} />
          </g>
        ))}
      </svg>
      {hovered && (
        <div className="absolute pointer-events-none bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded shadow-lg font-sans space-y-0.5"
          style={{ left: Math.min(hovered.x, W - 100), top: hovered.y - 50, transform: "translateX(-50%)" }}>
          <div className="font-semibold">Week {hovered.week}</div>
          <div><span className="text-emerald-400">Moderate:</span> {hovered.moderate} {wUnit}</div>
          <div><span className="text-amber-400">Aggressive:</span> {hovered.aggressive} {wUnit}</div>
        </div>
      )}
    </div>
  );
}

/* ── component ────────────────────────────────────── */

export default function CalorieDeficit() {
  const [unit, setUnit] = useState("imperial");
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("175");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weightLbs, setWeightLbs] = useState("180");
  const [weightKg, setWeightKg] = useState("82");
  const [goalLbs, setGoalLbs] = useState("160");
  const [goalKg, setGoalKg] = useState("73");
  const [activity, setActivity] = useState("moderate");

  /* ── derived values ──────────────────────────────── */
  const { wKg, hCm, gKg } = useMemo(() => {
    if (unit === "metric") {
      return {
        wKg: parseFloat(weightKg) || 0,
        hCm: parseFloat(heightCm) || 0,
        gKg: parseFloat(goalKg) || 0,
      };
    }
    return {
      wKg: lbsToKg(parseFloat(weightLbs) || 0),
      hCm: ftInToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0),
      gKg: lbsToKg(parseFloat(goalLbs) || 0),
    };
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn, goalLbs, goalKg]);

  const ageNum = parseInt(age) || 25;
  const bmr = useMemo(() => calcBMR(wKg, hCm, ageNum, sex), [wKg, hCm, ageNum, sex]);
  const tdee = useMemo(() => calcTDEE(bmr, activity), [bmr, activity]);

  const weightToLoseKg = Math.max(0, wKg - gKg);

  const moderate = useMemo(
    () => buildPlan(tdee, 500, weightToLoseKg, sex),
    [tdee, weightToLoseKg, sex]
  );
  const aggressive = useMemo(
    () => buildPlan(tdee, 1000, weightToLoseKg, sex),
    [tdee, weightToLoseKg, sex]
  );

  const maintenanceMacros = calcMacros(Math.round(tdee));
  const moderateMacros = calcMacros(moderate.dailyCals);
  const aggressiveMacros = calcMacros(aggressive.dailyCals);

  const safeMin = minSafeCalories(sex);

  const projection = useMemo(() => {
    if (weightToLoseKg <= 0 || !moderate.weeksToGoal || !aggressive.weeksToGoal) return null;
    return buildWeeklyProjection(wKg, gKg, moderate.weeksToGoal, aggressive.weeksToGoal, unit);
  }, [wKg, gKg, moderate.weeksToGoal, aggressive.weeksToGoal, unit, weightToLoseKg]);

  const weightUnit = unit === "metric" ? "kg" : "lbs";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Calorie Deficit Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find your daily calorie target to reach your goal weight safely and
              sustainably.
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
                id="age"
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
                  id="hcm"
                  value={heightCm}
                  onChange={setHeightCm}
                  suffix="cm"
                />
              ) : (
                <div className="flex gap-2">
                  <InputField
                    label="Height (ft)"
                    id="hft"
                    value={heightFt}
                    onChange={setHeightFt}
                    suffix="ft"
                  />
                  <InputField
                    label="(in)"
                    id="hin"
                    value={heightIn}
                    onChange={setHeightIn}
                    suffix="in"
                    className="mt-auto"
                  />
                </div>
              )}

              {unit === "metric" ? (
                <InputField
                  label="Current Weight"
                  id="wkg"
                  value={weightKg}
                  onChange={setWeightKg}
                  suffix="kg"
                />
              ) : (
                <InputField
                  label="Current Weight"
                  id="wlbs"
                  value={weightLbs}
                  onChange={setWeightLbs}
                  suffix="lbs"
                />
              )}

              {unit === "metric" ? (
                <InputField
                  label="Goal Weight"
                  id="gkg"
                  value={goalKg}
                  onChange={setGoalKg}
                  suffix="kg"
                />
              ) : (
                <InputField
                  label="Goal Weight"
                  id="glbs"
                  value={goalLbs}
                  onChange={setGoalLbs}
                  suffix="lbs"
                />
              )}

              <SelectField
                label="Activity Level"
                id="act"
                value={activity}
                onChange={setActivity}
                options={ACTIVITY_OPTS}
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Result metric cards — 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* TDEE / Maintenance */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <SectionLabel>Maintenance (TDEE)</SectionLabel>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">
                {Math.round(tdee).toLocaleString()}
              </p>
              <p className="text-xs text-indigo-400 mt-1">kcal / day</p>
            </div>

            {/* Moderate plan */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <SectionLabel>Moderate (-500)</SectionLabel>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {moderate.dailyCals.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                kcal / day &middot; ~1 lb/wk
              </p>
              {weightToLoseKg > 0 && (
                <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1 font-medium">
                  {moderate.weeksToGoal} weeks to goal
                </p>
              )}
            </div>

            {/* Aggressive plan */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <SectionLabel>Aggressive (-1000)</SectionLabel>
              <p className="text-xl font-extrabold text-amber-700 dark:text-amber-300 leading-tight">
                {aggressive.dailyCals.toLocaleString()}
              </p>
              <p className="text-xs text-amber-400 mt-1">
                kcal / day &middot; ~2 lbs/wk
              </p>
              {weightToLoseKg > 0 && (
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-1 font-medium">
                  {aggressive.weeksToGoal} weeks to goal
                </p>
              )}
            </div>
          </div>

          {/* Safety warning */}
          {(moderate.belowMinimum || aggressive.belowMinimum) && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-3 text-xs text-red-700 dark:text-red-400">
              <span className="font-semibold">Warning:</span>{" "}
              {aggressive.belowMinimum && !moderate.belowMinimum
                ? "The aggressive plan"
                : moderate.belowMinimum && aggressive.belowMinimum
                ? "Both plans"
                : "The moderate plan"}{" "}
              would put you below the recommended minimum of{" "}
              <strong>{safeMin.toLocaleString()} kcal/day</strong> for{" "}
              {sex === "male" ? "men" : "women"}. Consult a healthcare
              professional before following a very low calorie diet.
            </div>
          )}

          {/* Macronutrient breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Daily Macronutrient Breakdown
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Protein 30% &middot; Carbs 40% &middot; Fat 30%
            </p>
            <div className="space-y-3">
              {[
                { label: "Maintenance", macros: maintenanceMacros, cals: Math.round(tdee), color: "indigo" },
                { label: "Moderate", macros: moderateMacros, cals: moderate.dailyCals, color: "emerald" },
                { label: "Aggressive", macros: aggressiveMacros, cals: aggressive.dailyCals, color: "amber" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {row.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {row.cals.toLocaleString()} kcal
                    </span>
                  </div>
                  <div className="flex rounded-full h-3 overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <div
                      className="bg-blue-500 dark:bg-blue-400"
                      style={{ width: "30%" }}
                      title={`Protein: ${row.macros.protein}g`}
                    />
                    <div
                      className="bg-yellow-400 dark:bg-yellow-500"
                      style={{ width: "40%" }}
                      title={`Carbs: ${row.macros.carbs}g`}
                    />
                    <div
                      className="bg-rose-400 dark:bg-rose-500"
                      style={{ width: "30%" }}
                      title={`Fat: ${row.macros.fat}g`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Protein {row.macros.protein}g</span>
                    <span>Carbs {row.macros.carbs}g</span>
                    <span>Fat {row.macros.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weight loss projection chart */}
          {projection && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Weekly Weight Loss Projection</h2>
              <div className="flex gap-4 mb-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-1 rounded bg-emerald-500" />Moderate (~1 lb/wk)</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-1 rounded bg-amber-500" />Aggressive (~2 lbs/wk)</span>
              </div>
              <WeightChart data={projection} unit={unit} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Detailed plan comparison table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Plan Comparison
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Metric</th>
                    <th className="pb-2 pr-4 font-semibold">Moderate</th>
                    <th className="pb-2 font-semibold">Aggressive</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Daily Calories</td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white">
                      {moderate.dailyCals.toLocaleString()} kcal
                    </td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white">
                      {aggressive.dailyCals.toLocaleString()} kcal
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Daily Deficit</td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white">500 kcal</td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white">1,000 kcal</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Weekly Loss</td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white">~1 lb (0.45 kg)</td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white">~2 lbs (0.9 kg)</td>
                  </tr>
                  {weightToLoseKg > 0 && (
                    <>
                      <tr className="border-b border-slate-100 dark:border-slate-700/50">
                        <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                          Weight to Lose
                        </td>
                        <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white" colSpan={2}>
                          {unit === "metric"
                            ? `${weightToLoseKg.toFixed(1)} kg`
                            : `${((parseFloat(weightLbs) || 0) - (parseFloat(goalLbs) || 0)).toFixed(1)} lbs`}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-700/50">
                        <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Weeks to Goal</td>
                        <td className="py-2 pr-4 font-medium text-emerald-600 dark:text-emerald-400">
                          {moderate.weeksToGoal} weeks
                        </td>
                        <td className="py-2 font-medium text-amber-600 dark:text-amber-400">
                          {aggressive.weeksToGoal} weeks
                        </td>
                      </tr>
                    </>
                  )}
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Protein</td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white">
                      {moderateMacros.protein}g
                    </td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white">
                      {aggressiveMacros.protein}g
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Carbs</td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white">
                      {moderateMacros.carbs}g
                    </td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white">
                      {aggressiveMacros.carbs}g
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Fat</td>
                    <td className="py-2 pr-4 font-medium text-slate-800 dark:text-white">
                      {moderateMacros.fat}g
                    </td>
                    <td className="py-2 font-medium text-slate-800 dark:text-white">
                      {aggressiveMacros.fat}g
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">Below Minimum?</td>
                    <td className="py-2 pr-4 font-medium">
                      {moderate.belowMinimum ? (
                        <span className="text-red-600 dark:text-red-400">Yes ({safeMin} kcal min)</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">No</span>
                      )}
                    </td>
                    <td className="py-2 font-medium">
                      {aggressive.belowMinimum ? (
                        <span className="text-red-600 dark:text-red-400">Yes ({safeMin} kcal min)</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">No</span>
                      )}
                    </td>
                  </tr>
                </tbody>
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
  Sedentary:  1.200
  Light:      1.375
  Moderate:   1.550
  Very Active: 1.725
  Extra Active: 1.900

Deficit Plans
  Moderate:   TDEE - 500 kcal/day (~1 lb/wk)
  Aggressive: TDEE - 1000 kcal/day (~2 lbs/wk)

W = weight (kg), H = height (cm), A = age (yrs)
1 lb fat ~ 3500 kcal | 1 kg fat ~ 7700 kcal`}
            </pre>
          </div>

          {/* BMR breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Your Numbers
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">BMR (at rest)</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {Math.round(bmr).toLocaleString()} kcal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Activity multiplier</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  x {ACTIVITY_LEVELS[activity]?.factor ?? 1.55}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">TDEE</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(tdee).toLocaleString()} kcal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Min safe calories</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {safeMin.toLocaleString()} kcal ({sex === "male" ? "men" : "women"})
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
