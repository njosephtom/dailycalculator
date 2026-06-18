function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  return b === 0 ? a : gcd(b, a % b);
}

export function convertFraction({ whole = 0, numerator, denominator }) {
  if (!denominator || denominator === 0) return null;
  const w = parseInt(whole) || 0;
  const n = parseInt(numerator) || 0;
  const d = parseInt(denominator);

  const negative = (w < 0) || (w === 0 && n < 0);
  const absN = Math.abs(w) * Math.abs(d) + Math.abs(n);
  const absD = Math.abs(d);

  if (absD === 0) return null;

  const g = gcd(absN, absD);
  const simpN = absN / g;
  const simpD = absD / g;
  const decimal = absN / absD;
  const percentage = decimal * 100;

  // Detect repeating decimal period (up to 10 chars)
  let repeatingPart = null;
  if (absD !== 0) {
    let remainder = absN % absD;
    const seen = new Map();
    let decStr = "";
    let pos = 0;
    while (remainder !== 0 && !seen.has(remainder) && pos < 20) {
      seen.set(remainder, pos);
      remainder *= 10;
      decStr += Math.floor(remainder / absD);
      remainder = remainder % absD;
      pos++;
    }
    if (remainder !== 0 && seen.has(remainder)) {
      const start = seen.get(remainder);
      repeatingPart = decStr.slice(start);
    }
  }

  return {
    decimal: negative ? -decimal : decimal,
    percentage: negative ? -percentage : percentage,
    simplified: negative ? `-${simpN}/${simpD}` : `${simpN}/${simpD}`,
    simpN: negative ? -simpN : simpN,
    simpD,
    repeatingPart,
    isNegative: negative,
  };
}
