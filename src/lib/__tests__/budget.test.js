import { describe, it, expect } from 'vitest';
import { calculateBudgetEstimate } from '@/lib/utils/budget';

describe('calculateBudgetEstimate', () => {
  it('returns the same keys for empty/invalid input as for real input', () => {
    const empty = calculateBudgetEstimate(null);
    const real = calculateBudgetEstimate({ a: { price: 100 } });
    expect(Object.keys(empty).sort()).toEqual(Object.keys(real).sort());
    expect(empty.totalBudget).toBe(0);
  });

  it('sums prices and gives a ±15% range', () => {
    const result = calculateBudgetEstimate({ lyrics: { price: 10000 }, melody: { price: 5000 } });
    expect(result.totalBudget).toBe(15000);
    expect(result.minBudget).toBe(12750);
    expect(result.maxBudget).toBe(17250);
  });

  it('adds tax to the total', () => {
    const result = calculateBudgetEstimate({ a: { price: 10000 } }, { taxRate: 8 });
    expect(result.subtotal).toBe(10000);
    expect(result.tax).toBe(800);
    expect(result.totalBudget).toBe(10800);
  });

  it('flags totals under the minimum budget, but not an empty selection', () => {
    expect(calculateBudgetEstimate({ a: { price: 4000 } }, { minimumBudget: 5000 }).belowMinimum).toBe(true);
    expect(calculateBudgetEstimate({ a: { price: 6000 } }, { minimumBudget: 5000 }).belowMinimum).toBe(false);
    expect(calculateBudgetEstimate({}, { minimumBudget: 5000 }).belowMinimum).toBe(false);
  });

  it('ignores missing prices and invalid options', () => {
    const result = calculateBudgetEstimate({ a: { price: 100 }, b: {} }, { taxRate: -5, minimumBudget: 'abc' });
    expect(result.totalBudget).toBe(100);
    expect(result.belowMinimum).toBe(false);
  });
});
