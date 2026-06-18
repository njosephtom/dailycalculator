import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import {
  calculateDateDifference,
  addSubtractDate,
  generateMiniCalendar,
} from "../../utils/dateCalculator";
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
    q: "How does the date difference calculation work?",
    a: "The calculator computes the difference between two dates by first determining the full years, then the remaining full months, and finally the leftover days. This mirrors calendar-based counting. Total days are calculated using the actual millisecond difference between the two dates, which inherently accounts for varying month lengths and leap years.",
  },
  {
    q: "How are business days counted?",
    a: "Business days exclude Saturdays and Sundays. The calculator counts every Monday through Friday between your start and end dates. Public holidays are not excluded since they vary by country and region. For a more precise count, subtract any public holidays that fall within your range from the business days total.",
  },
  {
    q: "How does the calculator handle leap years?",
    a: "A leap year occurs every 4 years, except for years divisible by 100 — unless also divisible by 400. When adding or subtracting dates, the calculator correctly handles February 29. For example, adding 1 year to February 29 will land on February 28 in a non-leap year. The date difference mode also indicates whether any leap year falls within your selected range.",
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

const fmt = (n) => (n != null && isFinite(n) ? n.toLocaleString() : "--");

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function MiniCalendar({ calendar }) {
  if (!calendar) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">
        {calendar.monthName}
      </p>
      <table className="w-full text-center text-xs">
        <thead>
          <tr>
            {DAY_HEADERS.map((d) => (
              <th
                key={d}
                className="py-1 font-semibold text-slate-400 dark:text-slate-500"
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendar.weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <td key={di} className="py-1">
                  {day !== null ? (
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                        day === calendar.highlightDay
                          ? "bg-indigo-600 text-white font-bold"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {day}
                    </span>
                  ) : (
                    <span className="inline-block w-7 h-7" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DateCalculator() {
  const [mode, setMode] = useState("difference"); // "difference" | "addsubtract"

  // Mode 1 state
  const [startDate, setStartDate] = useState(toDateStr(new Date()));
  const [endDate, setEndDate] = useState("");

  // Mode 2 state
  const [baseDate, setBaseDate] = useState(toDateStr(new Date()));
  const [isSubtract, setIsSubtract] = useState(false);
  const [addYears, setAddYears] = useState("");
  const [addMonths, setAddMonths] = useState("");
  const [addWeeks, setAddWeeks] = useState("");
  const [addDays, setAddDays] = useState("");

  // Mode 1 result
  const diffResult = useMemo(() => {
    if (mode !== "difference") return null;
    const s = parseDate(startDate);
    const e = parseDate(endDate);
    if (!s || !e) return null;
    return calculateDateDifference(s, e);
  }, [mode, startDate, endDate]);

  // Mode 2 result
  const addResult = useMemo(() => {
    if (mode !== "addsubtract") return null;
    const base = parseDate(baseDate);
    if (!base) return null;
    const y = parseInt(addYears) || 0;
    const m = parseInt(addMonths) || 0;
    const w = parseInt(addWeeks) || 0;
    const d = parseInt(addDays) || 0;
    if (y === 0 && m === 0 && w === 0 && d === 0) return null;
    return addSubtractDate(base, { years: y, months: m, weeks: w, days: d }, isSubtract);
  }, [mode, baseDate, isSubtract, addYears, addMonths, addWeeks, addDays]);

  const miniCal = useMemo(() => {
    if (!addResult) return null;
    return generateMiniCalendar(addResult.resultDate);
  }, [addResult]);

  // Quick presets
  const presets = useMemo(() => {
    const today = new Date();
    const make = (label, { years = 0, months = 0, days = 0 }) => {
      const r = addSubtractDate(today, { years, months, weeks: 0, days }, false);
      return { label, result: r };
    };
    return [
      make("90 days from today", { days: 90 }),
      make("6 months from today", { months: 6 }),
      make("1 year from today", { years: 1 }),
    ];
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Title */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Date Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find the difference between two dates, or add and subtract time
              from any date.
            </p>
          </div>

          {/* Input form with mode toggle */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
              <button
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  mode === "difference"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
                onClick={() => setMode("difference")}
              >
                Date Difference
              </button>
              <button
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  mode === "addsubtract"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
                onClick={() => setMode("addsubtract")}
              >
                Add / Subtract
              </button>
            </div>

            {mode === "difference" && (
              <>
                <SectionLabel text="Select Dates" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Start Date"
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={setStartDate}
                    autoFocus
                  />
                  <InputField
                    label="End Date"
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={setEndDate}
                  />
                </div>
              </>
            )}

            {mode === "addsubtract" && (
              <>
                <SectionLabel text="Base Date" />
                <InputField
                  label="Start Date"
                  id="baseDate"
                  type="date"
                  value={baseDate}
                  onChange={setBaseDate}
                  autoFocus
                />

                {/* Add / Subtract toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Operation:
                  </span>
                  <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                    <button
                      className={`px-4 py-1.5 text-sm font-semibold transition-colors ${
                        !isSubtract
                          ? "bg-emerald-600 text-white"
                          : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                      }`}
                      onClick={() => setIsSubtract(false)}
                    >
                      Add
                    </button>
                    <button
                      className={`px-4 py-1.5 text-sm font-semibold transition-colors ${
                        isSubtract
                          ? "bg-red-600 text-white"
                          : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                      }`}
                      onClick={() => setIsSubtract(true)}
                    >
                      Subtract
                    </button>
                  </div>
                </div>

                <SectionLabel text="Duration" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InputField
                    label="Years"
                    id="addYears"
                    type="number"
                    value={addYears}
                    onChange={setAddYears}
                    min="0"
                    placeholder="0"
                  />
                  <InputField
                    label="Months"
                    id="addMonths"
                    type="number"
                    value={addMonths}
                    onChange={setAddMonths}
                    min="0"
                    placeholder="0"
                  />
                  <InputField
                    label="Weeks"
                    id="addWeeks"
                    type="number"
                    value={addWeeks}
                    onChange={setAddWeeks}
                    min="0"
                    placeholder="0"
                  />
                  <InputField
                    label="Days"
                    id="addDays"
                    type="number"
                    value={addDays}
                    onChange={setAddDays}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </>
            )}
          </div>

          {/* Mode 1 Results */}
          {mode === "difference" && diffResult && (
            <>
              {/* Primary difference */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Date Difference
                </p>
                <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                  {diffResult.years} years, {diffResult.months} months,{" "}
                  {diffResult.days} days
                </p>
              </div>

              {/* Total metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Days
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(diffResult.totalDays)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Weeks
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(diffResult.totalWeeks)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Hours
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(diffResult.totalHours)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Minutes
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(diffResult.totalMinutes)}
                  </p>
                </div>
              </div>

              {/* Day of week for each date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    Start Date
                  </p>
                  <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                    {diffResult.startDayOfWeek}
                  </p>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                    {diffResult.startFormatted}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    End Date
                  </p>
                  <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                    {diffResult.endDayOfWeek}
                  </p>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                    {diffResult.endFormatted}
                  </p>
                </div>
              </div>

              {/* Business days & leap year */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Business Days
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(diffResult.businessDays)}
                  </p>
                  <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
                    Excludes weekends
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Includes Leap Year?
                  </p>
                  <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                    {diffResult.includesLeapYear ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Mode 2 Results */}
          {mode === "addsubtract" && addResult && (
            <>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Resulting Date
                </p>
                <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                  {addResult.resultFormatted}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Day of the Week
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {addResult.dayOfWeek}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Total Days {isSubtract ? "Subtracted" : "Added"}
                  </p>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {fmt(addResult.totalDaysChanged)}
                  </p>
                </div>
              </div>

              {/* Mini calendar */}
              {miniCal && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                  <MiniCalendar calendar={miniCal} />
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Quick presets */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Quick Presets
            </h2>
            <div className="space-y-3">
              {presets.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {p.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {p.result.dayOfWeek}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {p.result.resultDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reference */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Quick Reference
            </h2>
            <ul className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed space-y-2">
              <li>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  1 week
                </span>{" "}
                = 7 days = 168 hours
              </li>
              <li>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  1 month
                </span>{" "}
                = 28 to 31 days (varies)
              </li>
              <li>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  1 year
                </span>{" "}
                = 365 days (366 in a leap year)
              </li>
              <li>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  1 quarter
                </span>{" "}
                = ~91 days (13 weeks)
              </li>
              <li>
                Business days in a year:{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  ~260
                </span>{" "}
                (excluding holidays)
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              How It Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>Date Difference</strong> mode calculates the exact span
              between two dates in years, months, and days, plus totals in days,
              weeks, hours, and minutes. It also counts business days (weekdays
              only) and checks for leap years in the range.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
              <strong>Add / Subtract</strong> mode lets you offset a date by any
              combination of years, months, weeks, and days. Months are added
              first (with day clamping for short months), then days. The result
              includes a mini calendar highlighting the target date.
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
