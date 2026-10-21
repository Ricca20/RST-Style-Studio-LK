/**
 * Calculates the estimated budget range based on selected collaborators/services.
 * @param {Object} selections - The selected options map.
 * @param {Object} [options]
 * @param {number} [options.taxRate=0] - Tax percentage from StudioSettings (e.g. 8 for 8%).
 * @param {number} [options.minimumBudget=0] - Minimum project budget from StudioSettings.
 * @returns {Object} subtotal, tax, totalBudget (incl. tax), the ±15% min/max range,
 *   and whether the total falls below the studio's minimum budget.
 */
export function calculateBudgetEstimate(selections, { taxRate = 0, minimumBudget = 0 } = {}) {
  const safeTaxRate = Number(taxRate) > 0 ? Number(taxRate) : 0;
  const safeMinimum = Number(minimumBudget) > 0 ? Number(minimumBudget) : 0;

  const subtotal = selections && typeof selections === 'object'
    ? Object.values(selections).reduce((sum, sel) => sum + (sel?.price || 0), 0)
    : 0;

  const tax = Math.round(subtotal * (safeTaxRate / 100));
  const totalBudget = subtotal + tax;
  const minBudget = Math.floor(totalBudget * 0.85);
  const maxBudget = Math.ceil(totalBudget * 1.15);

  return {
    subtotal,
    tax,
    totalBudget,
    minBudget,
    maxBudget,
    belowMinimum: totalBudget > 0 && safeMinimum > 0 && totalBudget < safeMinimum,
  };
}
