export function futureValue(amount, annualRate, years) {
  return amount * Math.pow(1 + annualRate / 100, years);
}

export function presentValue(amount, annualRate, years) {
  return amount / Math.pow(1 + annualRate / 100, years);
}

export function generateSchedule(amount, annualRate, years, mode = "future") {
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const value = mode === "future"
      ? futureValue(amount, annualRate, y)
      : presentValue(amount, annualRate, y);
    const prev = mode === "future"
      ? futureValue(amount, annualRate, y - 1)
      : presentValue(amount, annualRate, y - 1);
    rows.push({ year: y, value, change: value - prev });
  }
  return rows;
}

// US CPI average annual inflation rates by decade (approximate)
export const HISTORICAL_RATES = [
  { label: "US Average (2010–2023)", rate: 2.9  },
  { label: "US Average (2000–2010)", rate: 2.5  },
  { label: "US Average (1990–2000)", rate: 3.0  },
  { label: "US Average (1980–1990)", rate: 5.6  },
  { label: "UK Average (2010–2023)", rate: 2.8  },
  { label: "EU Average (2010–2023)", rate: 2.1  },
];
