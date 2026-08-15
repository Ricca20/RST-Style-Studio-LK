/**
 * Calculates the estimated budget range based on selected collaborators/services.
 * @param {Object} selections - The selected options map.
 * @returns {Object} An object containing the total, min, and max budget estimates.
 */
export function calculateBudgetEstimate(selections) {
  if (!selections || typeof selections !== 'object') {
    return { total: 0, min: 0, max: 0 };
  }
  
  const totalBudget = Object.values(selections).reduce((sum, sel) => sum + (sel?.price || 0), 0);
  const minBudget = Math.floor(totalBudget * 0.85);
  const maxBudget = Math.ceil(totalBudget * 1.15);
  
  return { 
    totalBudget, 
    minBudget, 
    maxBudget 
  };
}
