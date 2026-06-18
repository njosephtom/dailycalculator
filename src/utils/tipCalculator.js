/**
 * Calculate tip and bill split.
 *
 * @param {number} billAmount   – total bill before tip
 * @param {number} tipPercent   – tip percentage (e.g. 18 for 18%)
 * @param {number} numPeople    – number of people splitting (>=1)
 * @returns {{ tipAmount, totalWithTip, perPerson }}
 */
export function calcTipEven({ billAmount, tipPercent, numPeople }) {
  const bill = parseFloat(billAmount) || 0;
  const tip  = parseFloat(tipPercent) || 0;
  const ppl  = Math.max(1, parseInt(numPeople) || 1);

  const tipAmount    = bill * (tip / 100);
  const totalWithTip = bill + tipAmount;
  const perPerson    = totalWithTip / ppl;

  return { tipAmount, totalWithTip, perPerson };
}

/**
 * Calculate custom (uneven) split where each person's subtotal is known.
 * Tip is distributed proportionally to each person's share of the bill.
 *
 * @param {number}   billAmount  – total bill (used as fallback / validation)
 * @param {number}   tipPercent  – tip percentage
 * @param {{ name: string, amount: number }[]} people – per-person subtotals
 * @returns {{ tipAmount, totalWithTip, breakdown: { name, subtotal, tipShare, total }[] }}
 */
export function calcTipCustom({ tipPercent, people }) {
  const tip = parseFloat(tipPercent) || 0;

  const parsed = people.map(p => ({
    name:     p.name || "Person",
    subtotal: parseFloat(p.amount) || 0,
  }));

  const subtotalSum = parsed.reduce((s, p) => s + p.subtotal, 0);
  const tipAmount   = subtotalSum * (tip / 100);
  const totalWithTip = subtotalSum + tipAmount;

  const breakdown = parsed.map(p => {
    const ratio    = subtotalSum > 0 ? p.subtotal / subtotalSum : 0;
    const tipShare = tipAmount * ratio;
    return {
      name:     p.name,
      subtotal: p.subtotal,
      tipShare,
      total:    p.subtotal + tipShare,
    };
  });

  return { tipAmount, totalWithTip, subtotalSum, breakdown };
}
