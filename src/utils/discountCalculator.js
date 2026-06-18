/**
 * Discount & Sales Tax Calculator
 *
 * Computes final price after applying a percentage discount and sales tax.
 * Supports two tax-application modes:
 *   - "after"  (default / standard): tax is applied to the discounted price
 *   - "before": tax is applied to the original price, then discount is taken
 */

/**
 * @param {object} opts
 * @param {number} opts.originalPrice  - sticker price
 * @param {number} opts.discountPct    - discount percentage (0-100)
 * @param {number} opts.taxRate        - sales tax percentage (0-100)
 * @param {"after"|"before"} opts.taxMode - when to apply tax relative to discount
 * @returns {object} breakdown of amounts
 */
export function calculateDiscount({
  originalPrice = 0,
  discountPct = 0,
  taxRate = 0,
  taxMode = "after",
}) {
  const price = Math.max(0, originalPrice);
  const disc = Math.min(Math.max(0, discountPct), 100);
  const tax = Math.max(0, taxRate);

  const discountAmount = price * (disc / 100);
  const priceAfterDiscount = price - discountAmount;

  let taxAmount, finalPrice;

  if (taxMode === "before") {
    // Tax on original price, then subtract discount
    taxAmount = price * (tax / 100);
    finalPrice = price + taxAmount - discountAmount;
  } else {
    // Standard: discount first, then tax on discounted price
    taxAmount = priceAfterDiscount * (tax / 100);
    finalPrice = priceAfterDiscount + taxAmount;
  }

  const totalSavings = price + (price * (tax / 100)) - finalPrice;
  const priceWithoutDiscount = price + price * (tax / 100);
  const savingsPct = price > 0 ? (totalSavings / priceWithoutDiscount) * 100 : 0;

  return {
    originalPrice: price,
    discountPct: disc,
    discountAmount,
    priceAfterDiscount,
    taxRate: tax,
    taxAmount,
    finalPrice,
    totalSavings,
    savingsPct,
    priceWithoutDiscount,
  };
}
