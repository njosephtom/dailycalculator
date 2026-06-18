export function monthlyPayment(principal, annualRate, totalMonths) {
  if (annualRate === 0) return principal / totalMonths;
  const r = annualRate / 100 / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -totalMonths));
}

export function generateLoanSchedule(principal, annualRate, totalMonths, extraMonthly = 0) {
  const r = annualRate / 100 / 12;
  const basePmt = monthlyPayment(principal, annualRate, totalMonths);
  const pmt = basePmt + extraMonthly;
  let balance = principal;
  let totalInterest = 0;
  const schedule = [];

  for (let m = 1; m <= totalMonths * 2 && balance > 0.005; m++) {
    const interestPmt = balance * r;
    const principalPmt = Math.min(pmt - interestPmt, balance);
    balance = Math.max(0, balance - principalPmt);
    totalInterest += interestPmt;

    schedule.push({
      month: m,
      payment: principalPmt + interestPmt,
      principal: principalPmt,
      interest: interestPmt,
      totalInterest,
      balance,
    });
    if (balance <= 0.005) break;
  }

  // Aggregate to yearly
  const yearlySchedule = [];
  const totalYears = Math.ceil(schedule.length / 12);
  for (let y = 1; y <= totalYears; y++) {
    const rows = schedule.filter((r) => r.month > (y - 1) * 12 && r.month <= y * 12);
    if (!rows.length) continue;
    const last = rows[rows.length - 1];
    yearlySchedule.push({
      year: y,
      principal: rows.reduce((s, r) => s + r.principal, 0),
      interest: rows.reduce((s, r) => s + r.interest, 0),
      totalInterest: last.totalInterest,
      balance: last.balance,
    });
  }

  return { schedule, yearlySchedule, basePmt, totalInterest, actualMonths: schedule.length };
}
