/** SIP (Systematic Investment Plan) maturity value */
export function calcSIP({ monthlyAmount, annualRate, years }) {
  const n = years * 12;
  const i = annualRate / 100 / 12;
  if (i === 0) return { invested: monthlyAmount * n, returns: 0, total: monthlyAmount * n };
  const total = monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = monthlyAmount * n;
  return { invested, returns: total - invested, total };
}

/** Year-by-year SIP breakdown */
export function sipSchedule({ monthlyAmount, annualRate, years }) {
  const i = annualRate / 100 / 12;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const n = y * 12;
    const total = i === 0 ? monthlyAmount * n : monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = monthlyAmount * n;
    rows.push({ year: y, invested, returns: total - invested, total });
  }
  return rows;
}

/** Lumpsum compound interest */
export function calcLumpsum({ principal, annualRate, years }) {
  const r = annualRate / 100;
  const total = principal * Math.pow(1 + r, years);
  return { invested: principal, returns: total - principal, total };
}

/** Year-by-year lumpsum breakdown */
export function lumpsumSchedule({ principal, annualRate, years }) {
  const r = annualRate / 100;
  return Array.from({ length: years }, (_, idx) => {
    const y = idx + 1;
    const total = principal * Math.pow(1 + r, y);
    return { year: y, invested: principal, returns: total - principal, total };
  });
}
