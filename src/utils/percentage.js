export function whatIsXPercentOfY(x, y) {
  if (isNaN(x) || isNaN(y)) return null;
  return (x / 100) * y;
}

export function xIsWhatPercentOfY(x, y) {
  if (isNaN(x) || isNaN(y) || y === 0) return null;
  return (x / y) * 100;
}

export function percentageChangeBetween(from, to) {
  if (isNaN(from) || isNaN(to) || from === 0) return null;
  return ((to - from) / Math.abs(from)) * 100;
}

export function applyPercentageTo(x, pct) {
  if (isNaN(x) || isNaN(pct)) return null;
  const delta = (pct / 100) * x;
  return { increased: x + delta, decreased: x - delta, delta };
}

export function xIsYPercentOfWhat(x, pct) {
  if (isNaN(x) || isNaN(pct) || pct === 0) return null;
  return (x / pct) * 100;
}
