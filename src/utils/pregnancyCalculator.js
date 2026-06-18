/**
 * Pregnancy Calculator utilities
 * Uses Naegele's Rule: Due Date = LMP + 280 days (adjusted for cycle length)
 */

const MS_PER_DAY = 86400000;

/**
 * Calculate due date from Last Menstrual Period.
 * Naegele's Rule: LMP + 280 days, adjusted for cycle length.
 * Adjustment: add (cycleLength - 28) days.
 */
export function dueDateFromLMP(lmpDate, cycleLength = 28) {
  const lmp = new Date(lmpDate);
  if (isNaN(lmp.getTime())) return null;
  const adjustedDays = 280 + (cycleLength - 28);
  const due = new Date(lmp.getTime() + adjustedDays * MS_PER_DAY);
  return due;
}

/**
 * Calculate due date from ultrasound date and gestational age at that time.
 */
export function dueDateFromUltrasound(ultrasoundDate, weeksAtUS, daysAtUS) {
  const us = new Date(ultrasoundDate);
  if (isNaN(us.getTime())) return null;
  const totalDaysAtUS = weeksAtUS * 7 + daysAtUS;
  const remainingDays = 280 - totalDaysAtUS;
  const due = new Date(us.getTime() + remainingDays * MS_PER_DAY);
  return due;
}

/**
 * Calculate LMP from a known due date (reverse Naegele with default 28-day cycle).
 */
export function lmpFromDueDate(dueDate) {
  const dd = new Date(dueDate);
  if (isNaN(dd.getTime())) return null;
  return new Date(dd.getTime() - 280 * MS_PER_DAY);
}

/**
 * Calculate estimated conception date (approximately LMP + 14 days).
 */
export function conceptionDate(lmpDate) {
  const lmp = new Date(lmpDate);
  if (isNaN(lmp.getTime())) return null;
  return new Date(lmp.getTime() + 14 * MS_PER_DAY);
}

/**
 * Calculate gestational age in weeks and days from LMP to a reference date.
 */
export function gestationalAge(lmpDate, referenceDate = new Date()) {
  const lmp = new Date(lmpDate);
  const ref = new Date(referenceDate);
  if (isNaN(lmp.getTime()) || isNaN(ref.getTime())) return null;
  const diffMs = ref.getTime() - lmp.getTime();
  if (diffMs < 0) return { weeks: 0, days: 0, totalDays: 0 };
  const totalDays = Math.floor(diffMs / MS_PER_DAY);
  return {
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
    totalDays,
  };
}

/**
 * Determine trimester information from gestational age.
 * First trimester:  weeks 1-12  (days 1-84)
 * Second trimester: weeks 13-27 (days 85-189)
 * Third trimester:  weeks 28-40 (days 190-280)
 */
export function trimesterInfo(lmpDate, dueDate) {
  const lmp = new Date(lmpDate);
  const due = new Date(dueDate);
  if (isNaN(lmp.getTime()) || isNaN(due.getTime())) return null;

  const age = gestationalAge(lmp, new Date());
  if (!age) return null;

  const addDays = (base, d) => new Date(base.getTime() + d * MS_PER_DAY);

  let current;
  if (age.totalDays <= 84) current = 1;
  else if (age.totalDays <= 189) current = 2;
  else current = 3;

  return {
    current,
    label: current === 1 ? "First Trimester" : current === 2 ? "Second Trimester" : "Third Trimester",
    trimesters: [
      { name: "First Trimester", start: lmp, end: addDays(lmp, 84), weeks: "Weeks 1-12" },
      { name: "Second Trimester", start: addDays(lmp, 85), end: addDays(lmp, 189), weeks: "Weeks 13-27" },
      { name: "Third Trimester", start: addDays(lmp, 190), end: due, weeks: "Weeks 28-40" },
    ],
  };
}

/**
 * Generate key pregnancy milestones timeline.
 */
export function milestones(lmpDate) {
  const lmp = new Date(lmpDate);
  if (isNaN(lmp.getTime())) return [];

  const addDays = (d) => new Date(lmp.getTime() + d * MS_PER_DAY);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const items = [
    { week: "4w", label: "Missed period / positive test", date: addDays(28) },
    { week: "6w", label: "First heartbeat detectable", date: addDays(42) },
    { week: "8w", label: "First prenatal visit (typical)", date: addDays(56) },
    { week: "12w", label: "End of first trimester", date: addDays(84) },
    { week: "13w", label: "Start of second trimester", date: addDays(91) },
    { week: "16-20w", label: "First fetal movements felt", date: addDays(112) },
    { week: "20w", label: "Anatomy scan / halfway point", date: addDays(140) },
    { week: "24w", label: "Viability milestone", date: addDays(168) },
    { week: "28w", label: "Start of third trimester", date: addDays(196) },
    { week: "37w", label: "Full term begins", date: addDays(259) },
    { week: "40w", label: "Estimated due date", date: addDays(280) },
  ];

  return items.map((m) => ({
    ...m,
    passed: today >= m.date,
  }));
}

/**
 * Format a date as a readable string (e.g. "Jun 17, 2026").
 */
export function formatDate(date) {
  if (!date || isNaN(new Date(date).getTime())) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date as YYYY-MM-DD for input[type=date] value.
 */
export function toISODate(date) {
  if (!date || isNaN(new Date(date).getTime())) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
