const COMPOUND_FREQ = { Daily: 365, Monthly: 12, Quarterly: 4, Annually: 1 };

export function calculateCompoundInterest({
  principal,
  monthlyDeposit,
  annualRate,
  years,
  months,
  compoundFrequency,
}) {
  const n = COMPOUND_FREQ[compoundFrequency] ?? 12;
  const r = annualRate / 100;
  const totalMonths = years * 12 + months;
  let balance = principal;
  const schedule = [];

  for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
    const monthsInYear = Math.min(12, totalMonths - (year - 1) * 12);
    let yearlyDeposits = 0;
    let yearlyInterest = 0;

    for (let m = 0; m < monthsInYear; m++) {
      const monthlyInterest = balance * (r / n) * (n / 12);
      yearlyInterest += monthlyInterest;
      balance += monthlyInterest + monthlyDeposit;
      yearlyDeposits += monthlyDeposit;
    }

    schedule.push({
      year,
      yearlyDeposit: yearlyDeposits,
      interestEarned: yearlyInterest,
      totalBalance: balance,
    });
  }

  const totalDeposits = principal + monthlyDeposit * totalMonths;
  const totalInterest = balance - totalDeposits;

  return { finalBalance: balance, totalDeposits, totalInterest, schedule };
}
