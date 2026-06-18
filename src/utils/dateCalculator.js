const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDayOfWeek(date) {
  return DAYS_OF_WEEK[date.getDay()];
}

/**
 * Check if any year in the range [startYear, endYear] is a leap year.
 */
export function rangeIncludesLeapYear(startYear, endYear) {
  for (let y = startYear; y <= endYear; y++) {
    if (isLeapYear(y)) return true;
  }
  return false;
}

/**
 * Count business days (Mon-Fri) between two dates, exclusive of end date.
 */
export function countBusinessDays(start, end) {
  if (end < start) return countBusinessDays(end, start);
  let count = 0;
  const msPerDay = 86400000;
  const current = new Date(start.getTime());
  while (current < end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setTime(current.getTime() + msPerDay);
  }
  return count;
}

/**
 * Mode 1: Calculate the difference between two dates.
 */
export function calculateDateDifference(startDate, endDate) {
  if (!startDate || !endDate) return null;

  let start = startDate;
  let end = endDate;
  let swapped = false;

  if (end < start) {
    [start, end] = [end, start];
    swapped = true;
  }

  // Years, months, days difference
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const msPerDay = 86400000;
  const totalDays = Math.round(Math.abs(end - start) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  const startDayOfWeek = getDayOfWeek(start);
  const endDayOfWeek = getDayOfWeek(end);

  const includesLeapYear = rangeIncludesLeapYear(
    start.getFullYear(),
    end.getFullYear()
  );

  const businessDays = countBusinessDays(start, end);

  const startFormatted = start.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const endFormatted = end.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    startDayOfWeek,
    endDayOfWeek,
    includesLeapYear,
    businessDays,
    startFormatted,
    endFormatted,
    swapped,
  };
}

/**
 * Mode 2: Add or subtract duration from a date.
 */
export function addSubtractDate(
  startDate,
  { years = 0, months = 0, weeks = 0, days = 0 },
  isSubtract = false
) {
  if (!startDate) return null;

  const sign = isSubtract ? -1 : 1;

  const totalDaysToAdd = sign * (weeks * 7 + days);
  const totalMonthsToAdd = sign * (years * 12 + months);

  // Add months first (handles year rollover)
  const result = new Date(startDate.getTime());
  result.setMonth(result.getMonth() + totalMonthsToAdd);

  // If the day overflowed (e.g., Jan 31 + 1 month = Mar 3), clamp to last day of target month
  const expectedMonth =
    ((startDate.getMonth() + totalMonthsToAdd) % 12 + 12) % 12;
  if (result.getMonth() !== expectedMonth) {
    result.setDate(0); // last day of previous month
  }

  // Add days
  result.setDate(result.getDate() + totalDaysToAdd);

  const dayOfWeek = getDayOfWeek(result);
  const msPerDay = 86400000;
  const absTotalDays = Math.round(
    Math.abs(result - startDate) / msPerDay
  );

  const resultFormatted = result.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startFormatted = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    resultDate: result,
    dayOfWeek,
    totalDaysChanged: absTotalDays,
    resultFormatted,
    startFormatted,
    resultYear: result.getFullYear(),
    resultMonth: result.getMonth(),
    resultDay: result.getDate(),
  };
}

/**
 * Generate a mini calendar for the month containing the given date.
 * Returns { year, month, monthName, weeks: [[day|null, ...], ...], highlightDay }
 */
export function generateMiniCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let week = new Array(7).fill(null);
  let dayNum = 1;

  for (let i = firstDay; i < 7 && dayNum <= daysInMonth; i++) {
    week[i] = dayNum++;
  }
  weeks.push(week);

  while (dayNum <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayNum <= daysInMonth; i++) {
      week[i] = dayNum++;
    }
    weeks.push(week);
  }

  return {
    year,
    month,
    monthName,
    weeks,
    highlightDay: date.getDate(),
  };
}
