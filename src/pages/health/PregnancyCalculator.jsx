import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  dueDateFromLMP,
  dueDateFromUltrasound,
  lmpFromDueDate,
  conceptionDate,
  gestationalAge,
  trimesterInfo,
  milestones,
  formatDate,
  toISODate,
} from "../../utils/pregnancyCalculator";

/* ── Local helper components ── */

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
      {open && <p className="pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>}
    </div>
  );
}

/* ── Constants ── */

const MODES = [
  { value: "lmp", label: "Last Menstrual Period" },
  { value: "ultrasound", label: "Ultrasound" },
  { value: "duedate", label: "Known Due Date" },
];

const CYCLE_OPTIONS = Array.from({ length: 26 }, (_, i) => ({
  value: String(i + 20),
  label: `${i + 20} days`,
}));

const WEEK_OPTIONS = Array.from({ length: 43 }, (_, i) => ({
  value: String(i),
  label: `${i} weeks`,
}));

const DAY_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  value: String(i),
  label: `${i} days`,
}));

const FAQS = [
  {
    q: "How accurate is Naegele's Rule for predicting a due date?",
    a: "Naegele's Rule provides a good estimate but only about 5% of babies arrive on the exact due date. Most births occur within two weeks before or after the estimated date. First-trimester ultrasounds are generally more accurate for dating than LMP-based calculations.",
  },
  {
    q: "Why does cycle length matter for due date calculation?",
    a: "Naegele's Rule assumes a standard 28-day cycle with ovulation on day 14. If your cycle is longer or shorter, ovulation likely occurs earlier or later, shifting the conception date. The calculator adjusts by adding or subtracting the difference from 28 days.",
  },
  {
    q: "What is the difference between gestational age and fetal age?",
    a: "Gestational age counts from the first day of your last menstrual period (LMP), which is typically about two weeks before conception. Fetal age (also called embryonic age) counts from the estimated date of conception. Gestational age is the standard used by healthcare providers.",
  },
  {
    q: "When should I get a dating ultrasound?",
    a: "A dating ultrasound is most accurate between 8 and 13 weeks of pregnancy. At this stage, embryo size is consistent across pregnancies, so crown-rump length measurements can estimate gestational age within about 5 days. Later ultrasounds are less precise for dating.",
  },
];

/* ── Main component ── */

export default function PregnancyCalculator() {
  const [mode, setMode] = useState("lmp");

  // LMP mode
  const [lmpDate, setLmpDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  // Ultrasound mode
  const [usDate, setUsDate] = useState("");
  const [usWeeks, setUsWeeks] = useState("8");
  const [usDays, setUsDays] = useState("0");

  // Known due date mode
  const [knownDueDate, setKnownDueDate] = useState("");

  // Computed results
  const results = useMemo(() => {
    let dueDate = null;
    let effectiveLmp = null;

    if (mode === "lmp" && lmpDate) {
      dueDate = dueDateFromLMP(lmpDate, parseInt(cycleLength, 10));
      effectiveLmp = new Date(lmpDate);
    } else if (mode === "ultrasound" && usDate) {
      dueDate = dueDateFromUltrasound(usDate, parseInt(usWeeks, 10), parseInt(usDays, 10));
      if (dueDate) {
        effectiveLmp = lmpFromDueDate(dueDate);
      }
    } else if (mode === "duedate" && knownDueDate) {
      dueDate = new Date(knownDueDate);
      effectiveLmp = lmpFromDueDate(dueDate);
    }

    if (!dueDate || !effectiveLmp) return null;

    const conception = conceptionDate(effectiveLmp);
    const age = gestationalAge(effectiveLmp);
    const trimester = trimesterInfo(effectiveLmp, dueDate);
    const ms = milestones(effectiveLmp);

    return { dueDate, effectiveLmp, conception, age, trimester, milestones: ms };
  }, [mode, lmpDate, cycleLength, usDate, usWeeks, usDays, knownDueDate]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Pregnancy Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Estimate your due date, gestational age, trimester, and key milestones.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <SectionLabel text="Calculation Method" />

            {/* Mode toggle */}
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  aria-pressed={mode === m.value}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                    mode === m.value
                      ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Mode-specific inputs */}
            {mode === "lmp" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="First day of last period"
                  id="lmp-date"
                  type="date"
                  value={lmpDate}
                  onChange={setLmpDate}
                />
                <SelectField
                  label="Average cycle length"
                  id="cycle-length"
                  value={cycleLength}
                  onChange={setCycleLength}
                  options={CYCLE_OPTIONS}
                />
              </div>
            )}

            {mode === "ultrasound" && (
              <div className="space-y-4">
                <InputField
                  label="Date of ultrasound"
                  id="us-date"
                  type="date"
                  value={usDate}
                  onChange={setUsDate}
                />
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Weeks pregnant at scan"
                    id="us-weeks"
                    value={usWeeks}
                    onChange={setUsWeeks}
                    options={WEEK_OPTIONS}
                  />
                  <SelectField
                    label="Days"
                    id="us-days"
                    value={usDays}
                    onChange={setUsDays}
                    options={DAY_OPTIONS}
                  />
                </div>
              </div>
            )}

            {mode === "duedate" && (
              <InputField
                label="Projected due date"
                id="known-due-date"
                type="date"
                value={knownDueDate}
                onChange={setKnownDueDate}
              />
            )}
          </div>

          {/* Result metric cards */}
          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due date */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Estimated Due Date</p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{formatDate(results.dueDate)}</p>
                </div>

                {/* Gestational age */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Current Gestational Age</p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {results.age.weeks}w {results.age.days}d
                  </p>
                </div>

                {/* Conception date */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Estimated Conception</p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{formatDate(results.conception)}</p>
                </div>

                {/* Trimester */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Current Trimester</p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{results.trimester?.label ?? "—"}</p>
                </div>
              </div>

              {/* Trimester breakdown */}
              {results.trimester && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Trimester Timeline</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {results.trimester.trimesters.map((t, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-3 text-center ${
                          results.trimester.current === i + 1
                            ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600"
                            : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{t.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t.weeks}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {formatDate(t.start)} - {formatDate(t.end)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* Milestones timeline table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Key Milestones</h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Week</th>
                    <th className="pb-2 pr-4 font-semibold">Milestone</th>
                    <th className="pb-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results ? (
                    results.milestones.map((m, i) => (
                      <tr
                        key={i}
                        className={`border-b border-slate-100 dark:border-slate-700/50 ${
                          m.passed ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-1.5 pr-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{m.week}</td>
                        <td className="py-1.5 pr-4 text-slate-600 dark:text-slate-400">{m.label}</td>
                        <td className="py-1.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(m.date)}
                          {m.passed && <span className="ml-1.5 text-[10px] text-emerald-500 font-semibold align-middle">&#10003;</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-slate-400 dark:text-slate-500 text-xs">
                        Enter a date above to see milestones
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Naegele's Rule
Due Date = LMP + 280 days

Cycle-length adjustment
Due Date = LMP + 280 + (cycleLength − 28) days

Conception estimate
Conception ≈ LMP + 14 days

Gestational age
Age = (today − LMP) in weeks + days`}
            </pre>
          </div>
        </div>
      </div>

      {/* Full-width FAQ */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Frequently Asked Questions</h2>
        {FAQS.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </div>
  );
}
