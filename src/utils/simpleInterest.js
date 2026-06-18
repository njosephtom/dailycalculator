export const CURRENCIES = {
  USD: { symbol: "$", label: "USD ($)" },
  EUR: { symbol: "€", label: "EUR (€)" },
  GBP: { symbol: "£", label: "GBP (£)" },
  INR: { symbol: "₹", label: "INR (₹)" },
  JPY: { symbol: "¥", label: "JPY (¥)" },
};

export const CONTRIB_FREQUENCIES = {
  monthly:      { label: "Monthly",     months: 1  },
  quarterly:    { label: "Quarterly",   months: 3  },
  "half-yearly":{ label: "Half-Yearly", months: 6  },
  yearly:       { label: "Yearly",      months: 12 },
};

/**
 * Builds month-by-month and year-by-year SI schedules.
 * Simple interest: interest accrues only on the principal base
 * (original + contributions), never on previously earned interest.
 */
export function calculateSimpleInterest({
  principal,
  annualRate,
  totalMonths,
  contributionMode,
  contributionAmount,
  contributionFreqMonths,
}) {
  const monthlyRate = annualRate / 100 / 12;
  let principalBase = principal;
  let totalInterest = 0;
  let totalAdditions = 0;
  const schedule = [];

  for (let m = 1; m <= Math.max(totalMonths, 1); m++) {
    let contribution = 0;
    if (contributionMode !== "none" && contributionAmount > 0 && m % contributionFreqMonths === 0) {
      contribution = contributionMode === "additions" ? contributionAmount : -contributionAmount;
      principalBase = Math.max(0, principalBase + contribution);
      totalAdditions += contribution;
    }

    const monthInterest = principalBase * monthlyRate;
    totalInterest += monthInterest;

    schedule.push({
      month: m,
      contribution,
      interest: monthInterest,
      totalAdditions,
      totalInterest,
      balance: principalBase + totalInterest,
    });
  }

  // Aggregate into yearly rows
  const yearlySchedule = [];
  const totalYears = Math.ceil(totalMonths / 12);
  for (let y = 1; y <= totalYears; y++) {
    const rows = schedule.filter((r) => r.month > (y - 1) * 12 && r.month <= y * 12);
    if (!rows.length) continue;
    const last = rows[rows.length - 1];
    yearlySchedule.push({
      year: y,
      contributions: rows.reduce((s, r) => s + r.contribution, 0),
      interest: rows.reduce((s, r) => s + r.interest, 0),
      totalAdditions: last.totalAdditions,
      totalInterest: last.totalInterest,
      balance: last.balance,
    });
  }

  const last = schedule[schedule.length - 1];
  return {
    finalBalance: last?.balance ?? principal,
    interestAccrued: totalInterest,
    initialBalance: principal,
    monthlyInterest: schedule[0]?.interest ?? 0,
    schedule,
    yearlySchedule,
  };
}

export function durationToMonths({ years, months, weeks, days }) {
  const totalDays =
    (parseInt(years)  || 0) * 365 +
    (parseInt(months) || 0) * 30.44 +
    (parseInt(weeks)  || 0) * 7 +
    (parseInt(days)   || 0);
  return Math.max(1, Math.round(totalDays / 30.44));
}

export function monthsFromDates(startISO, endISO) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const diff =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  return Math.max(1, diff);
}

export function addMonths(isoDate, n) {
  const d = new Date(isoDate);
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
