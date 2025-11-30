/**
 * Weight Utilities Tests
 * 
 * Tests for weight calculation and validation utilities.
 * These are pure functions - no mocks needed.
 * 
 * @spec openspec/specs/physical-properties-system/spec.md
 */

import {
  isValidWeight,
  roundToHalfTon,
  ceilToHalfTon,
  floorToHalfTon,
  percentOfTonnage,
  percentOfTonnageRounded,
  validateWeight,
} from '@/utils/physical/weightUtils';

// Import custom assertions
import '@/__tests__/helpers/assertions';

describe('Weight Utilities', () => {
  // ============================================================================
  // isValidWeight
  // ============================================================================
  describe('isValidWeight', () => {
    describe('valid weights', () => {
      it.each([
        [0, 'zero weight'],
        [0.5, 'half ton'],
        [1, 'one ton'],
        [50, 'medium mech tonnage'],
        [100, 'assault mech tonnage'],
        [0.25, 'quarter ton'],
        [12.75, 'fractional weight'],
      ])('should accept %s (%s)', (weight) => {
        expect(isValidWeight(weight)).toBe(true);
      });
    });

    describe('invalid weights', () => {
      it.each([
        [-1, 'negative weight'],
        [-0.5, 'negative half ton'],
        [Infinity, 'infinity'],
        [-Infinity, 'negative infinity'],
        [NaN, 'NaN'],
      ])('should reject %s (%s)', (weight) => {
        expect(isValidWeight(weight)).toBe(false);
      });
    });
  });

  // ============================================================================
  // roundToHalfTon
  // ============================================================================
  describe('roundToHalfTon', () => {
    describe('exact half-ton values', () => {
      it.each([
        [0, 0],
        [0.5, 0.5],
        [1, 1],
        [1.5, 1.5],
        [10, 10],
        [10.5, 10.5],
      ])('should return %s unchanged as %s', (input, expected) => {
        expect(roundToHalfTon(input)).toBe(expected);
      });
    });

    describe('rounding to nearest half-ton', () => {
      it.each([
        // Round down cases (< 0.25 from lower half-ton)
        [0.1, 0],
        [0.24, 0],
        [1.1, 1],
        [1.24, 1],
        [5.6, 5.5],
        [5.74, 5.5],
        
        // Round up cases (>= 0.25 from lower half-ton)
        [0.25, 0.5],
        [0.3, 0.5],
        [0.49, 0.5],
        [1.26, 1.5],
        [1.4, 1.5],
        [5.76, 6],
        [5.9, 6],
      ])('should round %s to %s', (input, expected) => {
        expect(roundToHalfTon(input)).toBe(expected);
      });
    });

    describe('edge cases', () => {
      it('should handle Infinity by returning 0', () => {
        expect(roundToHalfTon(Infinity)).toBe(0);
      });

      it('should handle -Infinity by returning 0', () => {
        expect(roundToHalfTon(-Infinity)).toBe(0);
      });

      it('should handle NaN by returning 0', () => {
        expect(roundToHalfTon(NaN)).toBe(0);
      });
    });
  });

  // ============================================================================
  // ceilToHalfTon
  // ============================================================================
  describe('ceilToHalfTon', () => {
    describe('exact half-ton values', () => {
      it.each([
        [0, 0],
        [0.5, 0.5],
        [1, 1],
        [1.5, 1.5],
        [10, 10],
      ])('should return %s unchanged as %s', (input, expected) => {
        expect(ceilToHalfTon(input)).toBe(expected);
      });
    });

    describe('ceiling to next half-ton', () => {
      it.each([
        [0.01, 0.5],
        [0.1, 0.5],
        [0.49, 0.5],
        [0.51, 1],
        [1.01, 1.5],
        [1.49, 1.5],
        [5.01, 5.5],
        [5.51, 6],
        [5.99, 6],
      ])('should ceil %s to %s', (input, expected) => {
        expect(ceilToHalfTon(input)).toBe(expected);
      });
    });

    describe('edge cases', () => {
      it('should handle non-finite numbers by returning 0', () => {
        expect(ceilToHalfTon(Infinity)).toBe(0);
        expect(ceilToHalfTon(-Infinity)).toBe(0);
        expect(ceilToHalfTon(NaN)).toBe(0);
      });
    });
  });

  // ============================================================================
  // floorToHalfTon
  // ============================================================================
  describe('floorToHalfTon', () => {
    describe('exact half-ton values', () => {
      it.each([
        [0, 0],
        [0.5, 0.5],
        [1, 1],
        [1.5, 1.5],
        [10, 10],
      ])('should return %s unchanged as %s', (input, expected) => {
        expect(floorToHalfTon(input)).toBe(expected);
      });
    });

    describe('flooring to previous half-ton', () => {
      it.each([
        [0.49, 0],
        [0.99, 0.5],
        [1.49, 1],
        [1.99, 1.5],
        [5.49, 5],
        [5.99, 5.5],
      ])('should floor %s to %s', (input, expected) => {
        expect(floorToHalfTon(input)).toBe(expected);
      });
    });

    describe('edge cases', () => {
      it('should handle non-finite numbers by returning 0', () => {
        expect(floorToHalfTon(Infinity)).toBe(0);
        expect(floorToHalfTon(-Infinity)).toBe(0);
        expect(floorToHalfTon(NaN)).toBe(0);
      });
    });
  });

  // ============================================================================
  // percentOfTonnage
  // ============================================================================
  describe('percentOfTonnage', () => {
    describe('standard structure calculations', () => {
      // BattleTech: Standard structure is 10% of tonnage
      it.each([
        [0.10, 20, 2],    // Light mech: 20 × 0.10 = 2 tons
        [0.10, 50, 5],    // Medium mech: 50 × 0.10 = 5 tons
        [0.10, 75, 7.5],  // Heavy mech: 75 × 0.10 = 7.5 tons
        [0.10, 100, 10],  // Assault mech: 100 × 0.10 = 10 tons
      ])('%s of %s tons = %s tons', (percentage, tonnage, expected) => {
        expect(percentOfTonnage(percentage, tonnage)).toBe(expected);
      });
    });

    describe('endo steel calculations', () => {
      // BattleTech: Endo Steel is 5% of tonnage
      it.each([
        [0.05, 20, 1],    // Light mech: 20 × 0.05 = 1 ton
        [0.05, 50, 2.5],  // Medium mech: 50 × 0.05 = 2.5 tons
        [0.05, 75, 3.75], // Heavy mech: 75 × 0.05 = 3.75 tons
        [0.05, 100, 5],   // Assault mech: 100 × 0.05 = 5 tons
      ])('%s of %s tons = %s tons', (percentage, tonnage, expected) => {
        expect(percentOfTonnage(percentage, tonnage)).toBe(expected);
      });
    });

    describe('edge cases', () => {
      it('should handle zero percentage', () => {
        expect(percentOfTonnage(0, 100)).toBe(0);
      });

      it('should handle zero tonnage', () => {
        expect(percentOfTonnage(0.10, 0)).toBe(0);
      });

      it('should handle non-finite inputs by returning 0', () => {
        expect(percentOfTonnage(NaN, 50)).toBe(0);
        expect(percentOfTonnage(0.10, NaN)).toBe(0);
        expect(percentOfTonnage(Infinity, 50)).toBe(0);
      });
    });
  });

  // ============================================================================
  // percentOfTonnageRounded
  // ============================================================================
  describe('percentOfTonnageRounded', () => {
    describe('structure weight calculations', () => {
      it.each([
        // Standard structure (10%)
        [0.10, 35, 3.5],  // 35 × 0.10 = 3.5 (exact half-ton)
        [0.10, 45, 4.5],  // 45 × 0.10 = 4.5 (exact half-ton)
        
        // Endo Steel (5%)
        [0.05, 35, 2],    // 35 × 0.05 = 1.75 → rounds to 2
        [0.05, 45, 2.5],  // 45 × 0.05 = 2.25 → rounds to 2.5 (edge case: 0.25 rounds up)
        [0.05, 55, 3],    // 55 × 0.05 = 2.75 → rounds to 3
        [0.05, 65, 3.5],  // 65 × 0.05 = 3.25 → rounds to 3.5
      ])('%s of %s tons = %s tons (rounded)', (percentage, tonnage, expected) => {
        expect(percentOfTonnageRounded(percentage, tonnage)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // validateWeight
  // ============================================================================
  describe('validateWeight', () => {
    describe('valid weights', () => {
      it('should validate zero weight', () => {
        const result = validateWeight(0);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate positive weight', () => {
        const result = validateWeight(50);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate fractional weight', () => {
        const result = validateWeight(3.75);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('invalid weights', () => {
      it('should reject negative weight', () => {
        const result = validateWeight(-5);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Weight cannot be negative');
      });

      it('should reject NaN', () => {
        const result = validateWeight(NaN);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Weight must be a finite number');
      });

      it('should reject Infinity', () => {
        const result = validateWeight(Infinity);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Weight must be a finite number');
      });
    });

    describe('context in error messages', () => {
      it('should include context in error message', () => {
        const result = validateWeight(-5, 'Engine');
        expect(result.errors[0]).toContain('Engine:');
      });

      it('should work without context', () => {
        const result = validateWeight(-5);
        expect(result.errors[0]).not.toContain(':');
      });
    });
  });

  // ============================================================================
  // Custom Matchers Tests
  // ============================================================================
  describe('custom matchers', () => {
    describe('toBeHalfTonIncrement', () => {
      it('should pass for half-ton values', () => {
        expect(0).toBeHalfTonIncrement();
        expect(0.5).toBeHalfTonIncrement();
        expect(1).toBeHalfTonIncrement();
        expect(1.5).toBeHalfTonIncrement();
        expect(10.5).toBeHalfTonIncrement();
      });

      it('should fail for non-half-ton values', () => {
        expect(0.3).not.toBeHalfTonIncrement();
        expect(1.25).not.toBeHalfTonIncrement();
        expect(2.7).not.toBeHalfTonIncrement();
      });
    });

    describe('toBeValidWeight', () => {
      it('should pass for weights within tolerance', () => {
        expect(5).toBeValidWeight(5);
        expect(5.25).toBeValidWeight(5);
        expect(4.75).toBeValidWeight(5);
      });

      it('should fail for weights outside tolerance', () => {
        expect(5).not.toBeValidWeight(6);
        expect(4).not.toBeValidWeight(5);
      });
    });
  });
});

