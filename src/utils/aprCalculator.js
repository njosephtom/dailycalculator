import { monthlyPayment } from "./loanCalculator";

/** Newton-Raphson: find monthly rate r where PV = PMT * (1-(1+r)^-n)/r */
function findMonthlyRate(pv, pmt, n, guess = 0.01) {
  let r = guess;
  for (let i = 0; i < 500; i++) {
    const pow = Math.pow(1 + r, n);
    const f   = pmt * (1 - 1 / pow) / r - pv;
    const df  = pmt * (n / (r * pow * (1 + r)) - (1 - 1 / pow) / (r * r));
    const rn  = r - f / df;
    if (!isFinite(rn) || rn <= 0) break;
    if (Math.abs(rn - r) < 1e-12) { r = rn; break; }
    r = rn;
  }
  return r;
}

export function calculateAPR({ loanAmount, fees, termMonths, monthlyPmt }) {
  const nominalRate = findMonthlyRate(loanAmount, monthlyPmt, termMonths) * 12 * 100;
  // APR uses net proceeds (loan - fees up-front)
  const net = loanAmount - fees;
  const aprMonthly = findMonthlyRate(net, monthlyPmt, termMonths);
  const apr = aprMonthly * 12 * 100;
  const effectiveAPR = (Math.pow(1 + aprMonthly, 12) - 1) * 100;
  const totalRepayment = monthlyPmt * termMonths;
  const totalInterest = totalRepayment - loanAmount;

  return { nominalRate, apr, effectiveAPR, totalRepayment, totalInterest };
}

export function autoPayment(loanAmount, annualRate, termMonths) {
  return monthlyPayment(loanAmount, annualRate, termMonths);
}
