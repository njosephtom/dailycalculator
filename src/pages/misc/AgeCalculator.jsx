import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { calculateAge, getMilestones } from "../../utils/ageCalculator";
import { ChevronDown, ChevronUp } from "lucide-react";

function SectionLabel({ text }) {
  return (
    <div className="mb-3">
      <span className="inline-block border border-slate-300 dark:border-slate-600 rounded px-2 py-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {text}
        </span>
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
    q: "How is age calculated in years, months, and days?",
    a: "The calculator computes the difference between the date of birth and the target date. It first determines full years, then remaining full months, and finally leftover days. This mirrors how most people intuitively describe their age — for example, 32 years, 5 months, and 14 days.",
  },
  {
    q: "Does the calculator account for leap years?",
    a: "Yes. Total days alive are computed using the actual calendar difference, which inherently includes all leap days. The calculator also tells you whether you were born in a leap year and correctly handles February 29 birthdays.",
  },
  {
    q: "What is the 1 billion seconds milestone?",
    a: "One billion seconds equals approximately 31 years, 8 months, and 8 days. It is a popular milestone because it converts a familiar unit (seconds) into an impressively large number. Many people celebrate their \"billionth second birthday\" as a fun life event.",
  },
];

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const fmt = (n) => (n != null && isFinite(n) ? n.toLocaleString() : "—");

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [calcAt, setCalcAt] = useState(toDateStr(new Date()));

  const result = useMemo(() => {
    const dobDate = parseDate(dob);
    const calcDate = parseDate(calcAt);
    if (!dobDate || !calcDate) return null;
    return calculateAge(dobDate, calcDate);
  }, [dob, calcAt]);

  const milestones = useMemo(() => {
    const dobDate = parseDate(dob);
    if (!dobDate) return [];
    return getMilestones(dobDate);
  }, [dob]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Title */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Age Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate your exact age, life statistics, zodiac signs, and
              upcoming milestones.
            </p>
          </div>

          {/* Input form */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <SectionLabel text="Date Input" />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Date of Birth"
                id="dob"
                type="date"
                value={dob}
                onChange={setDob}
              />
              <InputField
                label="Calculate Age At"
                id="calcAt"
                type="date"
                value={calcAt}
                onChange={setCalcAt}
              />
            </div>
          </div>

          {/* Primary result — age */}
          {result && (
            <>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Age
                </p>
                <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                  {result.years} years, {result.months} months, {result.days}{" "}
                  days
                </p>
              </div>

              {/* Metric cards — 3 columns */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Days
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(result.totalDays)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Weeks
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(result.totalWeeks)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Months
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(result.totalMonths)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Hours
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(result.totalHours)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Next Birthday In
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(result.daysUntilBirthday)} days
                  </p>
                </div>
              </div>

              {/* Born on */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                  You Were Born On
                </p>
                <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                  {result.dobFormatted}
                </p>
              </div>

              {/* Birth info cards — 3 columns */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    Day of Birth
                  </p>
                  <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                    {result.dayOfBirth}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    Zodiac Sign
                  </p>
                  <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                    {result.zodiacSign}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    Chinese Zodiac
                  </p>
                  <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                    {result.chineseZodiac}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Born in Leap Year?
                  </p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                    {result.bornInLeapYear ? "Yes" : "No"}
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Season of Birth
                  </p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                    {result.season}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Milestones table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Life Milestones
            </h2>
            {milestones.length > 0 ? (
              <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white dark:bg-slate-800">
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                      <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Milestone
                      </th>
                      <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Date
                      </th>
                      <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((m, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-100 dark:border-slate-700/50"
                      >
                        <td className="py-1.5 text-slate-600 dark:text-slate-400">
                          {m.label}
                        </td>
                        <td className="py-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                          {m.date}
                        </td>
                        <td className="py-1.5">
                          {m.passed ? (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              Passed
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                              Upcoming
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Enter a date of birth to see milestones.
              </p>
            )}
          </div>

          {/* Fun facts / reference */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Fun Facts
            </h2>
            <ul className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed space-y-2">
              <li>
                The average human heart beats about{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  100,000 times per day
                </span>{" "}
                — roughly 2.5 billion beats in a lifetime.
              </li>
              <li>
                You take approximately{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  23,000 breaths per day
                </span>
                , or about 8.4 million per year.
              </li>
              <li>
                The oldest verified person lived to{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  122 years and 164 days
                </span>{" "}
                (Jeanne Calment, France).
              </li>
              <li>
                A leap year occurs every 4 years, except for years divisible by
                100 — unless also divisible by 400.
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              How It Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Enter your date of birth and optionally change the target date.
              The calculator instantly computes your exact age, life statistics,
              zodiac signs, and upcoming milestones. All calculations account
              for leap years and varying month lengths.
            </p>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH FAQ */}
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
